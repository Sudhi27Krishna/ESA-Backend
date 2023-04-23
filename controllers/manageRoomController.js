const Room = require('../models/Room');

const handleRoom = async (req, res) => {
    const { room_no, floor_no, block, capacity } = req.body;

    if (!room_no || !floor_no || !block || !capacity) {
        return res.status(400).json({ 'failure': 'Please make sure all fields are filled with values' });
    }

    const duplicate = await Room.findOne({ $and: [{ room_no: room_no }, { user: req.user.id }] }).exec();

    if (duplicate) return res.status(409).json({ 'failure': 'Room already added' });

    try {
        const createdRoom = await Room.create({ user: req.user.id, room_no, floor_no, block, capacity });
        console.log(createdRoom);
        res.status(201).json(createdRoom);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ 'message': err.message });
    }
}

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ user: req.user.id });
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};


const deleteRooms = async (req, res) => {
    const room_no = req.params.id;
    if (!room_no) {
        return res.status(400).json({ 'failure': 'Please enter the room number' });
    }

    //find room entered by that user
    try {
        const result = await Room.findOne({ $and: [{ room_no: room_no }, { user: req.user.id }] }).exec();
        if (!result) {
            return res.status(404).json({ 'failure': 'Room not found' });
        }

        await Room.deleteOne({ $and: [{ room_no: room_no }, { user: req.user.id }] });
        res.sendStatus(201);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

module.exports = { handleRoom, getRooms, deleteRooms };