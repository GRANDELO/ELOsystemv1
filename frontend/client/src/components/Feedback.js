import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { getUsernameFromToken } from '../utils/auth';

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');

    // Retrieve username from token
    useEffect(() => {
        const fetchedUsername = getUsernameFromToken();
        if (fetchedUsername) {
            console.log('Fetched username:', fetchedUsername);
            setUsername(fetchedUsername);
        } else {
            setMessage('Username not found. Please log in again.');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username) {
            setMessage('Username is required. Please log in.');
            return;
        }

        try {
            await axiosInstance.post('/feedback/submit', {
                username,
                feedback,
            });
            console.log('Submitting feedback:', { username, feedback });

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
