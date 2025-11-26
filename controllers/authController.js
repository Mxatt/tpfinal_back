const servicioAuth = require('../services/authService');

class ControladorAuth {
  async registrar(req, res, next) {
    try {
      const resultado = await servicioAuth.registrar(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async verificarEmail(req, res, next) {
    try {
      const resultado = await servicioAuth.verificarEmail(req.params.token);

      const frontendLoginUrl = `${process.env.FRONTEND_URL}/login?verificationSuccess=true&message=${encodeURIComponent(resultado.message)}`;
      res.redirect(frontendLoginUrl);
    } catch (error) {
      next(error);
    }
  }

  async iniciarSesion(req, res, next) {
    try {
      const resultado = await servicioAuth.iniciarSesion(req.body);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ControladorAuth();