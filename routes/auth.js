const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const controladorAuth = require('../controllers/authController');
const auth = require('../middleware/auth');
const validar = require('../middleware/validation');

router.post(
  '/register',
  [
    check('nombreUsuario', 'El nombre de usuario es requerido').not().isEmpty(),
    check('email', 'Por favor incluye un email válido').isEmail(),
    check('contrasena', 'La contraseña debe tener 6 o más caracteres').isLength({ min: 6 }),
  ],
  validar,
  controladorAuth.registrar
);

router.get('/verify/:token', controladorAuth.verificarEmail);

router.post(
    '/login',
    [
        check('email', 'Por favor incluye un email válido').isEmail(),
        check('contrasena', 'La contraseña es requerida').exists(),
    ],
    validar,
    controladorAuth.iniciarSesion
);

router.get('/verify-token', auth, (req, res) => {
  res.json({ msg: 'Token válido' });
});

module.exports = router;