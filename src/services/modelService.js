import axiosInstance from './axiosInstance';
import authService from "./authService";
import axios from "axios";
import { data } from 'react-router-dom';

/** ดึง URN, token และโหลด viewer */
const getUrnAndTokenAndInitViewer = async (modelId, setUrn, setToken, viewerDiv, onDocLoadSuccess, onDocLoadFailure) => {
    try {
      const model = await modelService.getUrn(modelId);
      const cleanUrn = model.urn.replace("urn:", "");
      setUrn(cleanUrn);
  
      const profile = await authService.getUserProfile();
      const email = profile.email;
  
      const response = await axiosInstance.post("/auth/request-token", {
        email,
      });
      
  
      const forgeToken = response.data.token;
      setToken(forgeToken);
  
      const options = {
        env: "AutodeskProduction2",
        api: "derivativeV2",
        getAccessToken: (onTokenReady) => {
          onTokenReady(forgeToken, 3600);
        },
      };
  
      Autodesk.Viewing.Initializer(options, () => {
        Autodesk.Viewing.Document.load(`urn:${cleanUrn}`, onDocLoadSuccess, onDocLoadFailure);
      });
    } catch (err) {
      console.error("❌ Autodesk viewer initialization failed:", err);
      throw err;
    }
  };
  
const modelService = {
    uploadModel: async (formData, config = {}) => {
        const response = await axiosInstance.post("/models", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          ...config, // << รวม config เช่น onUploadProgress
        });
        return response.data;
      },
      
    
  getModelsByProject: async (projectName, companyName) => {
    const response = await axiosInstance.post(`/getModelsByProjectId`, {
      project_name: projectName,
      company_name: companyName,
      
    });
    // console.log("📦 Sending to getModelsByProject", projectName, companyName);

    return response.data;
    
  },
  
  uploadModelMetadata: (metadata) => {
    return axiosInstance.post("/models/metadata", metadata);
  },
  
  getUrn: async (modelId) => {
    const response = await axiosInstance.get(`/models/urn/${modelId}`);
    return response.data;
  },
  getBucketName: async () => {
    const response = await axiosInstance.get("/bucketName");
    // console.log("📦 Sending to getBucketName "+ response.data );

    return response.data; // สมมุติ backend ส่ง { bucketName: 'ชื่อ...' }

  },
  requestToken: async (email) => {
    try {
      const response = await axiosInstance.post("/auth/request-token", { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
    // 🔹 Delete model (ถ้ามี endpoint)
    deleteModel: async (modelId) => {
        const response = await axiosInstance.delete(`/models/${modelId}`);
        return response.data;
      },
      getUrnAndTokenAndInitViewer, // ⬅️ export ใหม่


    // ✅ ดึงรายการโมเดลที่ติดดาวของ user
    getFavoriteModels: async (txid) => {
      try {
        const res = await axiosInstance.post("/getModelfavorites", { txid });
    //  console.log("📦 Sending to getFavoriteModels", res.data);
        return res.data; // เป็น array ของ model_id
      } catch (error) {
        console.error("❌ Error fetching favorites:", error);
        return [];
      }
    },
  
    // ✅ เพิ่มหรือลบ favorite
    toggleFavoriteModel: async (txid, modelId, currentFavorites = []) => {
      try {
        if (currentFavorites.includes(modelId)) {
          await axiosInstance.post("/deleteModelfavorites", {
            txid, model_id: modelId
          });
        } else {
          await axiosInstance.post("/addModelfavorites", {
            txid,
            model_id: modelId,
          });
        }
  
        // ดึงรายการ favorite ใหม่
        return await modelService.getFavoriteModels(txid);
      } catch (err) {
        console.error("❌ Error toggling favorite:", err);
        return currentFavorites;
      }
    },
  };

export default modelService;
