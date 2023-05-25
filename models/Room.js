const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    room_no: {
        type: String,
        required: [true, 'Please provide room no'],
    },
    floor_no: {
        type: Number,
        required: [true, 'Please provide floor no'],
    },
    block: {
        type: String,
        required: [true, 'Please provide block name'],
        enum: {
            values: ['M-George', 'Ramanujan'],
            message: '{VALUE} is not supported'
        }
    },
    capacity: {
        type: Number,
        require: [true, 'Please provide available seats'],
    }
});

module.exports = new mongoose.model('Room', RoomSchema);