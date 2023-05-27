const Schedule = require('../models/Schedule');
const Room = require('../models/Room');
const Allocations = require('../models/Allocations');
const RoomBooking = require('../models/RoomBooking');
const manipulate = require('../manipulate');

const getDates = async (req, res) => {
    const user = req.user.username;

    try {
        const dates = await Schedule.distinct('date', { user });
        const sortedDates = dates.sort((a, b) => new Date(a) - new Date(b));
        const formattedDates = sortedDates.map(date => {
            const d = new Date(date);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        });
        return res.status(200).send(formattedDates);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

const getExams = async (req, res) => {
    const { date, time } = req.query;
    console.log(req.query);
    const user = req.user.username;
    if (!date || !time) {
        return res.status(400).json({ 'message': 'provide date and time' });
    }

    try {
        const formattedDate = date.split('-').reverse().join('-');
        const dateObject = new Date(formattedDate).toISOString();

        const schedules = await Schedule.find({ date: dateObject, time: time, user: user }).select('sem branch slot subcode').lean();

        const exams = schedules.reduce((acc, { sem, branch, slot }) => {
            const exam = `S${sem}-${branch}-${slot}`;
            acc.push(exam);
            return acc;
        }, []);

        if (exams?.length === 0) {
            exams.push("No exams scheduled");
        }
        const details = schedules.map(({ sem, branch, slot, subcode }) => {
            return { sem, branch, slot, subcode };
        });


        return res.status(200).json({ exams, details });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 'message': error.message });
    }
};

const getRooms = async (req, res) => {
    const user = req.user._id;
    try {
        const rooms = await Room.find({ user }).select('room_no capacity');
        return res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ 'message': err.message });
    }
};

const createAllocation = async (req, res) => {
    const user = req.user.username;
    const { date, time, rooms, details } = req.body;
    // console.log(req.body);
    if (!date || !time || !rooms || !details) {
        return res.status(400).json({ 'message': 'provide date, time and rooms' });
    }
    const formattedDate = date.split('-').reverse().join('-');
    const dateObject = new Date(formattedDate).toISOString();
    //console.log(dateObject)
    try {
        // First, find the schedule document that matches the given date, time, and subcode
        const schedule = await Schedule.findOne({ user, date: dateObject, time });

        // If a matching schedule document is found, create a new exam document with the required fields
        if (schedule) {
            const newAllocation = new Allocations({
                user: req.user.username,
                date: dateObject,
                time,
                rooms,
            });
            await newAllocation.save();

            // manipulate(req.body); // function for manipulating the uploadedExcel file for seat arrangement

            const roomNumbers = rooms.map((room) => room.room_no);

            // Creating the rooms booked for a particular date
            await RoomBooking.create({ user: req.user.username, date: dateObject, time, rooms: roomNumbers });

            // Return the newly created exam document or any other relevant data
            res.json({ message: 'Allocation created successfully', Allocation: newAllocation });
        }
        else {
            // If no matching schedule document is found, return an appropriate error message
            res.status(404).json({ error: 'No schedule found for the given date and time' });
        }

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
};

const getRoomsBooked = async (req, res) => {
    const { date, time } = req.query;
    const user = req.user.username;

    if (!date) {
        return res.status(400).json({ 'message': 'Provide date' });
    }

    const formattedDate = date.split('-').reverse().join('-');
    const dateObject = new Date(formattedDate).toISOString();

    try {
        const bookedRooms = await RoomBooking.findOne({ user, date: dateObject, time });
        console.log(bookedRooms);
        res.status(200).json(bookedRooms?.rooms);
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

const getAllocation = async (req, res) => {
    const { date, time } = req.query;
    console.log(req.query);
    const user = req.user.username;
    if (!date || !time) {
        return res.status(400).json({ 'message': 'provide date and time' });
    }
    try {
        const formattedDate = date.split('-').reverse().join('-');
        const dateObject = new Date(formattedDate).toISOString();
        const allocations = await Allocations.find(user, { date: dateObject, time: time }).select('rooms').lean();
        const rooms = allocations.flatMap(allocation => allocation.rooms);
        return res.status(200).json(rooms);
    }
    catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
};

module.exports = { getExams, getRooms, getDates, createAllocation, getRoomsBooked, getAllocation };