const mongoose = require('mongoose');
const {Schema} = mongoose;

const scoreSchema = new Schema ({
    city: { type: String, required: true }, // Define the schema to match your collection's structure
    assault_score: { type: Number, required: true },
    theft_score: { type: String, required: true },
    fraud_score: { type: Number, required: true },
    littering_score: { type: Number, required: true },
});
  
const IsraelCrime = mongoose.model('IsraelCrime', scoreSchema, 'IsraelCrime');

module.exports = IsraelCrime;