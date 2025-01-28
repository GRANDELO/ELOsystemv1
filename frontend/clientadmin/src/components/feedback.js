import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axiosInstance.get('/feedback');
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
        <div style={styles.container}>
            <h3 style={styles.header}>User Feedback</h3>
            {loading ? (
                <p style={styles.loading}>Loading feedback...</p>
            ) : feedbacks.length > 0 ? (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Username</th>
                            <th style={styles.th}>Feedback</th>
                            <th style={styles.th}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((fb) => (
                            <tr key={fb._id} style={styles.row}>
                                <td style={styles.td}>{fb.username}</td>
                                <td style={styles.td}>{fb.feedback}</td>
                                <td style={styles.td}>{new Date(fb.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={styles.noFeedback}>No feedback available at the moment.</p>
            )}
        </div>
    );
};

// Styles as a JS object
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        margin: '20px auto',
        maxWidth: '90%',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        color: '#333',
        fontSize: '24px',
        marginBottom: '20px',
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#777',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
    },
    th: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px',
        textAlign: 'left',
        border: '1px solid #ddd',
    },
    row: {
        backgroundColor: '#ffffff',
    },
    td: {
        padding: '10px',
        border: '1px solid #ddd',
        fontSize: '14px',
        color: '#333',
    },
    noFeedback: {
        textAlign: 'center',
        color: '#777',
        fontSize: '16px',
    },
};

export default AdminFeedback;
