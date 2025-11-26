const Inversion = require('../models/Investment');
const Usuario = require('../models/User');

class RepositorioInversion {
  async buscarPorId(id) {
    return await Inversion.findById(id);
  }

  async buscarPorIdUsuario(idUsuario) {
    return await Inversion.find({ usuario: idUsuario }).sort({ fechaCreacion: -1 });
  }

  async buscarPorIdUsuarioYEstado(idUsuario, estado) {
    return await Inversion.find({ usuario: idUsuario, estado: estado }).sort({ fechaCreacion: -1 });
  }

  async crear(datosInversion) {
    const nuevaInversion = new Inversion(datosInversion);
    return await nuevaInversion.save();
  }

  async actualizar(id, datosActualizados) {
    return await Inversion.findByIdAndUpdate(id, datosActualizados, { new: true });
  }
}

module.exports = new RepositorioInversion();
