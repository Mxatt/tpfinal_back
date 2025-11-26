const repositorioInversion = require('../repositories/investmentRepository');
const repositorioUsuario = require("../repositories/userRepository");
const servicioHistorial = require('./historyService');

class ServicioInversion {

  async obtenerInversionesPorIdUsuario(idUsuario) {
    return await repositorioInversion.buscarPorIdUsuario(idUsuario);
  }

  async obtenerInversionesPorIdUsuarioYEstado(idUsuario, estado) {
    return await repositorioInversion.buscarPorIdUsuarioYEstado(idUsuario, estado);
  }

  async agregarInversion(idUsuario, datosInversion) {
    const { 
      nombre, 
      montoInicial, 
      porcentajeRetornoAnual, 
      tiempoInversion, 
      tipoInversion, 
      enlaceInversion 
    } = datosInversion;

    const montoRetornoEsperado = montoInicial * (1 + (porcentajeRetornoAnual / 100 / 12 * tiempoInversion));

    const nuevaInversion = await repositorioInversion.crear({
      usuario: idUsuario,
      nombre,
      montoInicial,
      montoActual: montoInicial,
      porcentajeRetornoAnual,
      tiempoInversion,
      tipoInversion,
      enlaceInversion,
      montoRetornoEsperado,
      estado: 'active',
    });

    await servicioHistorial.agregarRegistro({
      usuario: idUsuario,
      inversion: nuevaInversion._id,
      nombreInversion: nuevaInversion.nombre,
      tipoEvento: 'creacion',
      montoAfectado: montoInicial,
    });

    return nuevaInversion;
  }

  async retirarInversion(idInversion, idUsuario, cantidad) {
    const inversion = await repositorioInversion.buscarPorId(idInversion);

    if (!inversion) {
      const error = new Error('Inversión no encontrada.');
      error.status = 404;
      throw error;
    }

    if (inversion.usuario.toString() !== idUsuario.toString()) {
      const error = new Error('No autorizado para retirar esta inversión.');
      error.status = 403;
      throw error;
    }

    if (inversion.estado !== 'active') {
      const error = new Error('La inversión no está activa para ser retirada.');
      error.status = 400;
      throw error;
    }

    const montoRetirado = cantidad;
    let ganancia = 0;
    let perdida = 0;

    if (montoRetirado > inversion.montoInicial) {
      ganancia = montoRetirado - inversion.montoInicial;
    } else {
      perdida = inversion.montoInicial - montoRetirado;
    }

    const gananciaPorcentaje = ((montoRetirado - inversion.montoInicial) / inversion.montoInicial) * 100;

    inversion.montoActual = montoRetirado;
    inversion.estado = 'withdrawn';
    inversion.ganancia = ganancia;
    inversion.perdida = perdida;
    inversion.fechaCierre = Date.now();

    await inversion.save();

    await servicioHistorial.agregarRegistro({
      usuario: idUsuario,
      inversion: inversion._id,
      nombreInversion: inversion.nombre,
      tipoEvento: 'retiro',
      montoAfectado: montoRetirado,
      gananciaPorcentaje: gananciaPorcentaje,
    });

    return inversion;
  }

  async obtenerDatosUsuario(idUsuario) {
    const inversionesActivas = await repositorioInversion.buscarPorIdUsuarioYEstado(idUsuario, 'active');
    const totalInvertido = inversionesActivas.reduce((acc, inversion) => acc + inversion.montoActual, 0);
    
    return {
      totalInvertido: totalInvertido,
    };
  }

  async eliminarInversion(idInversion, idUsuario) {
    const inversion = await repositorioInversion.buscarPorId(idInversion);

    if (!inversion) {
      const error = new Error('Inversión no encontrada.');
      error.status = 404;
      throw error;
    }

    if (inversion.usuario.toString() !== idUsuario.toString()) {
      const error = new Error('No autorizado para eliminar esta inversión.');
      error.status = 403;
      throw error;
    }

    await servicioHistorial.agregarRegistro({
        usuario: idUsuario,
        inversion: inversion._id,
        nombreInversion: inversion.nombre,
        tipoEvento: 'eliminacion',
        montoAfectado: 0,
    });
    
    inversion.estado = 'deleted';
    inversion.fechaCierre = Date.now();
    await inversion.save();

    return { message: 'Inversión eliminada correctamente' };
  }

  async obtenerHistorialPorIdUsuario(idUsuario) {
    return await servicioHistorial.obtenerHistorialPorIdUsuario(idUsuario);
  }

  async actualizarInversion(idInversion, idUsuario, datosActualizados) {
    const inversion = await repositorioInversion.buscarPorId(idInversion);

    if (!inversion) {
      const error = new Error('Inversión no encontrada.');
      error.status = 404;
      throw error;
    }

    if (inversion.usuario.toString() !== idUsuario.toString()) {
      const error = new Error('No autorizado para editar esta inversión.');
      error.status = 403;
      throw error;
    }


    if (
      datosActualizados.montoInicial ||
      datosActualizados.porcentajeRetornoAnual ||
      datosActualizados.tiempoInversion
    ) {
      const monto = datosActualizados.montoInicial || inversion.montoInicial;
      const porcentaje =
        datosActualizados.porcentajeRetornoAnual ||
        inversion.porcentajeRetornoAnual;
      const tiempo =
        datosActualizados.tiempoInversion || inversion.tiempoInversion;

      datosActualizados.montoRetornoEsperado =
        monto * (1 + (porcentaje / 100 / 12) * tiempo);

      if (datosActualizados.montoInicial) {
        datosActualizados.montoActual = datosActualizados.montoInicial;
      }
    }

    const inversionActualizada = await repositorioInversion.actualizar(idInversion, datosActualizados);
    return inversionActualizada;
  }
}

module.exports = new ServicioInversion();
