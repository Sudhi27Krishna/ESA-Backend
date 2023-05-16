const mongoose = require('mongoose');

const AllocationSchema = new mongoose.Schema({

    date: {
        type: Date,
        required: [true, 'Provide Date'],
        index: { expires: '100d' },
    },
    time: {
        type: String,
        required: [true, 'Provide Time'],

    },
    rooms: {
        type: [String],
        required: [true, 'Provide room array'],
    },   
},
    { timestamps: true }
);

module.exports = new mongoose.model('Allocations', AllocationSchema);
