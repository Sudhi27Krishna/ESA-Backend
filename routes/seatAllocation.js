const express = require('express');
const router = express.Router();
const seatAllocationController = require('../controllers/seatAllocationController');

router.get('/dates',seatAllocationController.getDates)
      .get('/get-exams',seatAllocationController.getExams) //get all exams on specific date and time
      .get('/get-rooms',seatAllocationController.getRooms) //get all rooms allocated for exams
      .post('/allocation',seatAllocationController.setAllocation) //add the room alloted for exam to DB
      .get('/getallocation',seatAllocationController.getAllocation);

module.exports = router;