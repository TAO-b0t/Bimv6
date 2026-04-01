import React, { useEffect, useState } from "react";
import userService from "../../services/userService";
import userImg from "../../assets/images/logo.svg";

export default function UserGroupDisplay() {
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        const allUsers = await userService.getUsersByCompany();
  
        // console.log("🧑‍💻 currentUser:", currentUser);
        // console.log("📋 allUsers from company:", allUsers);
  
        const sortedUsers = [
          allUsers.find((u) => u.email === currentUser.email),
          ...allUsers.filter((u) => u.email !== currentUser.email),
        ].filter(Boolean);
  
        // console.log("✅ sortedUsers:", sortedUsers);
  
        setCurrentUserId(currentUser.email); // เปลี่ยนเป็น email แทน
        setUsers(sortedUsers);
      } catch (error) {
        console.error("โหลด users ไม่สำเร็จ:", error);
      }
    };
  
    fetchData();
  }, []);
  
  
  

  const visibleUsers = users.slice(0, 5); // แสดง avatar ไม่เกิน 5 คน

  return (
    <div className="flex items-center space-x-[-8px] px-2 py-1 rounded-xl bg-[#32444a] ml-4 relative">
      {/* 🧑‍🤝‍🧑 Avatar กลุ่ม */}
      {visibleUsers.map((user, index) => (
        <div
          key={user.txid}
          className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden"
          title={`${user.name} ${user.lastname}`}
        >
          {index === 0 ? (
            <img
              src={userImg}
              alt="user"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-700 font-semibold">
              👤
            </div>
          )}
        </div>
      ))}

      {/* 🔽 ปุ่ม dropdown - แสดงตลอดเมื่อมี user */}
      {users.length > 0 && (
        <div className="relative pl-1.5">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-4 h-4  rounded-full bg-gray-500 text-white text-sm font-bold flex items-center justify-center border-2 border-white ml-2"
          >
            ▾
          </button>

          {/* 📋 รายชื่อทั้งหมด */}
          {showDropdown && (
            <div
  className="absolute right-0 mt-2 w-64 shadow-md rounded-lg z-20 p-3"
  style={{ backgroundColor: "#11323E" }}
>
    <p className="text-sm font-semibold mb-2">สมาชิกทั้งหมด</p>
    <ul className="max-h-60 overflow-y-auto space-y-3 text-sm text-gray-800">
      {users.map((user, index) => (
        <li
          key={user.txid}
          className="flex items-center space-x-3 border-b pb-2 last:border-b-0"
        >
          {/* 🧑‍🦰 Avatar ด้านหน้า */}
          <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
            {index === 0 ? (
              <img
                src={userImg}
                alt="user"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-700 font-semibold">
                👤
              </div>
            )}
          </div>

          <div className="flex flex-col leading-tight text-white">
  <p className="font-medium">
    {user.name} {user.lastname}{" "}
    {user.txid === currentUserId && <span className="text-xs text-yellow-400">(คุณ)</span>}
  </p>
  <p className="text-xs break-all text-white">{user.email}</p>
</div>


        </li>
      ))}
    </ul>
  </div>
)}

        </div>
      )}
    </div>
  );
}
