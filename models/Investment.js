const mongoose = require('mongoose');

const EsquemaInversion = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  montoInicial: {
    type: Number,
    required: true,
  },
  montoActual: {
    type: Number,
    required: true,
  },
  porcentajeRetornoAnual: {
    type: Number,
    required: true,
  },
  tiempoInversion: {
    type: Number,
    required: true,
  },
  tipoInversion: {
    type: String,
    required: true,
  },
  enlaceInversion: {
    type: String,
    required: false,
  },
  montoRetornoEsperado: {
    type: Number,
    required: true,
  },
  estado: {
    type: String,
    enum: ['active', 'withdrawn', 'deleted'],
    default: 'active',
  },
  ganancia: {
    type: Number,
    default: 0,
  },
  perdida: {
    type: Number,
    default: 0,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  fechaCierre: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model('Inversion', EsquemaInversion);
