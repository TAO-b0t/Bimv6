import axiosInstance from "./axiosInstance";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://explanatively-handed-jaylin.ngrok-free.dev/api";

const documentService = {
  async createDocument(formData) {
    const response = await axiosInstance.post(`/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getDocuments(companyName) {
    const response = await axiosInstance.get(`/documents`, {
      params: { companyName },
    });
    return response.data;
  },

  async getDocumentById(id) {
    const response = await axiosInstance.get(`/documents/${id}`);
    return response.data;
  },

  async getDocumentContent(id) {
    const response = await axiosInstance.get(`/documents/${id}/content`);
    return response.data;
  },

  async updateDocument(id, payload) {
    const response = await axiosInstance.put(
      `/documents/${id}`,
      payload
    );
    return response.data;
  },

  async uploadNewVersion(id, formData) {
    const response = await axiosInstance.put(
      `/documents/${id}/file`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async getTemplates() {
    const response = await axiosInstance.get(`/document-templates`);
    return response.data;
  },

  async createTemplate(payload) {
    const response = await axiosInstance.post(
      `/document-templates`,
      payload
    );
    return response.data;
  },
};

export default documentService;