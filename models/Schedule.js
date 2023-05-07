const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({

    user: {
        type: String,
        required: true,
        ref: 'User'
    },
    sem: {
        type: Number,
        required: [true, 'Provide semester number'],
    },
    date: {
        type: Date,
        required: [true, 'Provide Date'],
        index: { expires: '10d' },
    },
    time: {
        type: String,
        required: [true, 'Provide Time'],
        index: { expires: '10d' },
    },
    branch: {
        type: String,
        required: [true, 'Provide Branch'],
    },
    slot: {
        type: String,
        required: [true, 'Provide slot info'],
    },

    subcode: {
        type: String,
        required: [true, 'Provide subcode info'],
    }
},
    { timestamps: true }
);

module.exports = new mongoose.model('Schedule', ScheduleSchema);
