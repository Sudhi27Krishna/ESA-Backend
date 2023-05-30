const Schedule = require('../models/Schedule');
const Room = require('../models/Room');
const Allocations = require('../models/Allocations');
const RoomBooking = require('../models/RoomBooking');
const manipulate = require('../manipulate');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const directoryPath = path.resolve(__dirname, '../updatedExcels');
const fileNameRegex = /^[A-Za-z]+\.xlsx$/;

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

            await manipulate(req.body); // function for manipulating the uploadedExcel file for seat arrangement

            const newAllocation = new Allocations({
                user: req.user.username,
                date: dateObject,
                time,
                rooms,
            });

            await newAllocation.save();


            const roomNumbers = rooms.map((room) => room.room_no);

            // Creating the rooms booked for a particular date
            await RoomBooking.create({ user: req.user.username, date: dateObject, time, rooms: roomNumbers });

            // Return the newly created exam document or any other relevant data
            res.status(201).json({ message: 'Allocation created successfully', Allocation: newAllocation });
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

const sendExcels = async (req, res) => {
    const email = req.user.email;

    try {
        // Read the contents of the directory
        const files = await fs.promises.readdir(directoryPath);

        if (files.length === 0) {
            return res.status(404).json({ message: 'No files found in the directory' });
        }

        // Delete files matching the regex pattern
        const regex = new RegExp(fileNameRegex);
        const deletedFiles = files.filter((file) => regex.test(file));
        await Promise.all(deletedFiles.map((file) => fs.promises.unlink(path.join(directoryPath, file))));

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            // Configure your email provider details here
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });

        const attachments = files.map((file) => {
            const filePath = path.join(directoryPath, file);
            if (fs.existsSync(filePath)) {
                return { path: filePath };
            }
            return null;
        }).filter((attachment) => attachment !== null);


        // Prepare the email message
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Seat arrangement Excel Files',
            text: 'Please find the files attached.',
            attachments: attachments
        };

        // Send the email
        const sendMailPromise = new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });

        await sendMailPromise;

        // Delete the remaining files after the email is successfully sent
        await Promise.all(files.map(async (file) => {
            const filePath = path.join(directoryPath, file);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        }));

        const folderPath = path.join(__dirname, '../uploadedExcels');
        fs.rmdir(folderPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error deleting directory:', err);
                return;
            }

            console.log('Directory deleted:', folderPath);
        });

        return res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'An error occurred while sending the email' });
    }
}

module.exports = { getExams, getRooms, getDates, createAllocation, getRoomsBooked, getAllocation, sendExcels };