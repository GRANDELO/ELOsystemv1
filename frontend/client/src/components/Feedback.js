import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');
    const username = localStorage.getItem('username'); // Assuming username is stored

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://elosystemv1.onrender.com/api/feedback/submit', {
                username,
                feedback,
            });
            setMessage('Feedback submitted successfully!');
            setFeedback('');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setMessage('Failed to submit feedback. Please try again.');
        }
    };

    return (
        <div>
            <h3>Submit Feedback</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Write your feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="4"
                    required
                ></textarea>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FeedbackForm;
