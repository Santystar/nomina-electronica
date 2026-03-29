import express from "express";
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import {
  obtenerEmpleados,
  crearEmpleado,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado
} from "../controllers/empleadosController.js";

const router = express.Router();

// Rutas CRUD de empleados (solo admin)
router.get("/", authMiddleware, roleMiddleware('admin'), obtenerEmpleados);
router.get("/:id", authMiddleware, roleMiddleware('admin'), obtenerEmpleadoPorId);
router.post("/", authMiddleware, roleMiddleware('admin'), crearEmpleado);
router.put("/:id", authMiddleware, roleMiddleware('admin'), actualizarEmpleado);
router.delete("/:id", authMiddleware, roleMiddleware('admin'), eliminarEmpleado);

export default router;