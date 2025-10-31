import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db.js';
import empleadoRoutes from './routes/empleadoRoutes.js'; // nombre correcto del archivo

dotenv.config();
const app = express();

app.use(express.json());

// ✅ Servir el frontend desde la carpeta "public"
app.use(express.static('public'));

// ✅ Rutas de la API
app.use('/api/empleados', empleadoRoutes);

// ✅ Ruta de prueba para verificar la conexión con la base de datos
app.get('/api/prueba', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS fecha_actual;');
    res.json({ mensaje: 'Conexión exitosa a MySQL', fecha: rows[0].fecha_actual });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({ error: 'Error de conexión con la base de datos' });
  }
});

// ✅ Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en el puerto ${PORT}`));
