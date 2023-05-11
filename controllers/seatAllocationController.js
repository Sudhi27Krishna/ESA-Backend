const Schedule = require('../models/Schedule');
const Room = require('../models/Room');

const dates = async (req, res) => {
    try {
        const dates = await Schedule.distinct('date');
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
    if (!date || !time) {
        return res.status(400).json({ 'message': 'provide date and time' });
    }

    try {
        const schedules = await Schedule.find({ date, time }).select('sem branch slot').lean();
        //console.log(schedules);
        // Remove duplicates
        const exams = schedules.reduce((acc, { sem, branch, slot }) => {
            const exam = `${sem}-${branch}-${slot}`;
            if (!acc.includes(exam)) {
                acc.push(exam);
            }
            return acc;
        }, []);

        return res.status(200).json(exams);
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

module.exports = { getExams, getRooms, dates };