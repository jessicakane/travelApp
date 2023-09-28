const mongoose = require('mongoose');
const Dummy = require('../schemas/crimeStatsSchema');
const IsraelCrime = require('../schemas/newScoreSchema'); 

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

async function newGetStatsByCityName(cityName) {
    try {
    const cityData = await IsraelCrime.findOne({city: cityName});
    console.log(cityName)
    return cityData;
    } catch (error) {
        console.error('Error fetching latest score:', error);
        throw error;
    }
}

module.exports = {getStatsByCityName, newGetStatsByCityName}