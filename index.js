require('dotenv/config');
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const manejadorErrores = require('./middleware/errorHandler');
const { configurarTransportador } = require('./services/emailService');

const app = express();

conectarDB();

configurarTransportador();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/investments', require('./routes/investments'));

app.use(manejadorErrores);

const PUERTO = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PUERTO, () =>
    console.log(`Servidor iniciado en el puerto ${PUERTO}`)
  );
}

module.exports = app;