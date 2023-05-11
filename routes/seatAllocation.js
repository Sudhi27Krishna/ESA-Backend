const express = require('express');
const router = express.Router();
const seatAllocationController = require('../controllers/seatAllocationController');

router.get('/dates',seatAllocationController.dates)
      .get('/get-exams',seatAllocationController.getExams) //get all exams on specific date and time
      .get('/get-rooms',seatAllocationController.getRooms); //get all rooms allocated for exams

module.exports = router;