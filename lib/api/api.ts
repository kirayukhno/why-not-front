import axios from 'axios';


export const nextServer = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});




export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout')
};