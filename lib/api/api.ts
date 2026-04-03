import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const nextServer = axios.create({
  baseURL,
  withCredentials: true, // важно для куки
  headers: {
    "Content-Type": "application/json",
  },
});