const express = require('express');
const Test = require('../database/models/TestSchema');
const Question = require('../database/models/QuestionSchema');
const UserTestSubmission = require('../database/models/TestResultSchema');
const router = express.Router();
// const Test = require('../models/Test');

// API to create a new test
router.post('/createTest', async (req, res) => {
    try {
        const { testName } = req.body;

        // Create new test
        const test = new Test({ testName });
        await test.save();

        res.status(201).json({ message: 'Test created successfully', testId: test._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API to get all tests
router.get('/getAllTests', async (req, res) => {
    try {
        const tests = await Test.find();
        res.status(200).json({ tests });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// API to add a question to a specific test
router.post('/addQuestion', async (req, res) => {
    try {
        const { testId, questionText, choices, reverseScored, score } = req.body;

        // Create new question
        const question = new Question({
            testId,
            questionText,
            choices,
            reverseScored,
            score
        });

        await question.save();
        res.status(201).json({ message: 'Question added successfully', question });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/addMultipleQuestions', async (req, res) => {
    try {
        const questions = req.body; // Expecting an array of question objects in the request body

        // Validate that the payload is an array
        if (!Array.isArray(questions)) {
            return res.status(400).json({ message: 'Payload should be an array of questions' });
        }

        // Insert questions in bulk using insertMany
        const insertedQuestions = await Question.insertMany(questions);

        res.status(201).json({
            message: 'Questions added successfully',
            count: insertedQuestions.length,
            questions: insertedQuestions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// API to get questions by test name

router.get('/getQuestions/:testName', async (req, res) => {
    try {
        const { testName } = req.params;

        // Find the test by name
        const test = await Test.findOne({ testName });

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Find all questions related to the testId
        const questions = await Question.find({ testId: test._id });

        res.status(200).json({ questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// API to submit answers and calculate score
router.post('/submitTest', async (req, res) => {
    try {
        const { email, testId, answers, phone, name } = req.body; // answers is an array of { questionId, selectedChoiceIndex }

        let totalScore = 0;

        for (const answer of answers) {
            const { questionId, selectedChoiceIndex } = answer;

            // Find the question to determine if it’s reverse scored
            const question = await Question.findById(questionId);
            if (!question) {
                return res.status(400).json({ message: 'Invalid question ID' });
            }

            // Calculate points based on choice index and reverse scoring
            let score;
            if (question.reverseScored) {
                score = 4 - selectedChoiceIndex; // Reverse scoring (e.g., 0 -> 4, 1 -> 3, etc.)
            } else {
                score = selectedChoiceIndex; // Regular scoring
            }

            totalScore += score;
        }

        // Save the test submission with total score
        const userTestSubmission = new UserTestSubmission({
            email,
            name,
            testId,
            phone,
            answers,
            totalScore
        });
        await userTestSubmission.save();

        res.status(201).json({
            message: 'Test submitted successfully',
            totalScore,
            userTestSubmission
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getAllResults', async (req, res) => {
    try {
        const allResults = await UserTestSubmission.find().sort({ createdAt: -1 }).populate({
            path: 'testId',
            select: 'testName', // Only fetch the testName field
        });
        res.status(200).json(allResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/getSubmissionDetails/:submissionId', async (req, res) => {
    try {
        const { submissionId } = req.params;

        // Fetch the submission with all details
        const submission = await UserTestSubmission.findById(submissionId)
            .populate({
                path: 'testId',
                select: 'testName', // Include test name from the Test collection
            })
            .populate({
                path: 'answers.questionId',
                select: 'questionText choices reverseScored score', // Include question details
            });

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
