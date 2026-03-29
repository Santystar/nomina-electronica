import express from 'express';
import asistenciaController from '../controllers/asistenciaController.js';

const router = express.Router();

// Registrar asistencia
router.post('/', asistenciaController.crear);

// Listar asistencias
router.get('/', asistenciaController.listar);

export default router;