const express = require('express');
const router = express.Router();
const univeristyExamController = require('../controllers/universityExamController');
const filePayloadExists = require('../middlewares/filePayloadExists');
const fileExtLimiter = require('../middlewares/fileExtLimiter');
const fileSizeLimiter = require('../middlewares/fileSizeLimiter');

router.get('/', univeristyExamController.getSubcode)
      .post('/', univeristyExamController.addSchedule)
      .post('/save', fileUpload({ createParentPath: true }),
        filePayloadExists,
        fileExtLimiter([".xlsx"]),
        fileSizeLimiter,
        univeristyExamController.fileUpload)
      .get('/schedule', univeristyExamController.viewSchedules)
      .delete('/:id', univeristyExamController.deleteSchedule);

module.exports = router;