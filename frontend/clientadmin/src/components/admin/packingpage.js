import axiosInstance from '../axiosInstance';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Header from './header';
import Setting from './settings';
import './styles/packdev.css';

const LogisticsPage = () => {
  const [unpackedOrders, setUnpackedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admnLogout');
  };

  const fetchUnpackedOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/order2/unpacked');
      setUnpackedOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch unpacked orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch unpacked orders');
    } finally {
      setLoading(false);
    }
  };

  const markOrderAsPacked = async (orderId) => {
    try {
      await axiosInstance.patch(`/order2/${orderId}/packed`, { packed: true });
      setUnpackedOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status');
    }
  };

  useEffect(() => {
    fetchUnpackedOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        unpackedOrders.forEach((order) => {
          order.products.forEach((product) => {
            if (product.image && Array.isArray(product.image) && product.image.length > 0) {
              const productKey = `${order.orderId}-${product.name}`;
              newIndexes[productKey] = ((newIndexes[productKey] || 0) + 1) % product.image.length;
            }
          });
        });
        return newIndexes;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [unpackedOrders]);

  return (
    <div className="logpg-container">
      <Header/>
      <Setting />
      <h1 className="logpg-title">Unpacked Orders</h1>

      {loading && <p className="logpg-loading">Loading...</p>}
      {error && <Alert variant="danger" className="logpg-error">{error}</Alert>}

      {!loading && unpackedOrders.length > 0 && (
        <Table striped bordered hover className="logpg-table">
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
                const productKey = `${order.orderId}-${product.name}`;
                const currentIndex = currentImageIndexes[productKey] || 0;

                return (
                  <tr key={productKey}>
                    <td>{order.orderId}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>
                      <div className="logpg-product-images">
                        {product.image && Array.isArray(product.image) && product.image.length > 0 ? (
                          <img
                            src={product.image[currentIndex]}
                            alt={`product-image-${currentIndex}`}
                            className="logpg-product-image"
                            style={{ width: '50px', height: '50px' }}
                          />
                        ) : (
                          <p>No images available for this product.</p>
                        )}
                      </div>
                    </td>
                    <td>{product.quantity}</td>
                    <td>{product.price !== undefined ? `Ksh ${product.price.toFixed(2)}` : 'Price not available'}</td>
                    <td>
                      <Button variant="success" className="logpg-action-button" onClick={() => markOrderAsPacked(order.orderId)}>
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

      {!loading && unpackedOrders.length === 0 && !error && <p className="logpg-no-orders">No unpacked items found.</p>}

      <Footer/>
    </div>
  );
};

export default LogisticsPage;
