import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChatDetails = () => {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chats/${chatId}`); // Replace with your API endpoint
        setChat(response.data);
      } catch (error) {
        console.error("Error fetching chat details:", error);
      }
    };
    fetchChatDetails();
  }, [chatId]);

  const sendMessage = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/chats/send", {
        chatId,
        senderUsername: "YourUsername", // Replace with the actual username
        message: newMessage,
      });

      setChat(response.data.chat); // Update the chat data after sending a message
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!chat) {
    return <div>Loading chat...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat: {chat.chatId}</h1>
      <h2>Participants: {chat.usernames.join(", ")}</h2>

      <div style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        height: "300px",
        overflowY: "scroll",
        marginBottom: "20px"
      }}>
        {chat.messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              backgroundColor: msg.senderUsername === "YourUsername" ? "#e0f7fa" : "#fce4ec",
              padding: "10px",
              borderRadius: "5px",
              margin: "10px 0",
            }}
          >
            <p><strong>{msg.senderUsername}:</strong> {msg.message}</p>
            <p style={{ fontSize: "12px", color: "#999" }}>
              Delivered: {msg.isDelivered ? "Yes" : "No"} | Read: {msg.isRead ? "Yes" : "No"}
            </p>
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            width: "calc(100% - 100px)",
            padding: "10px",
            marginRight: "10px",
          }}
        />
        <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatDetails;
