import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null);

  // Fetch existing chats
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://elosystemv1.onrender.com/api/chat/allchats");
        if (Array.isArray(response.data)) {
          setChats(response.data); // Ensure data is an array
        } else {
          setError("Invalid data received from the server");
        }
      } catch (err) {
        setError("Failed to fetch chats. Please try again.");
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) {
    return <p>Loading chats...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chats</h1>
      <ul>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <li key={chat.chatId} style={{ margin: "10px 0" }}>
              <Link to={`/chat/${chat.chatId}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{chat.chatId}</span>
                  <span>
                    Participants:{" "}
                    {chat.usernames && chat.usernames.length > 0
                      ? chat.usernames.join(", ")
                      : "No participants"}
                  </span>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li>No chats available</li>
        )}
      </ul>
    </div>
  );
};

export default ChatList;
