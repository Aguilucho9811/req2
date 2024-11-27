// middleware/auth.js
module.exports = (req, res, next) => {
    if (req.session.user) {
        next(); // Si hay un usuario en la sesión, continuar
    } else {
        res.status(401).json({ message: 'No autorizado' }); // Si no, enviar un error 401
    }
};

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

// Middleware para verificar el token
function verifyToken(req, res, next) {
    const token = req.cookies.token;  // Obtener el token de la cookie

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        
        // Guardar los datos del usuario decodificados en `req.user`
        req.user = decoded;
        next();  // Continuar con la solicitud
    });
}
