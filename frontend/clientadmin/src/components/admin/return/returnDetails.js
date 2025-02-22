import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useParams } from 'react-router-dom';

const ReturnDetailPage = () => {
    const { returnId } = useParams();
    const [returnRequest, setReturnRequest] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchReturnDetails = async () => {
            try {
                const response = await axiosInstance.get(`/admin-return/${returnId}`);
                setReturnRequest(response.data);
                setStatus(response.data.status);
            } catch (error) {
                console.error("Failed to fetch return details:", error);
            }
        };

        fetchReturnDetails();
    }, [returnId]);

    const handleStatusUpdate = async () => {
        try {
            await axiosInstance.put('update-status', { returnId, status });
            alert('Status updated successfully!');
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    if (!returnRequest) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Return Request Details</h1>
            <p><strong>Order Number:</strong> {returnRequest.orderNumber}</p>
            <p><strong>Customer:</strong> {returnRequest.customerNumber}</p>
            <p><strong>Reason:</strong> {returnRequest.reason}</p>
            <p><strong>Condition:</strong> {returnRequest.condition}</p>
            <p><strong>Resolution:</strong> {returnRequest.resolution}</p>
            <p><strong>Status:</strong> {returnRequest.status}</p>

            <div>
                <label>Update Status:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <button onClick={handleStatusUpdate}>Update Status</button>
            </div>
        </div>
    );
};

export default ReturnDetailPage;