const {getStatsByCityName} = require('../models/crimeStatModels');
const mongoose = require('mongoose');

const getStatByCityNameController = async(req, res) => {
    try {
        const cityScore = await getStatsByCityName(req.query.cityName);
        res.status(201).json(cityScore);
    } catch(error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

module.exports = {getStatByCityNameController}