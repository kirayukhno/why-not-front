import axios from "axios";

export const nextServer = axios.create({
  baseURL: typeof window !== 'undefined' 
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL, 
  withCredentials: true,
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
