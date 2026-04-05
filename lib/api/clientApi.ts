import { nextServer } from './api'; 

export const clientUserService = {
  getCurrentUser: async () => {
    try {
      const res = await nextServer.get("/users/current");
      return res.data;
    } catch (error) {
      console.error("Client API Error (getCurrentUser):", error);
      return null;
    }
  },


  getUserById: async (userId: string) => {
    try {
      const res = await nextServer.get(`/users/${userId}`);
      return res.data;
    } catch (error) {
      console.error(`Client API Error (getUserById ${userId}):`, error);
      return null;
    }
  },


  getUserLocations: async (userId: string) => {
    try {
      const res = await nextServer.get(`/users/${userId}/locations`);
      return res.data;
    } catch (error) {
      console.error(`Client API Error (getUserLocations):`, error);
      return { data: { data: [], totalItems: 0 } };
    }
  },
};


