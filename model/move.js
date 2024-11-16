const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    typing: {
        type: String,
        required: true,
        lowercase: true
    },
    damage_class: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['status', 'physical', 'special']
    },
    power: {
        type: Number,
        min: 0
    },
    accuracy: {
        type: Number,
        max: 100,
        min: 0
    },
    pp: {
        type: Number,
        min: 0
    }
})

const Move = mongoose.model('Move', moveSchema);
module.exports = Move;