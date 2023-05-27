const mongoose = require('mongoose');

const RoomBookingSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        required: [true, 'Provide Date'],
        index: { expires: '100d' },
    },
    rooms: {
        type: [String],
        required: [true, 'Please provide rooms'],
    }
});

module.exports = new mongoose.model('RoomBooking', RoomBookingSchema);