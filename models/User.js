const mongoose = require('mongoose');

const EsquemaUsuario = new mongoose.Schema({
  nombreUsuario: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contrasena: {
    type: String,
    required: true,
  },
  inversiones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inversion'
  }],
  estaVerificado: {
    type: Boolean,
    default: false,
  },
  tokenVerificacion: {
    type: String,
  }
});

module.exports = mongoose.model('Usuario', EsquemaUsuario);