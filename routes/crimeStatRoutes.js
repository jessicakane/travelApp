const express = require('express');
const router = express.Router();

const crimeStatControllers = require('../controllers/crimeStatControllers');

router.get('/', crimeStatControllers.getStatByCityNameController);

module.exports = router;