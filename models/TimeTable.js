const mongoose = require('mongoose');

const TimeTableSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Please provide exam date']

    },
    branch: {
        type: String,
        required: [true, 'Please provide Branch']
    },
    slot: {
        type: String,
        required: [true, 'Please provide slot']
    },
    subject: {
        type: String,
        required: [true, 'please provide the subject code']
    }
});

module.exports = new mongoose.model('TimeTable', TimeTableSchema);