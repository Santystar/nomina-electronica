import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                mensaje: 'Token no proporcionado'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                mensaje: 'Formato de token inválido'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'clave_secreta_nomina'
        );

        req.usuario = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
};

export default authMiddleware;