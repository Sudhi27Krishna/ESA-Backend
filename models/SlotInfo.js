const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    branch: {
        type: String,
        required: [true, 'Please enter Branch']
    },
    slot: {
        type: String,
        required: [true, 'Enter the Slot']
    },
    subjects: {
        //multiple subjects can be entered
        type: [String],
        required: [true, 'Enter subjects of slot']
    }
});

module.exports = new mongoose.model('Slot', SlotSchema);