// services/sensorService.js
import axiosInstance from './axiosInstance';

const sensorService = {
  getSensorsByModel: async ({ modelRef, projectName }) => {
    const response = await axiosInstance.post("/model-sensor", {
      model_ref: modelRef,
      project_name: projectName,
      
    });
    // console.log("🚀 Sensor response:", response.data);

    return response.data;
  },
  deleteSensor: async (id) => {
    return await axiosInstance.delete(`/model/${id}`);
  },
  updateSensor: async (id, data) => {
    const response = await axiosInstance.put(`/model/${id}`, data);
    return response.data;
  },
  getSensorDataById: async (id) => {
    try {
      const response = await axiosInstance.post(`/sensor-data/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ โหลดข้อมูลเซ็นเซอร์ไม่สำเร็จ:", error);
      throw new Error("ไม่สามารถโหลดข้อมูลเซ็นเซอร์ได้");
    }
  }
  
};

export default sensorService;
