import { useEffect, useState } from "react";
import UserRole from "../common/UserRole.jsx";
import bgImg from "../../assets/app/workbench/bg.png";
import userImg from "../../assets/images/logo.svg";
import authService from "../../services/authService.js";

export default function UserStatus() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService.getUserProfile()
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("โหลดข้อมูลผู้ใช้ไม่สำเร็จ:", err.message || err);
      });
  }, []);

  if (!user) return null;

  return (
    <div className="row-start-1 row-end-2">
      <div
        className="grid grid-cols-[1fr_2.3fr] grid-rows-2 h-[122px] w-100% bg-black gap-y-2"
        style={{ backgroundImage: `url(${bgImg})`, backgroundSize: `contain` }}
      >
        <img
          className="w-[2.8125em] h-[2.8125em] col-start-1 col-end-2 row-start-1 row-end-3 self-center justify-self-center border-2 border-white rounded-full object-cover"
          src={userImg}
          alt="user"
        />
        <div className="text-[1rem] relative col-start-2 col-end-3 row-start-1 row-end-2 flex items-center text-white">
          <p className="absolute bottom-0 leading-none">
            {user.name} {user.lastname}
          </p>
        </div>
        <div className="col-start-2 col-end-3 row-start-2 row-end-3 flex flex-row justify-left">
          <p className="text-[0.75em] font-extralight leading-6">สถานะ</p>
          <UserRole role={user.user_role} />
        </div>
      </div>
    </div>
  );
}
