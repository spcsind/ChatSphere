import { useEffect, useState } from "react";
import { fetchChats } from "../../api/chatApi";
import { useChat } from "../../context/ChatContext";
import UserSearch from "./UserSearch";

export default function ChatList() {
  const {
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
  } = useChat();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchChats();
        setChats(data);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [setChats]);

  if (loading) {
    return (
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ddd",
          padding: "20px",
        }}
      >
        Loading chats...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "30%",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <h2
        style={{
          padding: "20px",
          margin: 0,
          borderBottom: "1px solid #ddd",
        }}
      >
        Chats
      </h2>

      {/* Search Users */}
      <UserSearch />

      {/* No Chats */}
      {chats.length === 0 && (
        <p style={{ padding: "20px" }}>
          No chats yet.
        </p>
      )}

      {/* Chat List */}
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedChat(chat)}
          style={{
            padding: "15px 20px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
            backgroundColor:
              selectedChat?._id === chat._id
                ? "#1976d2"
                : "#fff",
            color:
              selectedChat?._id === chat._id
                ? "#fff"
                : "#000",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
            }}
          >
            {chat.isGroupChat
              ? chat.chatName
              : chat.users.map((u) => u.username).join(", ")}
          </div>

          {chat.latestMessage && (
            <div
              style={{
                fontSize: "12px",
                marginTop: "5px",
                color:
                  selectedChat?._id === chat._id
                    ? "#ddd"
                    : "#666",
              }}
            >
              <strong>
                {chat.latestMessage.sender.username}:
              </strong>{" "}
              {chat.latestMessage.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}