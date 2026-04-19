import express from 'express';
import dotenv from 'dotenv';
import solicitudesRoutes from './solicitudes.routes';

dotenv.config();

const app = express();
app.use(express.json()); // Para poder leer lo que manda el frontend

// Conectamos las rutas
app.use('/api/solicitudes', solicitudesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API lista para recibir solicitudes en el puerto ${PORT}`);
});