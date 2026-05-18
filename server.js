require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas
app.use('/api/usuarios', require('./routes/users'));
app.use('/api/tareas', require('./routes/tasks'));
app.use('/api/proyectos', require('./routes/projects'));

// Middleware de manejo de errores
app.use(errorHandler);

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const MAX_PORT = DEFAULT_PORT + 10;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Puerto ${port} en uso. Intentando puerto ${port + 1}...`);
      if (port + 1 <= MAX_PORT) {
        startServer(port + 1);
      } else {
        console.error('No se puede iniciar el servidor: no hay puertos libres.');
        process.exit(1);
      }
    } else {
      console.error('Error del servidor:', error);
      process.exit(1);
    }
  });
}

startServer(DEFAULT_PORT);