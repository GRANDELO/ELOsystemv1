import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]); // List of users to start a chat with
  const [selectedUser, setSelectedUser] = useState(""); // The user selected for a new chat

  // Fetch existing chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("https://elosystemv1.onrender.com/api/chat/allchats"); // Replace with your API endpoint
        // Ensure response data is an array before setting it
        setChats(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChats([]); // Set to empty array on error
      }
    };
    fetchChats();
  }, []);

  // Fetch users to start a chat with
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://elosystemv1.onrender.com/api/users/users"); // Replace with your API endpoint
        setUsers(Array.isArray(response.data) ? response.data : []); // Ensure response is an array
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // Set to empty array on error
      }
    };
    fetchUsers();
  }, []);

  // Function to create a new chat
  const startNewChat = async () => {
    if (!selectedUser) {
      alert("Please select a user to start a chat.");
      return;
    }

    try {
      const response = await axios.post("https://elosystemv1.onrender.com/api/chat/create", {
        usernames: ["YourUsername", selectedUser], // Replace "YourUsername" with the current user's username
      });
      setChats((prevChats) => [...prevChats, response.data]); // Add the new chat to the chat list
      setSelectedUser(""); // Clear the selected user
    } catch (error) {
      console.error("Error creating a new chat:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chats</h1>
      <ul>
        {/* Safeguard: Only map if chats is an array */}
        {Array.isArray(chats) && chats.length > 0 ? (
          chats.map((chat) => (
            <li key={chat._id} style={{ margin: "10px 0" }}>
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
                    {Array.isArray(chat.usernames)
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
