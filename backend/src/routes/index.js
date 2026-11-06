const express = require('express');
const clientesRoutes = require('./clientes');
const cuentasRoutes = require('./cuentas');
const tiposCuentaRoutes = require('./tiposCuenta');
const sucursalesRoutes = require('./sucursales');
const transaccionesRoutes = require('./transacciones');
const reportesRoutes = require('./reportes');
const usuariosRoutes = require('./usuarios');
const authRoutes = require('./auth');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use('/auth', authRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API del sistema bancario funcionando correctamente.',
  });
});

router.use(authMiddleware);
router.use('/clientes', clientesRoutes);
router.use('/cuentas', cuentasRoutes);
router.use('/tipos-cuenta', tiposCuentaRoutes);
router.use('/sucursales', sucursalesRoutes);
router.use('/transacciones', transaccionesRoutes);
router.use('/reportes', reportesRoutes);
router.use('/usuarios', usuariosRoutes);

module.exports = router;
