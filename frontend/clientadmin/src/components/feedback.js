import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('https://elosystemv1.onrender.com/api/feedback');
                setFeedbacks(response.data);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    return (
        <div>
            <h3>User Feedback</h3>
            {loading ? (
                <p>Loading feedback...</p>
            ) : (
                <ul>
                    {feedbacks.map((fb) => (
                        <li key={fb._id}>
                            <p><strong>{fb.username}</strong>: {fb.feedback}</p>
                            <small>{new Date(fb.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminFeedback;
