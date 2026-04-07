import axios, { AxiosError } from "axios";

export type APIError = AxiosError<{ error: string }>;

export const api = axios.create({
  baseURL: "https://relax-map-back.onrender.com/",
  withCredentials: true,
});