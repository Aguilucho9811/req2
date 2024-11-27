const { Pool } = require('pg');

const pool = new Pool({
    host: 'dpg-ct0ltqjtq21c73eg4ulg-a.oregon-postgres.render.com', // Cambia esto por el hostname de tu base de datos
    user: 'proyect_vo9b_user', // Cambia esto por tu usuario
    password: 'xWP3qJ1vfZKHebu3ibFMdrhJxmbamFCa', // Cambia esto por tu contraseña
    database: 'proyect_vo9b', // Cambia esto por el nombre de tu base de datos
    port: 5432, // Puerto por defecto para PostgreSQL
    ssl: {
        rejectUnauthorized: false, // Cambia a false para conexiones en Render
    },
});

// Función para conectar a la base de datos
async function connectToDatabase() {
    try {
        await pool.connect();
        console.log('Conectado a la base de datos PostgreSQL.');
    } catch (err) {
        console.error('Error conectando a la base de datos: ', err);
    }
}

// Llamar a la función para conectar
connectToDatabase();

module.exports = pool;
