const Slot = require('../models/Slot');
const Schedule = require('../models/Schedule');


const getSubcode = async (req, res) => {
    const { sem, branch, slot } = req.query;
    if (!branch || !slot) return res.status(400).json({ 'message': 'provide branch and slot' });
    // enter branch and slot in capital letters
    try {
        const slots = await Slot.findOne({ sem: sem, branch: branch, slot: slot }, { subcode: 1, _id: 0 });
        // sending only subcode array
        res.send(slots.subcode);
    } catch (error) {
        console.log(error);
        res.status(500).json({ 'message': error.message });
    }
};

const addSchedule = async (req, res) => {
    const { sem, date, time, branch, slot, subcode } = req.body;
    const user = req.user.username;

    try {
        const existingSchedule = await Schedule.findOne({ user: user, sem: sem, date: date, time: time, branch: branch, slot: slot, subcode: subcode });
        if (existingSchedule) {
            return res.status(409).send('Schedule already exists');
        }

        const schedule = new Schedule({ user: user, sem: sem, date: date, time: time, branch: branch, slot: slot, subcode: subcode });
        await schedule.save();
        res.status(201).send(schedule);
    } catch (error) {
        res.status(400).send(error);
    }

}

const viewSchedules = async (req, res) => {
    const user = req.user.username;

    try {
        const schedules = await Schedule.find({ user: user });
        const formattedSchedules = schedules.map((schedule) => {
            const date = schedule.date.toLocaleDateString("en-GB");
            return { ...schedule._doc, date };
        });
        res.status(200).send(formattedSchedules);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteSchedule = async (req, res) => {
    const user = req.user.username;
    const scheduleId = req.params.id;

    try {
        const schedule = await Schedule.findOneAndDelete({ _id: scheduleId, user: user });

        if (!schedule) {
            return res.status(404).send('Schedule not found');
        }

        res.status(200).send(`Schedule with id ${scheduleId}, user ${schedule.user}, and subcode ${schedule.subcode} deleted successfully`);

    } catch (error) {
        res.status(400).send(error);
    }
}



module.exports = { getSubcode, addSchedule, viewSchedules, deleteSchedule };
