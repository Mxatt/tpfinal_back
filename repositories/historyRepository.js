const Historial = require('../models/History');

class RepositorioHistorial {
  async crear(datosHistorial) {
    const nuevoRegistro = new Historial(datosHistorial);
    return await nuevoRegistro.save();
  }

  async buscarPorIdUsuario(idUsuario) {
    return await Historial.find({ usuario: idUsuario }).sort({ fechaEvento: -1 });
  }
}

module.exports = new RepositorioHistorial();
