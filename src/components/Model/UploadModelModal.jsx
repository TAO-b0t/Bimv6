import { useState } from "react";
import authService from "../../services/authService";
import modelService from "../../services/modelService";
import UploadModelService from "../../services/uploadModelService"; // ✅ ใหม่
import { v4 as uuidv4 } from "uuid";
import { FaCloudUploadAlt, FaTrashAlt, FaFileAlt } from "react-icons/fa";

export default function UploadModelModal({
  isOpen,
  onClose,
  onUploadSuccess,
  projectName,
  companyName,
}) {
  const [modelName, setModelName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    if (!modelName || !selectedFile) {
      alert("กรุณากรอกชื่อโมเดลและเลือกไฟล์");
      return;
    }
  
    try {
      setUploading(true);
  
      const profile = await authService.getUserProfile();
      const model_ref = uuidv4();
      const type_model = selectedFile.name.split(".").pop();
      const file = selectedFile;
  
      // ✅ 1. ดึง bucket name จาก backend
      const { bucketName } = await modelService.getBucketName();
      // console.log("🎯 Bucket name from backend:", bucketName);
  
      // ✅ 2. ขอ Autodesk Token
      const { token: access_Token } = await modelService.requestToken(profile.email);
      // console.log("🎯 Autodesk Token:", access_Token);
  
      // ✅ 3. เช็คว่า bucket มีอยู่แล้วหรือยัง
      const bucketCheck = await UploadModelService.CheckBucket(access_Token);
      const bucketExists = bucketCheck.data.items.some(
        (item) => item.bucketKey === bucketName
      );
  
      if (!bucketExists) {
        await UploadModelService.CreateBucket(access_Token, bucketName);
        // console.log("✅ Bucket created");
      } else {
        // console.log("📦 Bucket already exists");
      }
      // console.log("🚀 เริ่มอัปโหลดโมเดลไป Autodesk OSS"); // <== ใส่ตรงนี้

      // ✅ 4. อัปโหลดไฟล์ไป Autodesk OSS
      await UploadModelService.UploadToOSS(
        access_Token,
        bucketName,
        `${model_ref}.${type_model}`,
        file,
        (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(` Upload progress: ${percent}%`);
          setUploadProgress(percent);
        }
      );
  
      // ✅ 5. แปลงโมเดล
      const enurn = btoa(`urn:adsk.objects:os.object:${bucketName}/${model_ref}.${type_model}`);
      await UploadModelService.Translate(access_Token, enurn);
  
// ✅ แก้แล้ว
const metadata = {
  model_name: modelName,
  project_name: projectName,
  company_name: companyName,
  owner: profile.fullname,
  model_ref,
  type_model,
  urn: `urn:${enurn}`,
};

// console.log("📦 กำลังส่ง metadata:", metadata);
// await modelService.uploadModelMetadata(metadata);

      await modelService.uploadModelMetadata({
        model_name: modelName,
        project_name: projectName, // ✅ แก้ตรงนี้
        company_name: companyName,
        owner: profile.fullname,
        model_ref,
        type_model,
        urn: `urn:${enurn}`,
      });
      
      onUploadSuccess();
      // console.log("✅ Metadata uploaded successfully:", metadata);

    } catch (error) {
      console.error("Upload failed", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setUploading(false);
    }
  };
  
  

  const handleClose = () => {
    setModelName("");
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    else return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#091F23] p-6 rounded-xl w-full max-w-md">
        <div className="text-lg text-center font-bold mb-4 text-white">
          เพิ่มโมเดลในโครงการ
        </div>

        <input
          className="w-full mb-3 p-2 rounded bg-[#082E36] text-white"
          placeholder="ชื่อโมเดล"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />

        <label className="flex items-center justify-center gap-2 bg-green-700 text-white py-2 rounded-lg mb-4 cursor-pointer">
          <FaCloudUploadAlt />
          <span>อัพโหลดโมเดล</span>
          <input
            type="file"
            accept=".rvt,.ifc"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </label>

        {selectedFile && (
          <div className="text-white text-sm mb-4">
            <div className="flex items-center gap-2 mb-1">
              <FaFileAlt />
              <span>{selectedFile.name}</span>
              <button
                onClick={() => setSelectedFile(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <FaTrashAlt />
              </button>
            </div>
            <div className="text-gray-400 mb-2">
              {formatFileSize(selectedFile.size)} •{" "}
              {uploading ? "กำลังอัปโหลด..." : "พร้อมอัปโหลด"}
            </div>
            {uploading && (
              <div className="w-full bg-gray-600 rounded h-2 overflow-hidden">
                <div
                  className="bg-blue-400 h-2"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        <hr className="border-t border-gray-600 my-4" />

        <div className="flex justify-between">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded"
            onClick={handleClose}
            disabled={uploading}
          >
            ยกเลิก
          </button>

          <button
            className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "กำลังอัปโหลด..." : "อัปโหลดโมเดล"}
          </button>
        </div>
      </div>
    </div>
  );
}
