const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  const partesToken = authHeader.split(' ');

  if (partesToken.length !== 2 || partesToken[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'El token no es válido, el formato debe ser "Bearer <token>"' });
  }
  
  const token = partesToken[1];

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodificado.usuario;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'El token no es válido' });
  }
};