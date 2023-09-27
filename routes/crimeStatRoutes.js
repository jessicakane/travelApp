const express = require('express');
const router = express.Router();

router.get('/:cityName', crimeStatControllers.getStatByCityNameController);

module.exports = router;