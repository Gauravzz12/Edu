const mongoose = require('mongoose');

const markDetailsSchema = new mongoose.Schema({
    subject: String,
    testType: String,
    maxMarks: Number,
    scoredMarks: Number
});

const marksSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
    },
    name:{
        type: String,
        required: true
    
    },
    marks:{
        type: [markDetailsSchema],
        required: true
    },
});

module.exports = mongoose.model('Marks', marksSchema);
