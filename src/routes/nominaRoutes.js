import express from 'express';
import nominaController from '../controllers/nominaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Listar historial de nóminas (solo admin)
router.get('/', authMiddleware, roleMiddleware('admin'), nominaController.listarNominas);

// Calcular nómina por empleado (solo admin)
router.get('/:id', authMiddleware, roleMiddleware('admin'), nominaController.calcularNomina);

export default router;