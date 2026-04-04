import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const userService = {
  getCurrentUser: async () => {
    try {
      const res = await axios.get(`${API_URL}/users/current`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  getUserById: async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/users/${userId}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return null;
    }
  },

  getUserLocations: async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/users/${userId}/locations`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching locations:`, error);
      return { data: { data: [], totalItems: 0 } };
    }
  }
};