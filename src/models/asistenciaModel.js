import pool from '../config/db.js';

const Asistencia = {
    
    crear: async (data) => {
        const sql = `
            INSERT INTO asistencia 
            (empleado_id, fecha, hora_entrada, hora_salida, horas_trabajadas)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            data.empleado_id,
            data.fecha,
            data.hora_entrada,
            data.hora_salida,
            data.horas_trabajadas
        ]);

        return result;
    },

    listar: async () => {
        const sql = `
            SELECT 
                a.id,
                a.empleado_id,
                e.nombre,
                e.apellido,
                a.fecha,
                a.hora_entrada,
                a.hora_salida,
                a.horas_trabajadas
            FROM asistencia a
            INNER JOIN empleados e 
                ON a.empleado_id = e.id_empleado
        `;

        const [rows] = await pool.query(sql);
        return rows;
    }

};

export default Asistencia;