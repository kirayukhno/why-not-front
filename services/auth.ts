import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const getCurrentUser = async () => {
  const res = await axios.get(`${API_URL}/api/users/current`, {
    withCredentials: true,
  });
  return res.data;

};

