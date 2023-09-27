const {getStatsByCityName} = require('../models/crimeStatModels');
const mongoose = require('mongoose');

const getStatByCityNameController = async(req, res) => {
    try {
        const cityStats = await getStatsByCityName(req.params.cityName);
        res.status(201).json(latestScore);
    } catch(error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

module.exports = {getStatByCityNameController}