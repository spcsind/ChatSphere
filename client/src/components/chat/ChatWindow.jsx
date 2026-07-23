import { useEffect, useState } from "react";
import { fetchMessages } from "../../api/messageApi";
import { useChat } from "../../context/ChatContext";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const {
    selectedChat,
    messages,
    setMessages,
  } = useChat();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedChat) return;

    const loadMessages = async () => {
      setLoading(true);

      try {
        const data = await fetchMessages(selectedChat._id);
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [selectedChat, setMessages]);

  if (!selectedChat) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h2>Welcome to ChatSphere 🚀</h2>
        <p>Select a chat to start messaging.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #ddd",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        {selectedChat.isGroupChat
          ? selectedChat.chatName
          : selectedChat.users.map((u) => u.username).join(", ")}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          background: "#fafafa",
        }}
      >
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              style={{
                display: "flex",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "10px 15px",
                  maxWidth: "60%",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: "#1976d2",
                  }}
                >
                  {message.sender.username}
                </div>

                <div>{message.content}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
}