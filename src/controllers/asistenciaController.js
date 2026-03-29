import Asistencia from '../models/asistenciaModel.js';

const asistenciaController = {

    crear: async (req, res) => {
        try {
            const data = req.body;

            if (!data.empleado_id || !data.fecha) {
                return res.status(400).json({
                    mensaje: 'empleado_id y fecha son obligatorios'
                });
            }

            if (data.horas_trabajadas <= 0) {
                return res.status(400).json({
                    mensaje: 'Las horas trabajadas deben ser mayores a 0'
                });
            }

            const result = await Asistencia.crear(data);

            res.status(201).json({
                mensaje: 'Asistencia registrada correctamente',
                id_asistencia: result.insertId
            });

        } catch (error) {
            console.error('Error al registrar asistencia:', error);
            res.status(500).json({
                mensaje: 'Error al registrar asistencia',
                error: error.message
            });
        }
    },

    listar: async (req, res) => {
        try {
            const rows = await Asistencia.listar();
            res.status(200).json(rows);

        } catch (error) {
            console.error('Error al listar asistencias:', error);
            res.status(500).json({
                mensaje: 'Error al obtener asistencias',
                error: error.message
            });
        }
    }

};

export default asistenciaController;