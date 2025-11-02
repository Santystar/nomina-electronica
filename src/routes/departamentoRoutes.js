// src/routes/departamentoRoutes.js
import express from "express";
import { obtenerDepartamentos } from "../controllers/departamentosController.js";

const router = express.Router();

// Ruta para listar todos los departamentos
router.get("/", obtenerDepartamentos);

export default router;
