import api from "./axios";

export const fetchMessages = async (chatId) => {
  const { data } = await api.get(`/messages/${chatId}`);
  return data.messages;
};

export const sendMessage = async (chatId, content) => {
  const { data } = await api.post("/messages", {
    chatId,
    content,
  });

  return data.message;
};