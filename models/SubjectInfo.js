const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    SubjectCode: {
        type: String,
        required: [true, 'Please enter subject code']
    },
    SubjectName: {
        type: String,
        required: [true, 'Please enter subject name']
    }

});

module.exports = new mongoose.model('Subject', SubjectSchema);