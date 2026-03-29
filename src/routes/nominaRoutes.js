import express from 'express';
import nominaController from '../controllers/nominaController.js';

const router = express.Router();

// Listar historial de nóminas
router.get('/', nominaController.listarNominas);

// Calcular nómina por empleado
router.get('/:id', nominaController.calcularNomina);

export default router;