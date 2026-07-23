import api from "./axios";

export const searchUsers = async (search) => {
  const { data } = await api.get(`/users?search=${search}`);
  return data.users;
};