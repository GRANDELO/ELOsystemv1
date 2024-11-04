import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa'; // Import bell icon from react-icons

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [error, setError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const username = 'kinyi';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/notifications/${username}`);
        setNotifications(response.data);
        setUnreadNotifications(response.data.filter(notification => !notification.isRead));
      } catch (err) {
        setError('Failed to fetch notifications');
      }
    };
    fetchNotifications();
  }, [username]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`https://elosystemv1.onrender.com/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadNotifications((prev) => prev.filter(notification => notification._id !== id));
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`https://elosystemv1.onrender.com/api/notifications/${id}`);
      setNotifications((prev) => prev.filter(notification => notification._id !== id));
      setUnreadNotifications((prev) => prev.filter(notification => notification._id !== id));
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Notification Button with Icon and Count */}
      <Button variant="primary" onClick={toggleNotifications}>
        <FaBell /> <Badge bg="secondary">{unreadNotifications.length}</Badge>
      </Button>

      {/* Conditionally Render Notifications */}
      {showNotifications && (
        <div className="notification-list">
          <h2>Unread Notifications</h2>
          {unreadNotifications.length === 0 ? (
            <p>No unread notifications.</p>
          ) : (
            unreadNotifications.map((notification) => (
              <div key={notification._id} className="notification unread">
                <p>{notification.message}</p>
                <Button variant="secondary" onClick={() => markAsRead(notification._id)}>Mark as Read</Button>
                <Button variant="danger" onClick={() => deleteNotification(notification._id)}>Delete</Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
