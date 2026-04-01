import axios from "axios";
import axiosInstance from './axiosInstance';

const UploadModelService = {
    
}

UploadModelService.CheckBucket = (access_Token) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url: "https://developer.api.autodesk.com/oss/v2/buckets",
            headers: {
                "Authorization": `Bearer ${access_Token}`,
            },
        }).then(response => resolve(response)).catch(error => reject(error))
    })
}
UploadModelService.CreateBucket = (access_Token, bucket) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "POST",
            url: "https://developer.api.autodesk.com/oss/v2/buckets",
            data: { bucketKey: bucket, policyKey: "persistent" },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_Token}`,
            }
        }).then(response => resolve(response)).catch(error => reject(error))
    })
}
UploadModelService.UploadToOSS = (
    access_Token,
    bucketName,
    objectKey,
    file,
    onUploadProgress // ✅ เพิ่มเข้ามา
  ) => {
    return axios.put(
      `https://developer.api.autodesk.com/oss/v2/buckets/${bucketName}/objects/${objectKey}`,
      file,
      {
        headers: {
          Authorization: `Bearer ${access_Token}`,
          "Content-Type": "application/octet-stream",
        },
        onUploadProgress, // ✅ ใส่เข้าไปใน axios config
      }
    );
  };
  
  
UploadModelService.Translate = (access_Token, enurn) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "POST",
            url: "https://developer.api.autodesk.com/modelderivative/v2/designdata/job",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_Token}`,
                "x-ads-force": true,
            },
            data: {
                input: {
                    urn: enurn,
                },
                output: {
                    destination: {
                        region: "us",
                    },
                    formats: [
                        {
                            type: "svf2",
                            views: ["3d", "2d"],
                        },
                    ],
                },
            },
        }).then(response => resolve(response)).catch(error => reject(error))
    })
}
UploadModelService.ConvertMultipleFiles = ( urns) => {
    return axiosInstance.post(
      "/translation-status",
      { urns },
      {
        headers: {
          "Content-Type": "application/json", // ✅ ป้องกัน body หาย
        },
      }
    );
  };
  
UploadModelService.ConvertFile = (access_Token,urn) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "GET",
            url: `	https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`,
            headers: {
                Authorization: `Bearer ${access_Token}`,
            },
        }).then(response => resolve(response)).catch(error => reject(error))
    })
}
export default UploadModelService;