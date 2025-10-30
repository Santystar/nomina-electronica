// src/routes/empleados.js
import { Router } from 'express';
import {
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
} from '../controllers/empleadosController.js';

const router = Router();

// GET: todos los empleados
router.get('/', obtenerEmpleados);

// GET: un empleado por ID
router.get('/:id', obtenerEmpleadoPorId);

// POST: crear nuevo empleado
router.post('/', crearEmpleado);

// PUT: actualizar empleado
router.put('/:id', actualizarEmpleado);

// DELETE: eliminar empleado
router.delete('/:id', eliminarEmpleado);

export default router;
