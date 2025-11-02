// src/controllers/empleadosController.js
import pool from "../config/db.js";

//
// 🧾 OBTENER TODOS LOS EMPLEADOS
//
// ✅ OBTENER TODOS LOS EMPLEADOS CON CARGO Y DEPARTAMENTO
export const obtenerEmpleados = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id_empleado AS id,
        e.nombre,
        e.apellido,
        e.identificacion,
        e.cargo,
        e.salario_base,
        e.fecha_ingreso,
        e.id_cargo,
        e.id_departamento,
        d.nombre_departamento AS departamento
      FROM empleados e
      LEFT JOIN departamentos d ON e.id_departamento = d.id_departamento
      ORDER BY e.id_empleado DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener empleados:", error);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
};


//
// 🧍‍♂️ OBTENER EMPLEADO POR ID
//
export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM empleados WHERE id_empleado = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener empleado:", error);
    res.status(500).json({ error: "Error al obtener empleado" });
  }
};

//
// 🧩 CREAR NUEVO EMPLEADO
//
export const crearEmpleado = async (req, res) => {
  try {
    console.log("📥 Datos recibidos para crear:", req.body);

    const {
      nombre,
      apellido,
      identificacion,
      cargo,
      salario_base,
      fecha_ingreso,
      id_cargo,
      id_departamento,
    } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !identificacion || !salario_base) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Inserción en la base de datos
    const [result] = await pool.query(
      `
      INSERT INTO empleados 
        (nombre, apellido, identificacion, cargo, salario_base, fecha_ingreso, id_cargo, id_departamento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        nombre,
        apellido || null,
        identificacion,
        cargo || null,
        salario_base,
        fecha_ingreso || new Date(),
        id_cargo || null,
        id_departamento || null,
      ]
    );

    console.log("✅ Empleado insertado correctamente:", result.insertId);

    res.status(201).json({
      mensaje: "Empleado creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error al crear empleado:", error.message);
    res.status(500).json({ error: "Error interno al crear empleado" });
  }
};

//
// ✏️ ACTUALIZAR EMPLEADO
//
export const actualizarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      cargo,
      salario_base,
      fecha_ingreso,
      id_cargo,
      id_departamento,
    } = req.body;

    console.log("🧩 Datos recibidos para actualizar:", req.body);

    const [result] = await pool.query(
      `
      UPDATE empleados 
      SET nombre=?, apellido=?, cargo=?, salario_base=?, fecha_ingreso=?, id_cargo=?, id_departamento=? 
      WHERE id_empleado=?
    `,
      [nombre, apellido, cargo, salario_base, fecha_ingreso, id_cargo, id_departamento, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    console.log("✅ Empleado actualizado correctamente:", id);
    res.json({ mensaje: "Empleado actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar empleado:", error);
    res.status(500).json({ error: "Error al actualizar empleado" });
  }
};

//
// 🗑️ ELIMINAR EMPLEADO
//
export const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM empleados WHERE id_empleado = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    console.log("🗑️ Empleado eliminado:", id);
    res.json({ mensaje: "Empleado eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar empleado:", error);
    res.status(500).json({ error: "Error al eliminar empleado" });
  }
};
