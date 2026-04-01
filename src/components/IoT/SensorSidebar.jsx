import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Gauge } from "lucide-react";
import sensorService from "../../services/sensorService";
import bgUpload from "../../assets/images/bg2.png";
import IoT from "../../assets/icons/iot-img.svg";
import exitIcon from "../../assets/icons/exit_svgrepo.com.svg";
import alarmIcon from "../../assets/icons/alarm.svg";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  if (valueAngle === null) return null;
  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path d={`M ${cx} ${cy} L ${target.x} ${target.y}`} stroke="red" strokeWidth={3} />
    </g>
  );
}

export default function SensorSidebar({ sensor, onClose }) {
  const [activeTab, setActiveTab] = useState("chart");
  const [timeRange, setTimeRange] = useState("1h");
  const [sensorGraphData, setSensorGraphData] = useState([]);
  const [liveValue, setLiveValue] = useState(null);
  const [maxThreshold, setMaxThreshold] = useState(sensor?.maxThreshold ?? 100);

  useEffect(() => {
    if (!sensor?.id) return;
    setActiveTab("chart");
    setMaxThreshold(sensor?.maxThreshold ?? 100);

    const fetchSensorData = async () => {
      try {
        const res = await sensorService.getSensorDataById(sensor.id);
        const processed = res.map((entry) => ({
          timestamp: entry.timestamp,
          value: extractNumberFromData(entry.data),
        }));
        setSensorGraphData(processed);
      } catch (err) {
        console.error("โหลดข้อมูลเซ็นเซอร์ไม่สำเร็จ:", err);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, [sensor?.id]);

  useEffect(() => {
    if (!sensor?.topic) return;
    const socket = new WebSocket(process.env.REACT_APP_WS_URL);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "subscribe", topics: [sensor.topic] }));
    };

    socket.onmessage = (event) => {
      const { topic, payload } = JSON.parse(event.data);
      if (topic === sensor.topic) {
        const value = extractNumberFromData(payload);
        if (typeof value === "number") setLiveValue(value);
      }
    };

    return () => socket.close();
  }, [sensor?.topic]);

  const extractNumberFromData = (obj) => {
    if (!obj) return null;
    for (const key in obj) {
      if (typeof obj[key] === "number") return obj[key];
    }
    return null;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "chart":
        const toThaiTime = (utcStr) => {
          const date = new Date(utcStr);
          return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        };
        const now = new Date();
        const rangeLimit = {
          "5m": now.getTime() - 5 * 60 * 1000,
          "1h": now.getTime() - 60 * 60 * 1000,
          "1d": now.getTime() - 24 * 60 * 60 * 1000,
        }[timeRange];
        const chartData = sensorGraphData
          .filter((entry) => new Date(entry.timestamp).getTime() >= rangeLimit)
          .map((d) => ({ ...d, timestamp: toThaiTime(d.timestamp) }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        return (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-center w-full">กราฟย้อนหลัง</h3>
              <select
                className="ml-2 px-2 py-1 rounded bg-[#1C2C2C] text-sm text-white"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="5m">5 นาทีล่าสุด</option>
                <option value="1h">1 ชั่วโมงล่าสุด</option>
                <option value="1d">1 วันล่าสุด</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C6FF" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#0072FF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" tick={{ fill: "#ccc", fontSize: 10 }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <Tooltip />
                <Area type="linear" dataKey="value" stroke="#00C6FF" fill="url(#colorValue)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </>
        );

      case "gauge":
        return (
          <div className="flex flex-col items-center justify-center w-full rounded-lg " 
          style={{
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.23) 0%, rgba(0, 98, 119, 0.23) 100%)",
            borderColor: "#343434",
            borderWidth: "1px"
          }}>
            <h3 className="text-base font-bold mb-2">เกจวัดค่า Real-time</h3>
            {liveValue !== null ? (
              <>
                <GaugeContainer
                  width={200}
                  height={200}
                  startAngle={-110}
                  endAngle={110}
                  value={liveValue}
                  valueMin={0}
                  valueMax={maxThreshold}
                >
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00FF00" />
                      <stop offset="50%" stopColor="#FFCC00" />
                      <stop offset="100%" stopColor="#FF3300" />
                    </linearGradient>
                  </defs>
                  <GaugeReferenceArc />
                  <GaugeValueArc style={{ fill: "url(#gaugeGradient)" }} />
                  <GaugePointer />
                </GaugeContainer>
                <div className="text-center">
                  <p className="text-sm text-gray-300">ค่าปัจจุบัน</p>
                  <p className="text-2xl font-bold text-yellow-400">{liveValue}</p>
                </div>
              </>
            ) : <p>ไม่มีข้อมูลล่าสุด</p>}
          </div>
        );

      case "settings":
        return (
          <>
            <h3 className="text-base font-bold mb-2">ตั้งค่าเซ็นเซอร์</h3>
            <label className="text-sm">Threshold สูงสุด</label>
            <input
              type="number"
              value={maxThreshold}
              onChange={(e) => setMaxThreshold(Number(e.target.value))}
              placeholder="เช่น 100"
              className="w-full px-3 py-2 rounded bg-[#1C2C2C] mb-3"
            />
            <label className="text-sm">ชื่อแสดงผล</label>
            <input type="text" defaultValue={sensor.sensorname} className="w-full px-3 py-2 rounded bg-[#1C2C2C]" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {sensor && (
        <motion.div
          key="sensor-sidebar"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 w-[400px] h-full text-white z-50 shadow-lg p-6 overflow-y-auto"
          style={{ backgroundImage: `url(${bgUpload})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="flex items-center gap-3 mb-4 p-2 rounded-lg shadow" style={{ background: "linear-gradient(180deg, #08191D 0%, #164550 50.5%, #08191D 100%)" }}>
            <div className="w-10 h-10 rounded-full p-1 bg-white shadow">
              <img src={IoT} alt="icon" className="w-full h-full rounded-full" />
            </div>
            <h2 className="text-base font-semibold text-white">
              รายละเอียดเซ็นเซอร์: {sensor.sensorname}
            </h2>
          </div>

          <div className="flex">
            <div className="flex flex-col items-center gap-4 mt-1">
              <IconTabVertical icon={<Activity size={20} />} active={activeTab === "chart"} onClick={() => setActiveTab("chart")} />
              <IconTabVertical icon={<Gauge size={20} />} active={activeTab === "gauge"} onClick={() => setActiveTab("gauge")} />
              <IconTabVertical icon={<img src={alarmIcon} alt="alarm" className="w-5 h-5" />} active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
            </div>
            <div className="flex-1 text-sm space-y-2">{renderTabContent()}</div>
          </div>

          <button
            onClick={onClose}
            className="absolute bottom-4 left-4 p-2 rounded-full bg-[#1C2C2C] hover:bg-red-600 transition"
            title="ปิด"
          >
            <img src={exitIcon} alt="close" className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconTabVertical({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition shadow ${active ? "bg-[#0B3F48] text-yellow-400 border-l-4 border-yellow-400" : "bg-[#1C2C2C] text-gray-400 hover:text-yellow-400 hover:border-l-4 hover:border-yellow-400"}`}
    >
      {icon}
    </button>
  );
}
