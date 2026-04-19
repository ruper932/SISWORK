import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'; // <-- Nueva importación
import { PrismaPg } from '@prisma/adapter-pg'; // <-- Nueva importación
import dotenv from 'dotenv';

// Parche para que Express pueda enviar los IDs de tipo "BigInt" al frontend sin fallar
(BigInt.prototype as any).toJSON = function () { return this.toString(); };

dotenv.config();

const router = Router();

// Configuramos el adaptador que Prisma 7 exige
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ==========================================
// VISTA 1: CREAR NUEVA SOLICITUD (El Formulario)
// ... (el resto de tu código sigue igual hacia abajo)
// ==========================================
// VISTA 1: CREAR NUEVA SOLICITUD (El Formulario)
// ==========================================
router.post('/', async (req: Request, res: Response) => {
  try {
    const datosFormulario = req.body;

    const nuevaSolicitud = await prisma.publicaciones.create({
      data: {
        codigo_solicitud: `SOL-${Date.now()}`, 
        cliente_id: 1, // ID temporal hasta implementar el sistema de usuarios
        categoria_servicio_id: 1, // ID temporal de categoría
        titulo: datosFormulario.titulo,
        descripcion: datosFormulario.descripcion,
        direccion: datosFormulario.direccion,
        referencia: datosFormulario.referencia,
        fecha_requerida: new Date(datosFormulario.fechaRequerida),
        presupuesto_estimado: datosFormulario.presupuesto,
        estado: 'Publicada', 
      }
    });

    res.status(201).json({ 
      mensaje: "¡Solicitud creada exitosamente!", 
      solicitud: nuevaSolicitud 
    });
  } catch (error) {
    console.error("Error al crear publicación:", error);
    res.status(500).json({ error: "Error al guardar la solicitud" });
  }
});

// ==========================================
// VISTA 2: VER DETALLE (Pantalla de Éxito)
// ==========================================
router.get('/:id_solicitud', async (req: Request, res: Response) => {
  try {
    const id = BigInt(String(req.params.id_solicitud));
    
    const solicitud = await prisma.publicaciones.findUnique({
      where: { id: id },
      include: {
        categorias_servicio: true 
      }
    });

    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar la solicitud" });
  }
});

// ==========================================
// VISTA 3: DASHBOARD Y TABLA DE MIS SOLICITUDES
// ==========================================
router.get('/mis-solicitudes/:id_cliente', async (req: Request, res: Response) => {
  try {
    const idCliente = BigInt(String(req.params.id_cliente));

    const listaSolicitudes = await prisma.publicaciones.findMany({
      where: { cliente_id: idCliente },
      orderBy: { created_at: 'desc' },
      include: { categorias_servicio: true }
    });

    const conteo = await prisma.publicaciones.groupBy({
      by: ['estado'],
      where: { cliente_id: idCliente },
      _count: { estado: true }
    });

    res.json({
      lista: listaSolicitudes,
      estadisticas: conteo
    });

  } catch (error) {
    res.status(500).json({ error: "Error al cargar el dashboard" });
  }
});

export default router;