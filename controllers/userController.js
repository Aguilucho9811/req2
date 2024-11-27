const pool = require('../config/db');
const bcrypt = require('bcrypt');
  
// Función para crear un nuevo usuario
exports.createUser = async (email, password, nombre, birthdate, rol) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (email, password, nombre, fecha_nacimiento, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, hashedPassword, nombre, birthdate, rol]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error; // Lanzar el error para que se maneje en la ruta
    }
};



// Función para actualizar la contraseña de un usuario
exports.updatePassword = async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query('UPDATE usuarios SET password = $1 WHERE email = $2 RETURNING *', [hashedPassword, email]);
    return result.rows[0];
};

// Función para obtener todos los usuarios
exports.getUsers = async () => {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows;
};

// Función para obtener un usuario por email
exports.getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
};

exports.deleteUserById = async (id) => {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};


// Función para eliminar un usuario
exports.deleteUser = async (email) => {
    const result = await pool.query('DELETE FROM usuarios WHERE email = $1 RETURNING *', [email]);
    return result.rows[0];
};