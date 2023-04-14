const Room = require('../models/Room');

const handleRoom = async (req, res) => {
    const {room_no, floor_no, block, capacity} = req.body;
    const duplicate = await Room.findOne({room_no: room_no}).exec();

    if (duplicate) return res.sendStatus(409);
    
    try {
        const createdRoom = await Room.create({room_no, floor_no, block, capacity});
        console.log(createdRoom);
        res.status(201).json({ 'success': `Room ${createdRoom.room_no} added successfully.` });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleRoom };