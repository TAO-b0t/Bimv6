import axiosInstance from "./axiosInstance"; // ใช้ axios ที่ตั้งค่า token แล้ว

const iotService = {
  createSensor: async (formData) => {
    try {
      const response = await axiosInstance.post("/model", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
};

export default iotService;

