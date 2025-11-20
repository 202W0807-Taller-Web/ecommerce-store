import axios from "./axios";

export const updateUser = async (id: number, data: any) => {
  const response = await axios.put(`/usuarios/${id}`, data);
  return response.data;
};