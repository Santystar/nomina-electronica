import express from "express";
import {
  obtenerEmpleados,
  crearEmpleado,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado
} from "../controllers/empleadosController.js"; // 👈 plural aquí

const router = express.Router();

// Rutas CRUD de empleados
// Listar todos los empleados
router.get("/", obtenerEmpleados);

// Obtener un empleado por ID
router.get("/:id", obtenerEmpleadoPorId);

// Crear un nuevo empleado
router.post("/", crearEmpleado);

// Actualizar un empleado existente
router.put("/:id", actualizarEmpleado);

// Eliminar un empleado
router.delete("/:id", eliminarEmpleado);

export default router;
