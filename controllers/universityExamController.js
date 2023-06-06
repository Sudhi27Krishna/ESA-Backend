const Slot = require('../models/Slot');
const Schedule = require('../models/Schedule');
const path = require('path');
const createBranches = require('../createBranches');

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
        const existingSchedule = await Schedule.findOne({ $or: [{ user: user, sem: sem, date: date, time: time, branch: branch, slot: slot, subcode: subcode }, { user: user, sem: sem, date: date, branch: branch }] });
        if (existingSchedule) {
            return res.status(409).send('Schedule already exists');
        }

        const createdSchedule = await Schedule.create({ user: user, sem: sem, date: date, time: time, branch: branch, slot: slot, subcode: subcode });
        // send response with formatted date, format is depends on users locale setting
        const formattedDate = createdSchedule.date.toLocaleDateString('en-GB');
        res.status(201).send({ ...createdSchedule._doc, date: formattedDate });
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

const uploadFile = async (req, res) => {
    const files = req.files;
    console.log(files);

    Object.keys(files).forEach(key => {
        // filepath needs to be changed
        const filepath = path.join(__dirname, "..", 'uploadedExcels', files[key].name);
        files[key].mv(filepath, (err) => {
            if (err) return res.status(500).json({ status: "error", message: err });
        })
    })

    try {
        await createBranches(Object.keys(files));
    } catch (error) {
        return res.status(500).json({ status: "error", message: error });
    }

    return res.status(201).json({ status: "success", message: Object.keys(files).toString() });
}

module.exports = { getSubcode, addSchedule, viewSchedules, deleteSchedule, uploadFile };