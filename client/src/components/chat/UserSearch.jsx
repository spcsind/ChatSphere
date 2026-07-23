import { useState } from "react";
import { searchUsers } from "../../api/userApi";
import { accessChat } from "../../api/chatApi";
import { useChat } from "../../context/ChatContext";

export default function UserSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const { chats, setChats, setSelectedChat } = useChat();

  const handleSearch = async (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      const users = await searchUsers(value);
      setResults(users);
    } catch (err) {
      console.error(err);
    }
  };

  const startChat = async (userId) => {
    try {
      const chat = await accessChat(userId);

      const exists = chats.find((c) => c._id === chat._id);

      if (!exists) {
        //we updated this
        setChats((prevChats) => {
  const exists = prevChats.find((c) => c._id === chat._id);

  if (exists) return prevChats;

  return [chat, ...prevChats];
});
      }

      setSelectedChat(chat);
      setResults([]);
      setSearch("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "15px" }}>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearch}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      {results.map((user) => (
        <div
          key={user._id}
          onClick={() => startChat(user._id)}
          style={{
            padding: "10px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
}