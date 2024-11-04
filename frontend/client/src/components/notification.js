import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { getUsernameFromToken } from '../utils/auth';
import './styles/notification.css'; // Import CSS for styling

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false); // Toggle between all and unread notifications
  const username = getUsernameFromToken();

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
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
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

  // Toggle between showing all and only unread notifications
  const toggleShowAll = () => setShowAll(!showAll);

  // Filter notifications based on `showAll` state
  const displayedNotifications = showAll ? notifications : notifications.filter(notification => !notification.isRead);

  return (
    <div className="not-container">
      {error && <Alert variant="danger" className="not-alert">{error}</Alert>}

      <div className="not-header">
        <h2>{showAll ? 'All Notifications' : 'Unread Notifications'}</h2>
        <Button onClick={toggleShowAll} className="not-toggle-button">
          {showAll ? 'Show Unread Only' : 'View All Notifications'}
        </Button>
      </div>

      {displayedNotifications.length === 0 ? (
        <p className="not-empty-message">None found</p>
      ) : (
        displayedNotifications.map((notification) => (
          <div key={notification._id} className={`not-notification ${notification.isRead ? 'not-read' : 'not-unread'}`}>
            <p className="not-message">{notification.message}</p>
            <Button variant="secondary" onClick={() => markAsRead(notification._id)} className="not-read-button">
              Mark as Read
            </Button>
            <Button variant="danger" onClick={() => deleteNotification(notification._id)} className="not-delete-button">
              Delete
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
