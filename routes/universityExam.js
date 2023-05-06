const express = require('express');
const router = express.Router();
const univeristyExamController = require('../controllers/universityExamController');

router.get('/', univeristyExamController.getSubcode);

module.exports = router;