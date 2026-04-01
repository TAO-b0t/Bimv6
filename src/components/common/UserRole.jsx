import React from "react";
import "./UserRole.css";

export default function UserRole({ role }) {
  const roleMap = {
    0: "เจ้าของ",
    1: "ผู้จัดการ",
    2: "พนักงาน",
    3: "ทีมช่าง",
    4: "แขก",
  };

  const roleColorMap = {
    0: "#84B2E9", // เจ้าของ
    1: "#8B63BD", // ผู้จัดการ (ม่วง)
    2: "#E97652", // พนักงาน (ส้ม)
    3: "#E97652", // ทีมช่าง (ใช้สีเดียวกับพนักงาน)
    4: "#5FA95E", // แขก (เขียว)
  };

  const color = roleColorMap[role] || "#84B2E9"; // fallback เผื่อ role ไม่รู้จัก

  return (
    <div
      className={`text-[0.75rem] m-[5px_8px] leading-none text-center rounded-[1em] px-[1em] w-auto h-[1.525em] flex justify-center items-center`}
      style={{
        border: `1px solid ${color}`,
        color: color,
      }}
    >
      <p>{roleMap[role] || "ไม่ทราบบทบาท"}</p>
    </div>
  );
}
