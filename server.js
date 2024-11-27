const http = require('http'); // Para crear el servidor HTTP
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { print } = require('pdf-to-printer');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación

const app = express();
const server = http.createServer(app); // Crear servidor HTTP compartido
const io = socketIo(server, {
    cors: {
        origin: 'http://127.0.0.1:5500',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 3000;
const users = {};
const secretKey = process.env.JWT_SECRET;

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de subida de archivos
const upload = multer({ dest: 'uploads/' });

// Ruta para manejar la subida del archivo
app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    try {
        await print(file.path); // Imprime el archivo
        res.json({ message: 'Archivo enviado a imprimir exitosamente.' });
    } catch (err) {
        console.error('Error al imprimir:', err);
        res.status(500).json({ message: 'Error al enviar el archivo a la impresora.' });
    }
});
    /*/ Enviar el archivo a la impresora
    printer.printFile({
        filename: file.path, // Ruta temporal del archivo
        printer: process.env.PRINTER || printer.getDefaultPrinterName(), // Impresora predeterminada
        success: () => {
            console.log('Archivo enviado a la impresora.');
            res.json({ message: 'Archivo enviado a imprimir exitosamente.' });
        },
        error: (err) => {
            console.error('Error al imprimir:', err);
            res.status(500).json({ message: 'Error al enviar el archivo a la impresora.' });
        },
    });
});*/

// Servir archivos estáticos desde la carpeta public
app.use('/images', express.static('public/images'));
app.use(express.static('public'));
app.use(express.static('images'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Rutas de autenticación
app.use('/api', authRoutes);

// Configuración de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    // Enviar un mensaje inicial al cliente
    socket.emit('chat-message', 'hello world');

    // Manejar nuevos usuarios
    socket.on('new-user', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });

    // Manejar mensajes de chat
    socket.on('send-chat-message', (message) => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });

    // Manejar desconexiones
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
