const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
    dex_num: {
        type: Number,
        min: 1,
        required: true
    },
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    species: {
        type: Number,
        required: true,
        min: 1
    },
    typing: {
        type: [String],
        required: true,
        lowercase: true
    },
    abilities: {
        type: [String],
        required: true
    },
    stats: [{
        name: {
            type: String,
            required: true
        },
        base_stat: {
            type: Number,
            min: 0
        }
    }],
    moves: [{
        name: {
            type: String,
            required: true
        },
        level_learned_at: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }
    }],
    moves_updated_to: String,
    megas: [String],
    sprite: {
        type: String,
        required: true
    }
})

const Pokemon = mongoose.model('Pokemon', pokemonSchema);
module.exports = Pokemon;