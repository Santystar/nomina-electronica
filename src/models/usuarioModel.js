import pool from '../config/db.js';

const Usuario = {

    crear: async (data) => {
        const sql = `
            INSERT INTO usuarios (nombre, correo, password, rol)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            data.nombre,
            data.correo,
            data.password,
            data.rol
        ]);

        return result;
    },

    buscarPorCorreo: async (correo) => {
        const sql = `
            SELECT * FROM usuarios WHERE correo = ?
        `;

        const [rows] = await pool.query(sql, [correo]);
        return rows[0];
    }

};

export default Usuario;