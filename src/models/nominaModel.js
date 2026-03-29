import pool from '../config/db.js';

const Nomina = {

    calcularPorEmpleado: async (id_empleado) => {
        const sql = `
            SELECT 
                e.id_empleado,
                e.nombre,
                e.apellido,
                e.salario_base,
                IFNULL(SUM(a.horas_trabajadas), 0) AS total_horas
            FROM empleados e
            LEFT JOIN asistencia a 
                ON e.id_empleado = a.empleado_id
            WHERE e.id_empleado = ?
            GROUP BY e.id_empleado, e.nombre, e.apellido, e.salario_base
        `;

        const [rows] = await pool.query(sql, [id_empleado]);
        return rows[0];
    },

    guardarNomina: async (data) => {
        const sql = `
            INSERT INTO nomina
            (id_empleado, fecha_generacion, salario_base, salario_neto, total_bonificaciones, total_deducciones)
            VALUES (?, CURDATE(), ?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            data.id_empleado,
            data.salario_base,
            data.salario_neto,
            data.total_bonificaciones,
            data.total_deducciones
        ]);

        return result;
    },

    listarNominas: async () => {
        const sql = `
            SELECT 
                n.id_nomina,
                n.fecha_generacion,
                n.salario_base,
                n.salario_neto,
                n.total_bonificaciones,
                n.total_deducciones,
                e.nombre,
                e.apellido
            FROM nomina n
            INNER JOIN empleados e
                ON n.id_empleado = e.id_empleado
            ORDER BY n.id_nomina DESC
        `;

        const [rows] = await pool.query(sql);
        return rows;
    }

};

export default Nomina;