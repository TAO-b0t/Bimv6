import { useNavigate } from "react-router-dom";
import SideBarToggleButton from "../common/SideBarToggleButton";
import exitMenu from "./img/exit_svgrepo.com.svg";
import helpMenu from "./img/help-circle_svgrepo.com.svg";
import authService from "../../services/authService";

export default function SideBarFooter() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();         // ลบ token
    navigate("/auth/login");          // ไปหน้า login
  };

  return (
    <div className="row-start-3 row-end-4 h-[10.125em] flex flex-col justify-center self-center w-full px-6 py-8 gap-2.5">
      <SideBarToggleButton title="ศูนย์ช่วยเหลือ" img={helpMenu} />
      <SideBarToggleButton title="ออกจากระบบ" img={exitMenu} onClick={handleLogout} />
    </div>
  );
}
