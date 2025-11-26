const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const repositorioUsuario = require('../repositories/userRepository');
const { enviarEmailVerificacion } = require('./emailService');
require('dotenv').config();

class ServicioAuth {
  async registrar(datosUsuario) {
    const { nombreUsuario, email, contrasena } = datosUsuario;


    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      const err = new Error(
        "La contraseña debe tener al menos 8 caracteres y una mayúscula."
      );
      err.status = 400;
      throw err;
    }

    let usuarioPorEmail = await repositorioUsuario.buscarPorEmail(email);
    if (usuarioPorEmail) {
      const err = new Error("El email ya existe");
      err.status = 400;
      throw err;
    }

    let usuarioPorNombreUsuario =
      await repositorioUsuario.buscarPorNombreUsuario(nombreUsuario);
    if (usuarioPorNombreUsuario) {
      const err = new Error("El nombre de usuario ya existe");
      err.status = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(contrasena, salt);
    const tokenVerificacion = crypto.randomBytes(32).toString("hex");

    const nuevoUsuario = await repositorioUsuario.crearUsuario({
      nombreUsuario,
      email,
      contrasena: contrasenaHasheada,
      tokenVerificacion,
    });

    try {
      await enviarEmailVerificacion(nuevoUsuario, tokenVerificacion);
    } catch (error) {
      await repositorioUsuario.eliminarUsuario(nuevoUsuario._id);
      throw new Error(
        "Error al enviar el correo de verificación. El registro ha sido cancelado. Por favor, inténtelo de nuevo."
      );
    }

    return {
      message:
        "Registro exitoso. Por favor, revisa tu email para verificar tu cuenta.",
    };
  }

  async verificarEmail(token) {
    const usuario = await repositorioUsuario.buscarPorTokenVerificacion(token);

    if (!usuario) {
      const err = new Error('Token de verificación inválido.');
      err.status = 400;
      throw err;
    }

    usuario.estaVerificado = true;
    usuario.tokenVerificacion = undefined;
    await repositorioUsuario.guardar(usuario);

    return { message: 'Email verificado exitosamente. Ahora puedes iniciar sesión.' };
  }

  async iniciarSesion(datosInicioSesion) {
    const { email, contrasena } = datosInicioSesion;

    const usuario = await repositorioUsuario.buscarPorEmail(email);

    if (!usuario) {
      const err = new Error("Usuario no encontrado");
      err.status = 404;
      throw err;
    }

    if (!usuario.estaVerificado) {
        const err = new Error('Tu cuenta no ha sido verificada. Por favor, revisa tu correo electrónico para verificarla.');
        err.status = 401;
        throw err;
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!coincide) {
        const err = new Error('Credenciales inválidas');
        err.status = 401;
        throw err;
    }

    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return { token };
  }
}

module.exports = new ServicioAuth();
