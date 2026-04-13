import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import pool from './config/db.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import departamentoRoutes from './routes/departamentoRoutes.js';
import asistenciaRoutes from './routes/asistenciaRoutes.js';
import nominaRoutes from './routes/nominaRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

// ✅ CORS CORRECTO
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ✅ Rutas API
app.use('/api/empleados', empleadoRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/nomina', nominaRoutes);
app.use('/api/auth', authRoutes);

// ✅ Ruta prueba BD
app.get('/api/prueba', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS fecha_actual');
    res.json({
      mensaje: 'Conexión exitosa a MySQL',
      fecha: rows[0].fecha_actual
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error de conexión',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});