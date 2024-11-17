const mongoose = require('mongoose');

const evolutionSchema = new mongoose.Schema({
    id: Number,
    pokemon_one: String,
    pokemon_one_url: String,
    evolve_one_by: {
        name: String,
        imgUrl: String
    },
    pokemon_two_url: String,
    pokemon_two: String,
    evolve_two_by: {
        name: String,
        imgUrl: String
    },
    pokemon_three: String,
    pokemon_three_url: String
})

const Evolution = mongoose.model('Evolution', evolutionSchema);
module.exports = Evolution;