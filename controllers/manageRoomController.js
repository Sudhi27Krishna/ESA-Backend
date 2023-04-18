const Room = require('../models/Room');
const asyncHandler = require('express-async-handler');

const handleRoom = async (req, res) => {
    const { room_no, floor_no, block, capacity } = req.body;
    const duplicate = await Room.findOne({ 
        $and:[
          {room_no:room_no},{user:req.user.id}
        ]
        }).exec();

    if (duplicate) {
        res.status(409);
        throw new Error('room already addedd');

    }

    try {
        const createdRoom = await Room.create({ user: req.user.id, room_no, floor_no, block, capacity });
        console.log(createdRoom);
        res.status(201).json({ 'success': `Room ${createdRoom.room_no} added successfully.` });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ 'message': err.message });
    }
}

const getRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find({ user: req.user.id });
    res.status(200).json(rooms);
});

module.exports = { handleRoom, getRooms };