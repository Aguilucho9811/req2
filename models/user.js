const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Función para crear un nuevo usuario
exports.createUser = async (email, password, nombre) => {
    const hashedPassword = await bcrypt.hash(password, 10); // Hashear la contraseña
    const result = await pool.query('INSERT INTO usuarios (email, password, nombre) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
    return result.rows[0];
};
