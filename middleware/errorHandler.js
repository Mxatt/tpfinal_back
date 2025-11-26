function manejadorErrores(err, req, res, next) {
  console.error(err.stack);

  const estado = err.status || 500;
  const mensaje = err.message || 'Algo salió mal';

  res.status(estado).json({
    exito: false,
    estado,
    mensaje,
  });
}

module.exports = manejadorErrores;
