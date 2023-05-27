const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    branch: {
        type: String,
    },
    slot: {
        type: String,
    },
    sem: {
        type: Number,
    },
    subcode: {
        type: [String],
    }
});

module.exports = new mongoose.model('Slot', SlotSchema);