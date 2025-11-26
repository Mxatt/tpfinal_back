const mongoose = require('mongoose');

const EsquemaHistorial = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  inversion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inversion',
    required: false,
  },
  nombreInversion: {
    type: String,
    required: true,
  },
  tipoEvento: {
    type: String,
    enum: ['creacion', 'deposito', 'retiro', 'eliminacion'],
    required: true,
  },
  montoAfectado: {
    type: Number,
    required: true,
  },
  fechaEvento: {
    type: Date,
    default: Date.now,
  },
  gananciaPorcentaje: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model('Historial', EsquemaHistorial);
