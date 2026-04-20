// src/controllers/empleadosController.js
import pool from "../config/db.js";
import bcrypt from "bcryptjs";


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
    const {
      nombre,
      apellido,
      identificacion,
      cargo,
      salario_base,
      fecha_ingreso,
      id_cargo,
      id_departamento,
      banco,
      tipo_cuenta,
      cuenta_bancaria,
    } = req.body;

    if (
      !nombre ||
      !apellido ||
      !identificacion ||
      !cargo ||
      !salario_base
    ) {
      return res.status(400).json({
        error: "Campos obligatorios incompletos",
      });
    }

    // 1️⃣ Crear empleado
    const [result] = await pool.query(
      `
      INSERT INTO empleados
      (
        nombre,
        apellido,
        identificacion,
        cargo,
        salario_base,
        fecha_ingreso,
        id_cargo,
        id_departamento,
        banco,
        tipo_cuenta,
        cuenta_bancaria
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nombre,
        apellido,
        identificacion,
        cargo,
        salario_base,
        fecha_ingreso,
        id_cargo,
        id_departamento,
        banco,
        tipo_cuenta,
        cuenta_bancaria,
      ]
    );

    const idEmpleado =
      result.insertId;

    // 2️⃣ Crear credenciales
    const correo =
      `${nombre.toLowerCase()}.${idEmpleado}@nomina.com`;

    const passwordTemporal =
      "Nomina123*";

    const passwordHash =
      await bcrypt.hash(
        passwordTemporal,
        10
      );

    // 3️⃣ Crear usuario ligado
    await pool.query(
      `
      INSERT INTO usuarios
      (
        nombre,
        correo,
        password,
        rol,
        id_empleado
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        `${nombre} ${apellido}`,
        correo,
        passwordHash,
        "empleado",
        idEmpleado,
      ]
    );

    res.status(201).json({
      mensaje:
        "Empleado creado correctamente",
      correo_generado:
        correo,
      password_temporal:
        passwordTemporal,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Error al crear empleado",
    });
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

export const obtenerPerfilEmpleado = async (req, res) => {
  try {
    const idEmpleado =
      req.usuario.id_empleado;

    const [rows] =
      await pool.query(
        `
        SELECT
          id_empleado,
          nombre,
          apellido,
          identificacion,
          cargo,
          fecha_ingreso,
          salario_base,
          banco,
          tipo_cuenta,
          cuenta_bancaria
        FROM empleados
        WHERE id_empleado = ?
        LIMIT 1
        `,
        [idEmpleado]
      );

    if (rows.length === 0) {
      return res.status(404).json({
        mensaje:
          "Perfil no encontrado",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje:
        "Error al obtener perfil",
    });
  }
};

export const obtenerDesprendiblesEmpleado = async (req, res) => {
  try {
    const idEmpleado =
      req.usuario.id_empleado;

    const [rows] =
      await pool.query(
        `
        SELECT
          d.id_pago,
          d.fecha_pago,
          d.metodo_pago,
          d.monto_total,
          n.salario_base,
          n.total_deducciones,
          n.total_bonificaciones,
          n.salario_neto
        FROM desprendibles_pago d
        INNER JOIN nomina_quincenal n
          ON d.id_nomina = n.id_nomina
        WHERE n.id_empleado = ?
        ORDER BY d.fecha_pago DESC
        `,
        [idEmpleado]
      );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje:
        "Error al obtener desprendibles",
    });
  }
};

export const obtenerAsistenciaEmpleado = async (req, res) => {
  try {
    const idEmpleado =
      req.usuario.id_empleado;

    const [rows] =
      await pool.query(
        `
        SELECT *
        FROM asistencia
        WHERE empleado_id = ?
        ORDER BY fecha DESC
        `,
        [idEmpleado]
      );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje:
        "Error al consultar asistencia",
    });
  }
};

export const marcarAsistenciaHoy = async (req, res) => {
  try {
    const idEmpleado =
      req.usuario.id_empleado;

    const hoy =
      new Date()
        .toISOString()
        .split("T")[0];

    const horaActual =
      new Date()
        .toTimeString()
        .split(" ")[0];

    const [rows] =
      await pool.query(
        `
        SELECT *
        FROM asistencia
        WHERE empleado_id = ?
        AND fecha = ?
        LIMIT 1
        `,
        [idEmpleado, hoy]
      );

    if (rows.length === 0) {
      await pool.query(
        `
        INSERT INTO asistencia
        (
          empleado_id,
          fecha,
          hora_entrada,
          estado
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          idEmpleado,
          hoy,
          horaActual,
          "Pendiente salida",
        ]
      );

      return res.json({
        mensaje:
          "Entrada registrada",
      });
    }

    const registro = rows[0];

    if (
      registro.hora_salida
    ) {
      return res.json({
        mensaje:
          "Ya completaste hoy",
      });
    }

    await pool.query(
      `
      UPDATE asistencia
      SET hora_salida = ?,
          estado = 'Completo'
      WHERE id = ?
      `,
      [
        horaActual,
        registro.id,
      ]
    );

    res.json({
      mensaje:
        "Salida registrada",
    });
  } catch (error) {
    res.status(500).json({
      mensaje:
        "Error al marcar asistencia",
    });
  }
};

export const crearSolicitudEmpleado = async (req, res) => {
  try {
    const idEmpleado =
      req.usuario.id_empleado;

    const {
      tipo,
      fecha_inicio,
      fecha_fin,
      motivo,
    } = req.body;

    const inicio =
      new Date(fecha_inicio);

    const fin =
      new Date(fecha_fin);

    const diferencia =
      Math.ceil(
        (fin - inicio) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    await pool.query(
      `
      INSERT INTO solicitudes
      (
        id_empleado,
        tipo,
        fecha_inicio,
        fecha_fin,
        dias_solicitados,
        motivo
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        idEmpleado,
        tipo,
        fecha_inicio,
        fecha_fin,
        diferencia,
        motivo,
      ]
    );

    res.json({
      mensaje:
        "Solicitud enviada",
    });
  } catch (error) {
    res.status(500).json({
      mensaje:
        "Error al crear solicitud",
    });
  }
};

export const obtenerSolicitudesEmpleado = async (req, res) => {
  try {
    const idEmpleado =
      req.usuario.id_empleado;

    const [rows] =
      await pool.query(
        `
        SELECT *
        FROM solicitudes
        WHERE id_empleado = ?
        ORDER BY id_solicitud DESC
        `,
        [idEmpleado]
      );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje:
        "Error al consultar solicitudes",
    });
  }
};