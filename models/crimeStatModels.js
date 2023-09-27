const mongoose = require('mongoose');
const Dummy = require('../schemas/crimeStatsSchema');

async function getStatsByCityName(cityName) {
    try {
    const cityData = await Dummy.findOne({city: cityName});
    console.log(cityName)
    return cityData;
    } catch (error) {
        console.error('Error fetching latest score:', error);
        throw error;
    }
}

module.exports = {getStatsByCityName}