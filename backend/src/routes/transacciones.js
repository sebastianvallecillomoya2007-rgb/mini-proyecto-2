const express = require('express');
const {
  getAllTransacciones,
  getTransaccionById,
  createTransaccion,
  updateTransaccion,
  deleteTransaccion,
} = require('../controllers/transaccionController');

const router = express.Router();

router.get('/', getAllTransacciones);
router.get('/:id', getTransaccionById);
router.post('/', createTransaccion);
router.put('/:id', updateTransaccion);
router.delete('/:id', deleteTransaccion);

module.exports = router;
