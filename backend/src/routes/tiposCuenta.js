const express = require('express');
const {
  getAllTiposCuenta,
  getTipoCuentaById,
  createTipoCuenta,
  updateTipoCuenta,
  deleteTipoCuenta,
} = require('../controllers/tipoCuentaController');

const router = express.Router();

router.get('/', getAllTiposCuenta);
router.get('/:id', getTipoCuentaById);
router.post('/', createTipoCuenta);
router.put('/:id', updateTipoCuenta);
router.delete('/:id', deleteTipoCuenta);

module.exports = router;
