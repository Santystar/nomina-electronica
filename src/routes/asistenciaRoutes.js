import express from 'express';
import asistenciaController from '../controllers/asistenciaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Registrar asistencia (solo admin)
router.post('/', authMiddleware, roleMiddleware('admin'), asistenciaController.crear);

// Listar asistencias (solo admin)
router.get('/', authMiddleware, roleMiddleware('admin'), asistenciaController.listar);

export default router;