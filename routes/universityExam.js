const express = require('express');
const router = express.Router();
const univeristyExamController = require('../controllers/universityExamController');
const filePayloadExists = require('../middlewares/filePayloadExists');
const fileExtLimiter = require('../middlewares/fileExtLimiter');
const fileSizeLimiter = require('../middlewares/fileSizeLimiter')

router.post('/save', fileUpload({ createParentPath: true }),
    filePayloadExists,
    fileExtLimiter([".xlsx"]),
    fileSizeLimiter,
    univeristyExamController.fileUpload);

module.exports = router;