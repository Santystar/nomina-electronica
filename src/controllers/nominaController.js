import Nomina from '../models/nominaModel.js';

const nominaController = {

    calcularNomina: async (req, res) => {
        try {
            const { id } = req.params;

            const empleado = await Nomina.calcularPorEmpleado(id);

            if (!empleado) {
                return res.status(404).json({
                    mensaje: 'Empleado no encontrado'
                });
            }

            const salarioBase = parseFloat(empleado.salario_base);
            const totalHoras = parseFloat(empleado.total_horas);

            const valorHora = salarioBase / 240;
            const totalDevengado = totalHoras * valorHora;

            const bonificaciones = 0;
            const deducciones = 0;

            const salarioNeto = totalDevengado + bonificaciones - deducciones;

            await Nomina.guardarNomina({
                id_empleado: empleado.id_empleado,
                salario_base: salarioBase,
                salario_neto: salarioNeto,
                total_bonificaciones: bonificaciones,
                total_deducciones: deducciones
            });

            res.status(200).json({
                empleado: `${empleado.nombre} ${empleado.apellido}`,
                salario_base: salarioBase,
                total_horas_trabajadas: totalHoras,
                valor_hora: valorHora.toFixed(2),
                total_devengado: totalDevengado.toFixed(2),
                bonificaciones: bonificaciones,
                deducciones: deducciones,
                salario_neto: salarioNeto.toFixed(2),
                mensaje: "Nómina calculada y guardada"
            });

        } catch (error) {
            console.error('Error al calcular nómina:', error);
            res.status(500).json({
                mensaje: 'Error al calcular nómina',
                error: error.message
            });
        }
    },

    listarNominas: async (req, res) => {
        try {
            const nominas = await Nomina.listarNominas();

            res.status(200).json(nominas);

        } catch (error) {
            console.error('Error al listar nóminas:', error);
            res.status(500).json({
                mensaje: 'Error al obtener historial de nómina',
                error: error.message
            });
        }
    }

};

export default nominaController;