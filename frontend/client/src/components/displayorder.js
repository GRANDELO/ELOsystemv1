import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import { getUsernameFromToken } from '../utils/auth';
//import './styles/OrdersPage.css';

const OrdersPage = () => {
  const username = getUsernameFromToken();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/orders/user/${username}`);
        setOrders(response.data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchOrders();
    }
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.products.map((product) => (
                    <div key={product._id}>
                      {product.name} - Ksh {product.price} x {product.quantity}
                    </div>
                  ))}
                </td>
                <td>
                  {order.products.reduce((total, product) => total + product.quantity, 0)}
                </td>
                <td>Ksh {order.totalPrice.toFixed(2)}</td>
                <td>{order.isDelivered ? 'Delivered' : order.isDeliveryInProcess ? 'In Transit' : 'Pending'}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersPage;
