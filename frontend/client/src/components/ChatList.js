import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ChatList = () => {
  const [chats, setChats] = useState([]); // Initialize as an array
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("https://elosystemv1.onrender.com/api/chat/");
        if (Array.isArray(response.data)) {
          setChats(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
          setChats([]);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChats([]);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://elosystemv1.onrender.com/api/users/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const startNewChat = async () => {
    if (!selectedUser) {
      alert("Please select a user to start a chat.");
      return;
    }

    try {
      const response = await axios.post("https://elosystemv1.onrender.com/api/chat/create", {
        usernames: ["YourUsername", selectedUser],
      });
      setChats((prevChats) => (Array.isArray(prevChats) ? [...prevChats, response.data] : [response.data]));
      setSelectedUser("");
    } catch (error) {
      console.error("Error creating a new chat:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chats</h1>
      <ul>
        {chats.map((chat) => (
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
                <span>Participants: {chat.usernames.join(", ")}</span>
              </div>
            </Link>
          </li>
        ))}
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
