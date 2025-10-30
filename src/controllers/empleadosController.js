// src/controllers/empleadosController.js
import pool from '../config/db.js';


// Obtener todos los empleados con su cargo y departamento
export const obtenerEmpleados = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id_empleado, e.nombre, e.apellido, e.identificacion,
             e.cargo, e.salario_base, e.fecha_ingreso,
             c.nombre_cargo, d.nombre_departamento
      FROM empleados e
      LEFT JOIN cargos c ON e.id_cargo = c.id_cargo
      LEFT JOIN departamentos d ON e.id_departamento = d.id_departamento
      ORDER BY e.id_empleado DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

// Obtener empleado por ID
export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM empleados WHERE id_empleado = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
};

// Crear nuevo empleado
export const crearEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, identificacion, cargo, salario, fecha_ingreso, id_cargo, id_departamento } = req.body;

    const [result] = await pool.query(
      'INSERT INTO empleados (nombre, apellido, identificacion, cargo, salario_base, fecha_ingreso, id_cargo, id_departamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, identificacion, cargo, salario, fecha_ingreso, id_cargo, id_departamento]
    );

    res.status(201).json({ id_empleado: result.insertId, mensaje: 'Empleado creado exitosamente' });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ error: error.message, detalle: error.sqlMessage });
  }
};

// Actualizar empleado
export const actualizarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, cargo, salario, fecha_ingreso, id_cargo, id_departamento } = req.body;

    const [result] = await pool.query(
      `UPDATE empleados 
       SET nombre=?, apellido=?, cargo=?, salario_base=?, fecha_ingreso=?, id_cargo=?, id_departamento=? 
       WHERE id_empleado=?`,
      [nombre, apellido, cargo, salario, fecha_ingreso, id_cargo, id_departamento, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    res.json({ mensaje: "Empleado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ error: error.message, detalle: error.sqlMessage });
  }
};


// Eliminar empleado
export const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM empleados WHERE id_empleado = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json({ mensaje: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
};

