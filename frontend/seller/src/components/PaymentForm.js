import axios from 'axios';
import React, { useState } from 'react';

const MpesaPayment = () => {
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handlePayment = async () => {
        setMessage(''); // Clear any previous message
        const payload = {
            phone: phone,
            amount: amount
        };

        try {
            const response = await axios.post('https://elosystemv1.onrender.com/api/mpesa/lipa', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage('Payment initiated successfully!');
            console.log(response.data);
        } catch (error) {
            setMessage('Payment initiation failed: ' + (error.response ? error.response.data.message : error.message));
            console.error('Error:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h1>M-Pesa Payment</h1>
            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number (254...)"
                required
                style={styles.input}
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
                style={styles.input}
            />
            <button onClick={handlePayment} style={styles.button}>Pay Now</button>
            {message && <p>{message}</p>}
        </div>
    );
};

const styles = {
    container: {
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        margin: 'auto',
        textAlign: 'center'
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
    },
};

export default MpesaPayment;
