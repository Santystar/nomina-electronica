import express from "express";
import { obtenerDepartamentos } from "../controllers/departamentosController.js";
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Ruta protegida para listar departamentos (solo admin)
router.get("/", authMiddleware, roleMiddleware('admin'), obtenerDepartamentos);

export default router;