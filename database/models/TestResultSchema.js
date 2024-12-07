const mongoose = require('mongoose');

const userTestSubmissionSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: Number, required: false },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
            selectedChoiceIndex: { type: Number, required: true } // Index of the selected choice (0, 1, 2, etc.)
        }
    ],
    totalScore: { type: Number, required: true },
}, { timestamps: true });

const UserTestSubmission = mongoose.model('UserTestSubmission', userTestSubmissionSchema);

module.exports = UserTestSubmission;

