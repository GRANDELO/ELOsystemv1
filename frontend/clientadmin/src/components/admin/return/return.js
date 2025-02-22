import React, { useState, useEffect }from 'react';
import axiosInstance from '../../axiosInstance';

const ReturnHandling = () => {
    const[showReturn, setShowReturn] = useState();

    useEffect (() => {
        const fecthReturns = async ()=> {
            try{
               const response = await axiosInstance.get('/admin-return');
               setShowReturn(response.data.showReturn);
            }catch  (error){
                console.error("Failed to fetch returns:", error);
            }
        };
        fecthReturns();
    }, []);

    return (
        <div>
            <h1>Return Requests</h1>
            <table>
                <thead>
                    <tr>
                        <th>Order Number</th>
                        <th>Customer</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {showReturn.map((ret) => (
                        <tr key={ret._id}>
                            <td>{ret.orderNumber}</td>
                            <td>{ret.customerNumber}</td>
                            <td>{ret.reason}</td>
                            <td>{ret.status}</td>
                            <td>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );



}

export default ReturnHandling;