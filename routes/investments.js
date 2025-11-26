const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const controladorInversion = require('../controllers/investmentController');
const validar = require('../middleware/validation');

router.get('/', auth, controladorInversion.obtenerInversiones);

router.post(
  '/',
  [
    auth,
    check('nombre', 'El nombre de la inversión es requerido').not().isEmpty(),
    check('montoInicial', 'El monto inicial debe ser un número positivo').isFloat({ gt: 0 }),
    check('porcentajeRetornoAnual', 'El porcentaje de retorno anual debe ser un número positivo').isFloat({ gt: 0 }),
    check('tiempoInversion', 'El tiempo de inversión debe ser un número entero positivo').isInt({ gt: 0 }),
    check('tipoInversion', 'El tipo de inversión es requerido').not().isEmpty(),
  ],
  validar,
  controladorInversion.agregarInversion
);

router.get('/userdata', auth, controladorInversion.obtenerDatosUsuario);

router.put(
  '/:id/withdraw',
  [
    auth,
    check('amount', 'El monto debe ser un número positivo').isFloat({ gt: 0 }),
  ],
  validar,
  controladorInversion.retirarInversion
);

router.delete('/:id', auth, controladorInversion.eliminarInversion);

router.put(
  '/:id',
  [
    auth,
    check('nombre', 'El nombre de la inversión es requerido').optional().not().isEmpty(),
    check('montoInicial', 'El monto inicial debe ser un número positivo').optional().isFloat({ gt: 0 }),
    check('porcentajeRetornoAnual', 'El porcentaje de retorno anual debe ser un número positivo').optional().isFloat({ gt: 0 }),
    check('tiempoInversion', 'El tiempo de inversión debe ser un número entero positivo').optional().isInt({ gt: 0 }),
    check('tipoInversion', 'El tipo de inversión es requerido').optional().not().isEmpty(),
  ],
  validar,
  controladorInversion.actualizarInversion
);

router.get('/history', auth, controladorInversion.obtenerHistorialInversiones);

module.exports = router;