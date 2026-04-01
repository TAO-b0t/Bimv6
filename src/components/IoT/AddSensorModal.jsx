import React, { useState, useEffect } from "react";
import { BiBroadcast } from "react-icons/bi";
import FiUploadCloud from "../../assets/images/Vector.svg";
import iotService from "../../services/iotService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const deviceOptionsMap = {
  "ไฟฟ้า": ["ESP32", "Modbus Power Meter", "Smart Plug"],
  "ท่อแก๊ส": ["MQ-2", "MQ-9", "WiFi Gas Sensor"],
  "สุขาภิบาล": ["Water Meter", "Ultrasonic Flow Sensor"],
  "สิ่งแวดล้อม": ["DHT11", "BME280", "PM2.5 Sensor", "Temperature Sensor"],
  "ความปลอดภัย": ["Vibration Sensor", "Motion Sensor", "Smoke Detector"],
  "ปรับอากาศ": ["IR Blaster", "Thermostat Module"]
};

export default function AddSensorModal({ isOpen, onClose }) {
  const { modelId } = useParams();
  const models = useSelector((state) => state.models.all);
  const modelInfo = models.find((m) => m.id.toString() === modelId);

  const [preview, setPreview] = useState(null);
  const [hasWarranty, setHasWarranty] = useState("");
  const [warrantyDate, setWarrantyDate] = useState("");
  const [topic, setTopic] = useState("");
  const [sensorName, setSensorName] = useState("");
  const [location, setlocation] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [sensorType, setSensorType] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [customSensorType, setCustomSensorType] = useState("");
  const [customDeviceType, setCustomDeviceType] = useState("");
  const [dbId, setDbId] = useState("");

  useEffect(() => {
    if (isOpen) {
      const storedDbId = localStorage.getItem("dbId");
      setDbId(storedDbId || "");
    }
  }, [isOpen]);
  const resetForm = () => {
    setPreview(null);
    setHasWarranty("");
    setWarrantyDate("");
    setTopic("");
    setSensorName("");
    setlocation("");
    setSelectedImageFile(null);
    setSensorType("");
    setDeviceType("");
    setCustomSensorType("");
    setCustomDeviceType("");
    setDbId("");
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  

  const handleSubmit = async () => {
    try {
      if (!modelInfo) {
        alert("❌ ไม่พบข้อมูลโมเดล");
        return;
      }

      const formData = new FormData();
      formData.append("dbid", dbId);
      formData.append("topic", topic);
      formData.append("sensorType", sensorType === "custom" ? customSensorType : sensorType);
      formData.append("sensorName", sensorName);
      formData.append("location", location);
      formData.append("deviceType", deviceType === "custom" ? customDeviceType : deviceType);
      formData.append("invoice_status", hasWarranty === "true");
      formData.append("invoice_date", warrantyDate || "");
      formData.append("modelRef", modelInfo.model_ref);
      formData.append("modelname", modelInfo.model_name);
      formData.append("projectName", modelInfo.project_name);

      if (selectedImageFile) {
        formData.append("sensor_img", selectedImageFile);
      }

      await iotService.createSensor(formData);
      alert(" ติดตั้งเซ็นเซอร์เรียบร้อยแล้ว");
      resetForm(); // ✅ ล้างค่า
      onClose();   // ✅ ปิด modal
      handleClose();
    } catch (err) {
      console.error("❌ ติดตั้งเซ็นเซอร์ไม่สำเร็จ:", err);
      alert("❌ เกิดข้อผิดพลาดในการติดตั้งเซ็นเซอร์");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-[#091F23] rounded-xl p-6 w-full max-w-lg relative text-white shadow-xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          &times;
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <BiBroadcast className="text-blue-400 text-2xl" />
          <h2 className="text-xl font-bold">หัวข้อเพิ่มเซ็นเซอร์ในโครงการ</h2>
        </div>

        <div className="bg-[#091F23] border border-dashed border-gray-500 p-6 rounded-lg mb-6 text-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-[200px] object-contain mx-auto mb-3"
            />
          ) : (
            <>
              <img
                src={FiUploadCloud}
                alt="Upload icon"
                className="w-10 h-10 mb-2 opacity-70 mx-auto"
              />
              <p className="mb-1 font-medium">ลาก รูปภาพ เพื่ออัปโหลด</p>
              <p className="text-sm text-gray-400 mb-3">
                รูปภาพของคุณจะเป็นส่วนช่วยให้เห็นรายละเอียดชัดเจนยิ่งขึ้น
              </p>
              <div className="text-center">
                <input
                  id="upload-img"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="upload-img"
                  className="bg-[#31515C] text-white px-4 py-2 rounded-lg cursor-pointer inline-block"
                >
                  เลือกไฟล์
                </label>
              </div>
            </>
          )}
        </div>

        {/* ฟอร์มทั้งหมด */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="DB id Sensor"
            className="input-style"
            value={dbId}
            onChange={(e) => setDbId(e.target.value)}
          />
          <input
            type="text"
            placeholder="TOPIC"
            className="input-style"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <input
            type="text"
            placeholder="กรอกชื่อเซ็นเซอร์"
            className="input-style"
            value={sensorName}
            onChange={(e) => setSensorName(e.target.value)}
          />
          <input
            type="text"
            placeholder="สถานที่ติดตั้ง"
            className="input-style"
            value={location}
            onChange={(e) => setlocation(e.target.value)}
          />

          {/* ประเภทเซ็นเซอร์ */}
          <select
            className="input-style"
            value={sensorType}
            onChange={(e) => {
              setSensorType(e.target.value);
              setDeviceType("");
              setCustomSensorType("");
              setCustomDeviceType("");
            }}
          >
            <option disabled value="">ประเภทเซ็นเซอร์</option>
            {Object.keys(deviceOptionsMap).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
            <option value="custom">อื่น ๆ (กรอกเอง)</option>
          </select>

          {sensorType === "custom" && (
            <>
              <input
                type="text"
                placeholder="กรอกประเภทเซ็นเซอร์เอง"
                className="input-style"
                value={customSensorType}
                onChange={(e) => setCustomSensorType(e.target.value)}
              />
              <input
                type="text"
                placeholder="กรอกประเภทอุปกรณ์เอง"
                className="input-style"
                value={customDeviceType}
                onChange={(e) => setCustomDeviceType(e.target.value)}
              />
            </>
          )}

          {sensorType !== "custom" && (
            <>
              <select
                className="input-style"
                value={deviceType}
                onChange={(e) => {
                  setDeviceType(e.target.value);
                  setCustomDeviceType("");
                }}
              >
                <option disabled value="">เลือกประเภทอุปกรณ์</option>
                {(deviceOptionsMap[sensorType] || []).map((device) => (
                  <option key={device} value={device}>{device}</option>
                ))}
                <option value="custom">อื่น ๆ (กรอกเอง)</option>
              </select>

              {deviceType === "custom" && (
                <input
                  type="text"
                  placeholder="กรอกประเภทอุปกรณ์เอง"
                  className="input-style"
                  value={customDeviceType}
                  onChange={(e) => setCustomDeviceType(e.target.value)}
                />
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <select
              className="input-style"
              value={hasWarranty}
              onChange={(e) => setHasWarranty(e.target.value)}
            >
              <option disabled value="">ประกันอุปกรณ์</option>
              <option value="true">มี</option>
              <option value="false">ไม่มี</option>
            </select>

            <input
              type="date"
              disabled={hasWarranty !== "true"}
              value={warrantyDate}
              onChange={(e) => setWarrantyDate(e.target.value)}
              className={`input-style ${hasWarranty !== "true" ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="สิ้นสุดประกัน"
            />
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handleClose}
            className="w-1/2 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            ติดตั้งเซ็นเซอร์
          </button>
        </div>
      </div>
    </div>
  );
}
