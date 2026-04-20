import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarioModel.js';

const authController = {

    register: async (req, res) => {
        try {
            const { nombre, correo, password, rol } = req.body;

            if (!nombre || !correo || !password) {
                return res.status(400).json({
                    mensaje: 'Nombre, correo y contraseña son obligatorios'
                });
            }

            const usuarioExistente = await Usuario.buscarPorCorreo(correo);

            if (usuarioExistente) {
                return res.status(400).json({
                    mensaje: 'El correo ya está registrado'
                });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const result = await Usuario.crear({
                nombre,
                correo,
                password: passwordHash,
                rol: rol || 'empleado'
            });

            res.status(201).json({
                mensaje: 'Usuario registrado correctamente',
                id_usuario: result.insertId
            });

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({
                mensaje: 'Error al registrar usuario',
                error: error.message
            });
        }
    },

    login: async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                mensaje: 'Correo y contraseña son obligatorios'
            });
        }

        const usuario = await Usuario.buscarPorCorreo(correo);

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Credenciales inválidas'
            });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {
            return res.status(401).json({
                mensaje: 'Credenciales inválidas'
            });
        }

        
        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                id_empleado: usuario.id_empleado, // 👈 ESTA ES LA CLAVE
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            },
            process.env.JWT_SECRET || 'clave_secreta_nomina',
            { expiresIn: '2h' }
        );

        res.status(200).json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                id_empleado: usuario.id_empleado, // 👈 también aquí
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            mensaje: 'Error al iniciar sesión',
            error: error.message
        });
    }
}

};

export default authController;