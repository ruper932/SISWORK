/**
 * authController.js — Lógica de autenticación
 * Servicio_auth / SISWORK
 *
 * Usa pgcrypto (crypt / gen_salt) igual que el schema SQL.
 * bcryptjs solo se usa para comparar desde JS sin extensión adicional.
 */

const pool = require('./db');
const jwt  = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET     = process.env.JWT_SECRET     || 'siswork_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/* ── Helper: generar token ─────────────────────────────────── */
function generarToken(usuario) {
  return jwt.sign(
    {
      id:    usuario.id_usuario,
      email: usuario.correo,
      rol:   usuario.rol,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/* ── Helper: registrar auditoría ───────────────────────────── */
async function registrarAuditoria(client, { id_usuario, accion, ip, user_agent }) {
  try {
    await client.query(
      `INSERT INTO registros_auditoria (id_usuario_actor, accion, ip_address, user_agent)
       VALUES ($1, $2, $3, $4)`,
      [id_usuario, accion, ip || null, user_agent || null]
    );
  } catch {
    // La auditoría no debe romper el flujo principal
  }
}

/* ══════════════════════════════════════════════════════════════
   POST /api/auth/login
   Body: { email, password }
══════════════════════════════════════════════════════════════ */
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }

  const client = await pool.connect();
  try {
    // 1. Buscar usuario activo por correo
    const { rows } = await client.query(
      `SELECT id_usuario, nombres, apellidos, correo, contrasena_hash,
              rol, estado, intentos_fallidos, foto_perfil_url
       FROM usuarios
       WHERE correo = $1
         AND eliminado_en IS NULL`,
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const usuario = rows[0];

    // 2. Verificar estado de la cuenta
    if (usuario.estado === 'suspendido') {
      return res.status(403).json({ message: 'Tu cuenta está suspendida. Contacta a soporte.' });
    }
    if (usuario.estado === 'bloqueado') {
      return res.status(403).json({ message: 'Tu cuenta está bloqueada por demasiados intentos fallidos.' });
    }
    if (usuario.estado === 'eliminado') {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // 3. Verificar contraseña usando pgcrypto (crypt del lado de la BD)
    const { rows: check } = await client.query(
      `SELECT (contrasena_hash = crypt($1, contrasena_hash)) AS coincide
       FROM usuarios WHERE id_usuario = $2`,
      [password, usuario.id_usuario]
    );

    const passwordCorrecta = check[0]?.coincide;

    if (!passwordCorrecta) {
      // Incrementar intentos fallidos
      const nuevosIntentos = usuario.intentos_fallidos + 1;
      const nuevoEstado    = nuevosIntentos >= 5 ? 'bloqueado' : usuario.estado;

      await client.query(
        `UPDATE usuarios
         SET intentos_fallidos = $1, estado = $2
         WHERE id_usuario = $3`,
        [nuevosIntentos, nuevoEstado, usuario.id_usuario]
      );

      if (nuevoEstado === 'bloqueado') {
        return res.status(403).json({ message: 'Cuenta bloqueada por múltiples intentos fallidos. Contacta a soporte.' });
      }

      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // 4. Login exitoso — resetear intentos y actualizar último acceso
    await client.query(
      `UPDATE usuarios
       SET intentos_fallidos = 0,
           ultimo_acceso_en  = CURRENT_TIMESTAMP
       WHERE id_usuario = $1`,
      [usuario.id_usuario]
    );

    // 5. Registrar auditoría
    await registrarAuditoria(client, {
      id_usuario: usuario.id_usuario,
      accion:     'login',
      ip:         req.ip,
      user_agent: req.headers['user-agent'],
    });

    // 6. Generar y devolver token
    const token = generarToken(usuario);

    return res.status(200).json({
      token,
      user: {
        id:       usuario.id_usuario,
        nombres:  usuario.nombres,
        apellidos:usuario.apellidos,
        correo:   usuario.correo,
        rol:      usuario.rol,
        foto:     usuario.foto_perfil_url || null,
      },
    });

  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    client.release();
  }
}

/* ══════════════════════════════════════════════════════════════
   POST /api/auth/logout
   Header: Authorization: Bearer <token>
══════════════════════════════════════════════════════════════ */
async function logout(req, res) {
  const client = await pool.connect();
  try {
    if (req.user) {
      await registrarAuditoria(client, {
        id_usuario: req.user.id,
        accion:     'logout',
        ip:         req.ip,
        user_agent: req.headers['user-agent'],
      });
    }
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    console.error('Error en logout:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    client.release();
  }
}

/* ══════════════════════════════════════════════════════════════
   POST /api/auth/forgot-password
   Body: { email }
══════════════════════════════════════════════════════════════ */
async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'El correo es requerido' });
  }

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT id_usuario FROM usuarios
       WHERE correo = $1 AND eliminado_en IS NULL AND estado = 'activo'`,
      [email.toLowerCase().trim()]
    );

    // Respuesta siempre igual por seguridad (no revelar si el correo existe)
    if (rows.length === 0) {
      return res.status(200).json({ message: 'Si el correo existe, recibirás un enlace de recuperación.' });
    }

    // Generar token de recuperación (válido 1 hora)
    const tokenRecuperacion = require('crypto').randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 60 * 60 * 1000); // +1 hora

    await client.query(
      `UPDATE usuarios
       SET token_recuperacion = $1,
           token_recuperacion_expira_en = $2
       WHERE id_usuario = $3`,
      [tokenRecuperacion, expira, rows[0].id_usuario]
    );

    // TODO: integrar con servicio de correo (Servicio_notificaciones)
    console.log(`🔑 Token de recuperación para ${email}: ${tokenRecuperacion}`);

    return res.status(200).json({ message: 'Si el correo existe, recibirás un enlace de recuperación.' });

  } catch (err) {
    console.error('Error en forgot-password:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    client.release();
  }
}

/* ══════════════════════════════════════════════════════════════
   GET /api/auth/me
   Header: Authorization: Bearer <token>
══════════════════════════════════════════════════════════════ */
async function getMe(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id_usuario, nombres, apellidos, correo,
              rol, estado, foto_perfil_url, ultimo_acceso_en
       FROM usuarios
       WHERE id_usuario = $1 AND eliminado_en IS NULL`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error('Error en getMe:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = { login, logout, forgotPassword, getMe };