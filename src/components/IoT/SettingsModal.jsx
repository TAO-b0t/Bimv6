import React, { useState, useEffect, useRef } from 'react';
import sensorService from "../../services/sensorService";

export default function SettingsModal({ isOpen, onClose, selectedType, sensors, onDelete, onUpdate }) {
    const [searchText, setSearchText] = useState("");
    const filtered = sensors.filter((sensor) =>
        sensor.sensorname?.toLowerCase().includes(searchText.toLowerCase())
    );
    const [editingSensor, setEditingSensor] = useState(null);
    const [editForm, setEditForm] = useState({});
    const handleEditClick = (sensor) => {
        console.log("Edit clicked for sensor:", sensor);
        setEditingSensor(sensor);
        setEditForm({ ...sensor }); // เตรียมข้อมูลสำหรับแก้ไข
    };


    const handleDelete = async (id) => {
        try {
            const confirm = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการถอนการติดตั้งอุปกรณ์นี้?");
            if (!confirm) return;

            await sensorService.deleteSensor(id);
            alert("ลบอุปกรณ์เรียบร้อยแล้ว");

            // ลบออกจาก UI โดยไม่โหลดใหม่ (กรองออกจาก sensors)
            onDelete(id);
        } catch (error) {
            console.error("❌ ลบไม่สำเร็จ:", error);
            alert("เกิดข้อผิดพลาดขณะลบอุปกรณ์");
        }
    };
    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-start z-50">
            <div className="bg-[#0C2428] w-[80%] h-[80%] absolute top-[42px] left-[166px] rounded-[8px] pt-6 pr-[22px] pb-6 pl-[22px] shadow-lg overflow-auto">
                <h2 className="text-white text-xl font-bold text-center flex-1">
                    รายชื่ออุปกรณ์ IOT
                </h2>
                <div className="flex items-center justify-between mb-4">

                    <p className="text-white text-sm md:text-base bg-[#071416] rounded-[6px] px-3 py-1 inline-block">
                        รายชื่ออุปกรณ์ IOT {selectedType} ทั้งหมด
                    </p>

                    <div className="relative">
                        {/* ไอคอนแว่นขยาย */}
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="ค้นหาเซ็นเซอร์"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="pl-9 pr-3 py-1 text-sm rounded bg-[#12333A] text-white placeholder-gray-400 border border-gray-600 focus:outline-none"
                            style={{ minWidth: "200px" }}
                        />
                    </div>
                </div>
                <table className="w-full text-white text-sm bg-[#0F2B33] rounded-lg">
                    <thead>
                        <tr className="border-b border-gray-600 bg-[#20424E] rounded-[10px]">
                            <th className="text-left py-2">รหัสอุปกรณ์</th>
                            <th className="text-left py-2">รูปภาพอุปกรณ์</th>
                            <th className="text-left py-2">ชื่ออุปกรณ์</th>
                            <th className="text-left py-2">ใบประกัน</th>
                            <th className="text-left py-2">สิ้นสุดประกัน</th>
                            <th className="text-left py-2">วันลงทะเบียน</th>
                            <th className="text-left py-2">ตัวเลือก</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sensors.length > 0 ? (
                            filtered.map((sensor, index) => (
                                <tr key={index} className="border-b border-gray-700 ">
                                    <td className="py-2">{'DB' + sensor.dbid}</td>
                                    <td>
                                        {sensor.sensor_img && (
                                            <img
                                                src={`data:image/png;base64,${sensor.sensor_img}`}
                                                alt="sensor"
                                                className="w-8 h-8 object-cover rounded"
                                            />
                                        )}
                                    </td>
                                    <td>{sensor.sensorname}</td>
                                    <td className={sensor.invoice_status ? "text-green-500" : "text-red-400"}>
                                        {sensor.invoice_status ? "มีการรับประกัน" : "ไม่มีการรับประกัน"}
                                    </td>
                                    <td>{sensor.invoice_date ? new Date(sensor.invoice_date).toLocaleDateString("th-TH") : "-"}</td>
                                    <td>{sensor.created_at ? new Date(sensor.created_at).toLocaleDateString("th-TH") : "-"}</td>

                                    <td>
                                        <button
                                            onClick={() => handleEditClick(sensor)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-xs px-3 py-1 rounded mr-2"
                                        >
                                            แก้ไขข้อมูล
                                        </button>
                                        {editingSensor && (
                                            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                                <div className="bg-[#12333A] p-6 rounded-lg w-[90%] md:w-[600px] text-white">
                                                    <h3 className="text-lg font-bold mb-4">แก้ไขข้อมูลอุปกรณ์</h3>
                                                    {/* รูปภาพ sensor */}
                                                    <div className="mb-4">
                                                        <label className="block mb-1">รูปภาพอุปกรณ์:</label>

                                                        {editForm.sensor_img ? (
                                                            <img
                                                                src={`data:image/png;base64,${editForm.sensor_img}`}
                                                                alt="Sensor Preview"
                                                                className="w-24 h-24 object-cover rounded mb-2"
                                                            />
                                                        ) : (
                                                            <p className="text-sm text-gray-400 mb-2">ยังไม่มีรูปภาพ</p>
                                                        )}

                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        const base64 = reader.result.split(",")[1];
                                                                        setEditForm((prev) => ({ ...prev, sensor_img: base64 }));
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                            className="block w-full text-sm text-white
      file:mr-4 file:py-2 file:px-4
      file:rounded file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-700
      hover:file:bg-blue-100
      bg-[#1A3A42] p-2 rounded"
                                                        />
                                                    </div>
                                                    {/* ฟิลด์ทั้งหมด */}
                                                    {[
                                                        { label: "ชื่ออุปกรณ์", key: "sensorname" },
                                                        { label: "ประเภทเซ็นเซอร์", key: "sensortype" },
                                                        { label: "ระบบ", key: "system" },
                                                        { label: "Location", key: "location" },
                                                        { label: "Device Type", key: "devicetype" },
                                                        { label: "Topic", key: "topic" },
                                                        { label: "Model Name", key: "modelname" },
                                                        { label: "Project Name", key: "project_name" },
                                                    ].map(({ label, key }) => (
                                                        <div key={key} className="mb-2">
                                                            <label>{label}:</label>
                                                            <input
                                                                className="w-full p-2 rounded bg-[#1A3A42]"
                                                                value={editForm[key] || ""}
                                                                onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                                                            />
                                                        </div>
                                                    ))}

                                                    {/* ใบรับประกัน */}
                                                    <div className="mb-2">
                                                        <label>ใบรับประกัน:</label>
                                                        <select
                                                            className="w-full p-2 rounded bg-[#1A3A42]"
                                                            value={editForm.invoice_status ? "true" : "false"}
                                                            onChange={(e) => setEditForm({ ...editForm, invoice_status: e.target.value === "true" })}
                                                        >
                                                            <option value="true">มีการรับประกัน</option>
                                                            <option value="false">ไม่มีการรับประกัน</option>
                                                        </select>
                                                    </div>

                                                    {/* วันที่สิ้นสุดประกัน */}
                                                    <div className="mb-2">
                                                        <label>วันสิ้นสุดประกัน:</label>
                                                        <input
                                                            type="date"
                                                            className="w-full p-2 rounded bg-[#1A3A42]"
                                                            value={editForm.invoice_date?.slice(0, 10) || ""}
                                                            onChange={(e) => setEditForm({ ...editForm, invoice_date: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="flex justify-end gap-2 mt-4">
                                                        <button
                                                            onClick={() => setEditingSensor(null)}
                                                            className="px-4 py-1 bg-gray-500 rounded"
                                                        >
                                                            ยกเลิก
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await sensorService.updateSensor(editingSensor.id, editForm);
                                                                    alert("อัปเดตสำเร็จ");
                                                                    onUpdate({ ...editForm, id: editingSensor.id });
                                                                    setEditingSensor(null);
                                                                } catch (err) {
                                                                    console.error("❌ อัปเดตไม่สำเร็จ", err);
                                                                    alert("อัปเดตไม่สำเร็จ");
                                                                }
                                                            }}
                                                            className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded"
                                                        >
                                                            บันทึก
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                        <button
                                            onClick={() => handleDelete(sensor.id)}
                                            className="bg-red-500 hover:bg-red-600 text-xs px-3 py-1 rounded"
                                        >
                                            ถอนการติดตั้ง
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-400">
                                    ไม่มีข้อมูลอุปกรณ์
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-white text-2xl"
                    title="ปิด"
                >
                    ×
                </button>
            </div>
        </div>

    );

}
