const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    questionText: { type: String, required: true },
    choices: [{ type: String, required: true }],
    reverseScored: { type: Boolean, default: false },
    score: { type: Number, required: true }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
