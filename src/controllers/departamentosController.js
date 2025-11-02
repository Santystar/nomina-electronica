// src/controllers/departamentosController.js
import pool from "../config/db.js";

// ✅ Obtener todos los departamentos
export const obtenerDepartamentos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM departamentos");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener departamentos:", error);
    res.status(500).json({ error: "Error al obtener departamentos" });
  }
};
