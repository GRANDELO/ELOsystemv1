const Feedback = require('../models/feedback');

// Controller to handle feedback submission
const submitFeedback = async (req, res) => {
    try {
        const { username, feedback } = req.body;

        // Validation
        if (!username || !feedback) {
            return res.status(400).json({ message: 'Username and feedback are required.' });
        }

        const newFeedback = new Feedback({
            username,
            feedback
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Controller to fetch all feedback
const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Failed to fetch feedback.' });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback
};