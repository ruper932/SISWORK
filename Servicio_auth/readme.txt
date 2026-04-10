# Servicio_auth — SISWORK

Microservicio de autenticación. Gestiona login, logout y recuperación de contraseña conectándose a la base de datos PostgreSQL `siswork_db`.

---

## Estructura

```
Servicio_auth/
├── server.js           ← Punto de entrada (Express)
├── db.js               ← Pool de conexión a PostgreSQL
├── authController.js   ← Lógica de cada endpoint
├── authMiddleware.js   ← Verificación de JWT
├── .env                ← Variables de entorno (NO subir a git)
├── package.json
│
├── index.html          ← Frontend: formulario de login
├── css/
│   └── auth.css
└── js/
    ├── utils.js
    ├── api.js
    └── auth.js
```

---

## Requisitos previos

- Node.js 18+
- PostgreSQL corriendo en XAMPP (puerto **5432**)
- Base de datos `siswork_db` creada con el script SQL del proyecto

---

## Instalación

```bash
# Desde la carpeta Servicio_auth
npm install
```

---

## Configuración

Edita el archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=siswork_db
DB_USER=postgres
DB_PASSWORD=           # tu contraseña de postgres (puede estar vacía en XAMPP)

JWT_SECRET=siswork_secret_key_cambiar_en_produccion
JWT_EXPIRES_IN=8h

PORT=3001
```

---

## Arrancar el servidor

```bash
# Producción
npm start

# Desarrollo (recarga automática, Node 18+)
npm run dev
```

El servidor queda disponible en `http://localhost:3001`

---

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | No | Iniciar sesión |
| `POST` | `/api/auth/logout` | JWT | Cerrar sesión |
| `POST` | `/api/auth/forgot-password` | No | Recuperar contraseña |
| `GET`  | `/api/auth/me` | JWT | Perfil del usuario autenticado |
| `GET`  | `/api/auth/health` | No | Estado del servicio |

---

## Ejemplo de login

**Request:**
```json
POST /api/auth/login
{
  "email": "admin@siswork.local",
  "password": "Admin123*"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "uuid",
    "nombres": "Admin",
    "apellidos": "SISWORK",
    "correo": "admin@siswork.local",
    "rol": "administrador",
    "foto": null
  }
}
```

---

## Seguridad implementada

- Contraseñas verificadas con `pgcrypto` (bcrypt en la BD, igual que el schema)
- Bloqueo automático tras **5 intentos fallidos**
- Token JWT con expiración configurable
- Auditoría automática de login/logout en tabla `registros_auditoria`
- Respuesta genérica en `forgot-password` (no revela si el correo existe)

---

## Credenciales de prueba (datos iniciales del SQL)

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| `admin@siswork.local` | `Admin123*` | administrador |
| `soporte@siswork.local` | `Soporte123*` | soporte |