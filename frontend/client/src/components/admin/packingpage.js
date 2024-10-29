import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';

const LogisticsPage = () => {
  const [unpackedOrders, setUnpackedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch unpacked orders with their products
  const fetchUnpackedOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://elosystemv1.onrender.com/api/order2/unpacked');
      setUnpackedOrders(response.data);
      console.log(response.data); // Data structure: [{ orderId, products }]
    } catch (err) {
      console.error('Failed to fetch unpacked orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch unpacked orders');
    } finally {
      setLoading(false);
    }
  };

  // Function to mark an order as packed
  const markOrderAsPacked = async (orderId) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/order2/${orderId}/packed`, {
        packed: true,
      });
      // Update UI after marking as packed
      setUnpackedOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId) // Remove packed order from the list
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status');
    }
  };

  // Fetch unpacked orders on component mount
  useEffect(() => {
    fetchUnpackedOrders();
  }, []);

  return (
    <div className="logistics-page">
      <h1>Unpacked Orders</h1>

      {loading && <p>Loading...</p>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && unpackedOrders.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {unpackedOrders.map((order) =>
              order.products.map((product) => {
                console.log(`Product Details:`, product); // Log each product

                return (
                  <tr key={`${order.orderId}-${product.name}`}>
                    <td>{order.orderId}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>
                      <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                    </td>
                    <td>{product.quantity}</td>
                    <td>
                      {product.price !== undefined ? (
                        `Ksh ${product.price.toFixed(2)}`
                      ) : (
                        'Price not available' // Default message if price is undefined
                      )}
                    </td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => markOrderAsPacked(order.orderId)}
                      >
                        Mark as Packed
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}

      {!loading && unpackedOrders.length === 0 && !error && <p>No unpacked items found.</p>}
    </div>
  );
};

export default LogisticsPage;
