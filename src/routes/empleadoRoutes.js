import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  obtenerEmpleados,
  crearEmpleado,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerPerfilEmpleado,
  obtenerDesprendiblesEmpleado,
  obtenerAsistenciaEmpleado,
  marcarAsistenciaHoy,
  crearSolicitudEmpleado,
  obtenerSolicitudesEmpleado,
} from "../controllers/empleadosController.js";

const router = express.Router();

/* =========================
   RUTAS EMPLEADO LOGUEADO
========================= */

router.get(
  "/perfil",
  authMiddleware,
  obtenerPerfilEmpleado
);

router.get(
  "/desprendibles",
  authMiddleware,
  obtenerDesprendiblesEmpleado
);

router.get(
  "/asistencia",
  authMiddleware,
  obtenerAsistenciaEmpleado
);

router.get(
  "/solicitudes",
  authMiddleware,
  obtenerSolicitudesEmpleado
);

router.post(
  "/solicitudes",
  authMiddleware,
  crearSolicitudEmpleado
);

router.post(
  "/asistencia",
  authMiddleware,
  marcarAsistenciaHoy
);

/* =========================
   RUTAS SOLO ADMIN
========================= */

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  obtenerEmpleados
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  obtenerEmpleadoPorId
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  crearEmpleado
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  actualizarEmpleado
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  eliminarEmpleado
);

export default router;