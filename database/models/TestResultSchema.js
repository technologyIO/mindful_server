const mongoose = require('mongoose');

const userTestSubmissionSchema = new mongoose.Schema({
    email: { type: String, required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
            selectedChoiceIndex: { type: Number, required: true } // Index of the selected choice (0, 1, 2, etc.)
        }
    ],
    totalScore: { type: Number, required: true } // Calculated total score for the test
});

const UserTestSubmission = mongoose.model('UserTestSubmission', userTestSubmissionSchema);

module.exports = UserTestSubmission;
