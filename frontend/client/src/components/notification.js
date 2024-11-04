import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const username = 'kinyi';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/notifications/${username}`);
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to fetch notifications');
      }
    };
    fetchNotifications();
  }, [username]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/notifications/${id}/read`);
      setNotifications((prev) => prev.map((notification) => 
        notification._id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`https://elosystemv1.onrender.com/api/notifications/${id}`);
      setNotifications((prev) => prev.filter(notification => notification._id !== id));
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification._id} className={`notification ${notification.isRead ? 'read' : 'unread'}`}>
          <p>{notification.message}</p>
          <Button variant="secondary" onClick={() => markAsRead(notification._id)}>Mark as Read</Button>
          <Button variant="danger" onClick={() => deleteNotification(notification._id)}>Delete</Button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
