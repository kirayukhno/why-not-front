import axios from "axios";

export const getCurrentUser = async () => {
  const res = await axios.get("/api/users/current", {
    withCredentials: true,
  });
  return res.data;
};