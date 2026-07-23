import { useState } from "react";
import { sendMessage } from "../../api/messageApi";
import { useChat } from "../../context/ChatContext";

export default function MessageInput() {
  const { selectedChat, messages, setMessages } = useChat();

  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      setSending(true);

      const newMessage = await sendMessage(
        selectedChat._id,
        content
      );

      setMessages((prev) => [...prev, newMessage]);

      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        padding: "15px",
        borderTop: "1px solid #ddd",
      }}
    >
      <input
        type="text"
        placeholder="Type a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          flex: 1,
          padding: "10px",
        }}
      />

      <button
        onClick={handleSend}
        disabled={sending}
      >
        {sending ? "..." : "Send"}
      </button>
    </div>
  );
}