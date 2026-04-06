import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>


const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});



