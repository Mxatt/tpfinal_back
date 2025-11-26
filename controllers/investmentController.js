const servicioInversion = require('../services/investmentService');

class ControladorInversion {
  async obtenerInversiones(req, res, next) {
    try {
      const inversiones = await servicioInversion.obtenerInversionesPorIdUsuarioYEstado(req.user.id, 'active');
      res.json(inversiones);
    } catch (error) {
      next(error);
    }
  }

  async agregarInversion(req, res, next) {
    try {
      const { 
        nombre, 
        montoInicial, 
        porcentajeRetornoAnual, 
        tiempoInversion, 
        tipoInversion, 
        enlaceInversion 
      } = req.body;

      const inversion = await servicioInversion.agregarInversion(
        req.user.id,
        {
          nombre,
          montoInicial,
          porcentajeRetornoAnual,
          tiempoInversion,
          tipoInversion,
          enlaceInversion,
        }
      );
      res.status(201).json(inversion);
    } catch (error) {
      next(error);
    }
  }

  async obtenerDatosUsuario(req, res, next) {
    try {
      const datosUsuario = await servicioInversion.obtenerDatosUsuario(req.user.id);
      res.json(datosUsuario);
    } catch (error) {
      next(error);
    }
  }

  async retirarInversion(req, res, next) {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const inversionActualizada = await servicioInversion.retirarInversion(
        id,
        req.user.id,
        amount
      );
      res.json(inversionActualizada);
    } catch (error) {
      next(error);
    }
  }

  async eliminarInversion(req, res, next) {
    try {
      const { id } = req.params;
      await servicioInversion.eliminarInversion(id, req.user.id);
      res.json({ msg: 'Inversión eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  }

  async obtenerHistorialInversiones(req, res, next) {
    try {
      const historial = await servicioInversion.obtenerHistorialPorIdUsuario(req.user.id);
      res.json(historial);
    } catch (error) {
      next(error);
    }
  }

  async actualizarInversion(req, res, next) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;
      const inversion = await servicioInversion.actualizarInversion(id, req.user.id, datosActualizados);
      res.json(inversion);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ControladorInversion();