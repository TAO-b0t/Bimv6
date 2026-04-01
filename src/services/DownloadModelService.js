import axios from 'axios';

const DownloadModelService = {}

DownloadModelService.GetDetail = (objectKey, bucket, access_Token) => {
    const url = `https://developer.api.autodesk.com/oss/v2/buckets/${bucket}/objects/${objectKey}/details`;
    console.log("Requesting URL:", url);
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: url,
            headers: {
                Authorization: `Bearer ${access_Token}`,
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log("GetDetail Response:", response.data);
            resolve(response);
        }).catch(error => {
            console.error("Error response:", error.response);
            console.error("Error message:", error.message);
            reject(error);
        });
    });
}

DownloadModelService.GetLink = (bucketKey, objectKey, access_Token) => {
    const url = `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${objectKey}/signed`;
    console.log("Requesting URL:", url);
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: url,
            headers: {
                Authorization: `Bearer ${access_Token}`,
                'Content-Type': 'application/json;charset=UTF-8',
            },
            data: '{}',
        }).then(response => {
            console.log("GetLink Response:", response.data);
            resolve(response);
        }).catch(error => {
            console.error("Error response:", error.response);
            console.error("Error message:", error.message);
            reject(error);
        });
    });
}

export default DownloadModelService;
