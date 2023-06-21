const express = require('express');
const router = express.Router();
const seatAllocationController = require('../controllers/seatAllocationController');

router.get('/dates', seatAllocationController.getDates)
      .get('/get-exams', seatAllocationController.getExams) //get all exams on specific date and time
      .get('/get-rooms', seatAllocationController.getRooms) //get all rooms allocated for exams
      .post('/allocation', seatAllocationController.createAllocation) //add the room alloted for exam to DB
      .get('/get-allocation', seatAllocationController.getAllocation)
      .get('/send-excels', seatAllocationController.sendExcels);

module.exports = router;