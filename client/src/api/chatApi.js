import api from "./axios";

export const fetchChats = async () => {
  const { data } = await api.get("/chats");
  return data.chats; // 👈 return only the array
};

export const accessChat = async (userId) => {
  const { data } = await api.post("/chats", { userId });
  return data.chat;
};