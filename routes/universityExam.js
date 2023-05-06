const express = require('express');
const router = express.Router();
const univeristyExamController = require('../controllers/universityExamController');

router.post('/', univeristyExamController.getSubcode);




module.exports = router;