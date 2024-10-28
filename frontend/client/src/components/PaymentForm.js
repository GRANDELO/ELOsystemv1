// PaymentForm.js
import axios from 'axios';
import React, { useState } from 'react';

const PaymentForm = () => {
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/mpesa/lipa', { phone, amount });
            setMessage('Payment initiated successfully. Please check your phone to complete the transaction.');
            console.log(response.data); // Optional: log response data for debugging
        } catch (error) {
            console.error('Error initiating payment:', error);
            setMessage('Payment initiation failed. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <h2>Initiate M-Pesa Payment</h2>
            <form onSubmit={handlePayment} style={styles.form}>
                <label>
                    Phone Number:
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07XXXXXXXX"
                        style={styles.input}
                        required
                    />
                </label>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        style={styles.input}
                        required
                    />
                </label>
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Processing...' : 'Pay with M-Pesa'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '400px',
        margin: 'auto',
        padding: '1rem',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    input: {
        padding: '0.5rem',
        fontSize: '1rem',
    },
    button: {
        padding: '0.5rem',
        fontSize: '1rem',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
};

export default PaymentForm;
