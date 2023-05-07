const express = require('express');
const router = express.Router();
const univeristyExamController = require('../controllers/universityExamController');

router.get('/', univeristyExamController.getSubcode)
      .post('/', univeristyExamController.addSchedule)
      .get('/schedule', univeristyExamController.viewSchedules)
      .delete('/:id', univeristyExamController.deleteSchedule);

module.exports = router;