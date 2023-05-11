const Schedule = require('../models/Schedule');
const Room = require('../models/Room');




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
        const roomCapacities = rooms.map(({ room_no, capacity }) => [room_no, capacity]);
        return res.status(200).json(roomCapacities);
      } catch (error) {
        console.log(error);
        throw new Error('Failed to get room capacities');
      }

};


module.exports = { getExams, getRooms };