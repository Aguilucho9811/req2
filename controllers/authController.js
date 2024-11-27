
require('dotenv').config();  // Cargar variables de entorno

const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

// Controlador para iniciar sesión
 // Controlador para iniciar sesión
exports.login = [
    check('email').isEmail().withMessage('Ingrese un correo electrónico válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;  // Ya no necesitamos 'nombre'

        try {
            // Verificar el usuario en la base de datos
            const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

            if (result.rows.length > 0) {
                const user = result.rows[0];
                // Comparar la contraseña proporcionada con la contraseña hasheada en la base de datos
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    // Crear un token JWT
                    const token = jwt.sign(
                        { id: user.id, rol: user.rol }, // Información dentro del token
                        process.env.JWT_SECRET,        // Llave secreta para firmar
                        { expiresIn: '1m' }            // Duración del token (1 día)
                    );

                    // Enviar el token en una cookie
                    res.cookie('token', token, { httpOnly: true, maxAge: 1 * 60 * 1000 }); // Cookie válida por 1 día

                    // Respuesta con éxito, incluyendo el ID y el rol
                    res.status(200).json({ 
                        message: 'Inicio de sesión exitoso', 
                        user: { id: user.id, role: user.rol }  // Cambié la respuesta para incluir el ID y el rol
                    });
                } else {
                    // Contraseña incorrecta
                    res.status(401).json({ message: 'Credenciales incorrectas' });
                }
            } else {
                // Usuario no encontrado
                res.status(401).json({ message: 'Credenciales incorrectas' });
            }
        } catch (err) {
            console.error('Error en la autenticación:', err);
            res.status(500).json({ message: 'Error en el servidor autenticacion' });
        }
    }
];

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT id, nombre, email, profile_image FROM usuarios WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).send('Error en el servidor');
    }
};



