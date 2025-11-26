const Usuario = require('../models/User');

class RepositorioUsuario {
  async buscarPorNombreUsuario(nombreUsuario) {
    return await Usuario.findOne({ nombreUsuario });
  }

  async buscarPorEmail(email) {
    return await Usuario.findOne({ email });
  }

  async buscarPorId(id) {
    return await Usuario.findById(id).select("-contrasena");
  }

  async buscarPorTokenVerificacion(token) {
    return await Usuario.findOne({ tokenVerificacion: token });
  }

  async crearUsuario(datosUsuario) {
    const usuario = new Usuario(datosUsuario);
    return await usuario.save();
  }

  async guardar(usuario) {
    return await usuario.save();
  }

  async eliminarUsuario(id) {
    return await Usuario.findByIdAndDelete(id);
  }
}

module.exports = new RepositorioUsuario();
