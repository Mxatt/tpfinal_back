const repositorioHistorial = require('../repositories/historyRepository');

class ServicioHistorial {
  async agregarRegistro(datosRegistro) {
    return await repositorioHistorial.crear(datosRegistro);
  }

  async obtenerHistorialPorIdUsuario(idUsuario) {
    return await repositorioHistorial.buscarPorIdUsuario(idUsuario);
  }
}

module.exports = new ServicioHistorial();
