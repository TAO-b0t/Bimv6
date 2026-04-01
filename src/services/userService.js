// services/userService.js
import authService from "./authService";
import axiosInstance from "./axiosInstance";

const userService = {
    getUsersByCompany: async () => {
      const profile = await authService.getUserProfile();
      const company = profile.company_name;
      const response = await axiosInstance.get(`/user-company`, {
        params: { company_name: company },
      });
      return response.data.users || [];
    },
  
    getCurrentUser: async () => {
      return await authService.getUserProfile();
    },
  };
  
  

export default userService;
