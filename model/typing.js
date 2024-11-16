const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        lowercase: true
    },
    nameInThree: {
        type: String,
        required: true,
        lowercase: true,
        validate: (value) => value.length === 3
    },
    zeroDmgTo: {
        type: [String],
        lowercase: true
    },
    halfDmgTo: {
        type: [String],
        lowercase: true
    },
    twoDmgTo: {
        type: [String],
        lowercase: true
    }
})

const Type = mongoose.model('Type', typeSchema);
module.exports = Type;