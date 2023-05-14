const Schedule = require('../models/Schedule');
const Room = require('../models/Room');

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

        const schedules = await Schedule.find({ date: dateObject, time: time, user: user }).select('sem branch slot').lean();

        const exams = schedules.reduce((acc, { sem, branch, slot }) => {
            const exam = `S${sem}-${branch}-${slot}`;
            acc.push(exam);
            return acc;
        }, []);

        if(exams?.length === 0){
            exams.push("No exams scheduled");
        }

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

module.exports = { getExams, getRooms, getDates };