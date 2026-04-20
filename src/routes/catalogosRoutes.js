import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/cargos",
  authMiddleware,
  async (req, res) => {
    const [rows] =
      await pool.query(
        "SELECT * FROM cargos"
      );
    res.json(rows);
  }
);

router.get(
  "/departamentos",
  authMiddleware,
  async (req, res) => {
    const [rows] =
      await pool.query(
        "SELECT * FROM departamentos"
      );
    res.json(rows);
  }
);

export default router;