const mongoose = require('mongoose');

const abilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    pokemon: [{
        name: String,
        dex_num: Number
    }]
})

const Ability = mongoose.model('Ability', abilitySchema);
module.exports = Ability;