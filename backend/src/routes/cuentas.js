const express = require('express');
const {
  getAllCuentas,
  getCuentaById,
  createCuenta,
  updateCuenta,
  deleteCuenta,
} = require('../controllers/cuentaController');

const router = express.Router();

router.get('/', getAllCuentas);
router.get('/:id', getCuentaById);
router.post('/', createCuenta);
router.put('/:id', updateCuenta);
router.delete('/:id', deleteCuenta);

module.exports = router;
