import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // For loading state
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
        alert(err);
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  // Fetch users to start a chat with
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://elosystemv1.onrender.com/api/users/users");
        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data); // Set the users if response is valid
        } else {
          console.error("Invalid response format for users:", response.data);
          setUsers([]); // Clear users if response is invalid
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // Clear users if there's an error
      }
    };
    fetchUsers();
  }, []);

  // Create a new chat
  const startNewChat = async () => {
    if (!selectedUser) {
      alert("Please select a user to start a chat.");
      return;
    }

    try {
      const response = await axios.post("https://elosystemv1.onrender.com/api/chat/create", {
        usernames: ["YourUsername", selectedUser], // Replace "YourUsername" with the logged-in user's username
      });
      if (response.data && response.data.chat) {
        setChats((prevChats) => [...prevChats, response.data.chat]); // Add the new chat to the list
      }
      setSelectedUser(""); // Reset the selected user
    } catch (error) {
      console.error("Error creating a new chat:", error);
      alert("Failed to create chat. Please try again.");
    }
  };

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

      <hr style={{ margin: "20px 0" }} />

      <h2>Start a New Chat</h2>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        style={{ padding: "10px", marginRight: "10px", width: "200px" }}
      >
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.username} value={user.username}>
            {user.username}
          </option>
        ))}
      </select>
      <button onClick={startNewChat} style={{ padding: "10px 20px" }}>
        Start Chat
      </button>
    </div>
  );
};

export default ChatList;
