import axios from "axios";
import authService from "./authService";
// https://bimdatabase-d222f5398e1d.herokuapp.com
const API_BASE_URL = "https://explanatively-handed-jaylin.ngrok-free.dev/api"; // ปรับตามจริง
// const API_BASE_URL = "https://bimdatabase-d222f5398e1d.herokuapp.com/api"; // ปรับตามจริง

const projectService = {
  getProjectsByCompany: async () => {
    try {
      const user = await authService.getUserProfile();

      const response = await axios.post(`${API_BASE_URL}/getprojects`, {
        company_name: user.company_name,
      });

      return response.data || [];
    } catch (err) {
      console.error("Error fetching projects:", err);
      throw err;
    }
  },

createProject: async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_BASE_URL}/projects`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (err) {
      console.error("Error creating project:", err);
      throw err;
    }
  },

  getProjectById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/getProjectById/${id}`);
    return response.data;
  }
};
export default projectService;
