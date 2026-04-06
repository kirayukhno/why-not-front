import { nextServer } from "./api";
import { User } from "@/types/types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
//console.log("API_URL:", API_URL);  

export const getCurrentUser = async (): Promise<User | null> => {
  const res = await nextServer.get(`${API_URL}/api/users/current`, {
    withCredentials: true,
  });
  //console.log("getCurrentUser response:", res);
  return res.data;

};