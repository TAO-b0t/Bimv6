import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import bgUpload from "../../assets/images/bg2.png";
import AddSensorModal from "./AddSensorModal";
import sensorService from "../../services/sensorService";
import electricIcon from "../../assets/icons/energy.svg";
import gasIcon from "../../assets/icons/gas.svg";
import waterIcon from "../../assets/icons/water.svg";
import environmentIcon from "../../assets/icons/envi.svg";
import safetyIcon from "../../assets/icons/alert.svg";
import acIcon from "../../assets/icons/ventilation.svg";
import IoT from "../../assets/icons/iot-img.svg";
import SettingsModal from "./SettingsModal";
import settingIcon from "../../assets/icons/setting.svg";

export default function IoTSensorFooter({ setSelectedSensor: setParentSelectedSensor }) {
    const { modelId } = useParams();
    const models = useSelector((state) => state.models.all);
    const modelInfo = models.find((m) => m.id.toString() === modelId);

    const [showModal, setShowModal] = useState(false);
    const [sensorData, setSensorData] = useState([]);
    const [sensorValues, setSensorValues] = useState({}); // ✅ ข้อมูลจาก WebSocket
    const [selectedType, setSelectedType] = useState("ภาพรวมเซ็นเซอร์อาคาร");
    const socketRef = useRef(null);
    const [showSettingModal, setShowSettingModal] = useState(false);

    const iconMap = {
        "ไฟฟ้า": electricIcon,
        "ท่อแก๊ส": gasIcon,
        "สุขาภิบาล": waterIcon,
        "สิ่งแวดล้อม": environmentIcon,
        "ความปลอดภัย": safetyIcon,
        "ปรับอากาศ": acIcon
    };
    const deviceUnitMap = {
        "ESP32": "",
        "Modbus Power Meter": "kWh",
        "Smart Plug": "kWh",
        "MQ-2": "PPM",
        "MQ-9": "PPM",
        "WiFi Gas Sensor": "PPM",
        "Water Meter": "m³",
        "Ultrasonic Flow Sensor": "L/min",
        "DHT11": "°C",
        "BME280": "°C",
        "PM2.5 Sensor": "µg/m³",
        "Temperature Sensor": "°C",
        "Vibration Sensor": "mm/s", // ตัวอย่างหน่วย
        "Motion Sensor": "",        // ใช้ Detected/Not Detected
        "Smoke Detector": "PPM",
        "IR Blaster": "",
        "Thermostat Module": "°C"
    };

    // ✅ ดึงข้อมูล sensor
    useEffect(() => {
        const fetchSensors = async () => {
            if (modelInfo) {
                try {
                    const sensors = await sensorService.getSensorsByModel({
                        modelRef: modelInfo.model_ref,
                        projectName: modelInfo.project_name,
                    });
                    setSensorData(sensors);
                } catch (err) {
                    console.error("❌ ดึงข้อมูลเซ็นเซอร์ไม่สำเร็จ:", err);
                }
            }
        };

        fetchSensors();
    }, [modelInfo]);
    useEffect(() => {
        setParentSelectedSensor(null); // ✅ ปิด sidebar เมื่อเปลี่ยนประเภท
    }, [selectedType]);
    
    // ✅ เปิด WebSocket และ subscribe
    useEffect(() => {
        if (sensorData.length === 0) return;
        // console.log("🌐 Connecting to WebSocket:", process.env.REACT_APP_WS_URL);

        socketRef.current = new WebSocket(process.env.REACT_APP_WS_URL);

        socketRef.current.onopen = () => {
            const topics = sensorData.map(s => s.topic).filter(Boolean);
            socketRef.current.send(JSON.stringify({
                type: "subscribe",
                topics: topics
            }));
            // console.log("✅ Subscribed to topics:", topics);
        };

        socketRef.current.onmessage = (e) => {
            const { topic, payload } = JSON.parse(e.data);
            setSensorValues(prev => ({
                ...prev,
                [topic]: payload
            }));
        };

        return () => {
            socketRef.current?.close();
        };
    }, [sensorData]);

    // ✅ แยกประเภท sensor
    const sensorTypes = [
        "ภาพรวมเซ็นเซอร์อาคาร",
        ...Array.from(new Set(sensorData.map((s) => s.sensortype).filter(Boolean)))
    ];
    const extractFirstNumber = (obj) => {
        if (!obj || typeof obj !== "object") return "-";
        for (const key in obj) {
            const val = obj[key];
            if (typeof val === "number") return val.toFixed(2);
        }
        return "-";
    };

    const filteredSensors = selectedType === "ภาพรวมเซ็นเซอร์อาคาร"
        ? sensorData
        : sensorData.filter((sensor) => sensor.sensortype === selectedType);

    return (

        <div className="w-full h-full px-6 py-4 overflow-y-auto bg-cover bg-center"
            style={{ backgroundImage: `url(${bgUpload})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>

            {/* ส่วน header */}
            <div className="flex justify-between mb-4">
                <div className="text-black">
                    <label className="text-white font-semibold mr-2">ประเภทเซ็นเซอร์</label>

                    <select
                        className="px-4 py-2 rounded text-white text-sm bg-[#082E36]"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        {sensorTypes.map((type, idx) => (
                            <option key={idx} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                    + Add New Sensors
                </button>

            </div>
            <div className="h-[1px]  w-full mb-1.5  bg-[#0B3F48]" />
            {selectedType !== "ภาพรวมเซ็นเซอร์อาคาร" && (
                <div className="relative">
                    <button
                        onClick={() => setShowSettingModal(true)}
                        className="absolute top-0 right-0 m-2"
                        title="ตั้งค่า"
                    >
                        <img
                            src={settingIcon}
                            alt="setting"
                            className="w-6 h-6 hover:opacity-80 transition"
                        />
                    </button>
                </div>
            )}



            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white">

                {filteredSensors.length === 0 ? (
                    <p className="col-span-full text-center text-gray-400">ไม่มีข้อมูลเซ็นเซอร์</p>
                ) : (
                    filteredSensors.map((sensor, idx) => {
                        const realtime = sensorValues[sensor.topic];
                        const isActive = !!realtime;

                            return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    if (selectedType !== "ภาพรวมเซ็นเซอร์อาคาร") {
                                      setParentSelectedSensor(sensor); // ✅ ส่งให้ ViewerPage
                                    }
                                  }}
                                  
                                  
                                  className={`p-4 rounded-lg border text-white transition duration-300 ${
                                    selectedType !== "ภาพรวมเซ็นเซอร์อาคาร" ? "cursor-pointer hover:shadow-lg" : "cursor-default"
                                  }`}
                                  style={{
                                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.23) 0%, rgba(0, 98, 119, 0.23) 100%)",
                                    borderColor: "#343434",
                                    borderWidth: "1px"
                                  }}
                                >
                              
                                <p className="text-sm text-gray-300 text-right"
                                    style={{ textShadow: "0 0 5px rgba(255, 255, 255, 0.5)" }}>
                                    สถานะ:{" "}
                                    <span className={isActive ? "text-green-400" : "text-red-400"}>
                                        {isActive ? "กำลังทำงาน" : "ไม่ทำงาน"}
                                    </span>
                                </p>

                                {/* ✅ แก้ layout เป็นแนวนอน */}
                                <div className="flex items-center gap-4 mt-2">
                                    {/* ไอคอนอยู่ซ้าย ตรงกลาง */}
                                    <img
                                        src={iconMap[sensor.sensortype] || IoT}
                                        alt={sensor.system}
                                        className="w-16 h-16 rounded-lg "
                                    />

                                    {/* ข้อความเรียงกันแนวตั้งด้านขวา */}
                                    <div>
                                        <p
                                            className="text-base font-semibold text-white"
                                            style={{ textShadow: "0 0 5px rgba(255, 255, 255, 0.6)" }}
                                        >
                                            ชื่อ {sensor.sensorname}
                                        </p>
                                        <p
                                            className="text-2xl font-bold text-white-300"
                                            style={{ textShadow: "0 0 5px rgba(255, 255, 255, 0.6)" }}
                                        >
                                            {isActive
                                                ? `${extractFirstNumber(realtime)} ${deviceUnitMap[sensor.devicetype] || ''}`
                                                : ""
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* หมวดหมู่ชิดขวา ด้านล่าง */}
                                <p className="text-sm text-gray-300 mt-2 text-right">หมวดหมู่: {sensor.sensortype}</p>
                            </div>


                        );
                    })
                )}
            </div>
          

            <SettingsModal
                isOpen={showSettingModal}
                onClose={() => setShowSettingModal(false)}
                selectedType={selectedType}
                sensors={filteredSensors}
                onDelete={(id) => {
                    setSensorData(prev => prev.filter(sensor => sensor.id !== id));
                }}
                onUpdate={(updatedSensor) => {
                    setSensorData(prev =>
                        prev.map(sensor =>
                            sensor.id === updatedSensor.id ? updatedSensor : sensor
                        )
                    );
                }}
            />


            <AddSensorModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}