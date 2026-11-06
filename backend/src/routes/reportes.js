const express = require('express');
const { getResumen, getReportePorCuenta } = require('../controllers/reporteController');

const router = express.Router();

router.get('/resumen', getResumen);
router.get('/cuenta/:id', getReportePorCuenta);

module.exports = router;
