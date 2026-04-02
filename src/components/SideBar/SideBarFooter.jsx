import { useNavigate } from "react-router-dom";
import SideBarToggleButton from "../common/SideBarToggleButton";
import SideBarLogOutButton from "../common/SideBarLogoutButton";
import authService from "../../services/authService";

import { HelpCircle, LogOut } from "lucide-react"; 

export default function SideBarFooter() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/auth/login");
  };

  return (
    <div className="row-start-3 row-end-4 h-[10.125em] flex flex-col justify-center self-center w-full px-6 py-8 gap-2.5">
      <SideBarToggleButton 
        title="ศูนย์ช่วยเหลือ" 
        icon={<HelpCircle size={20} />} 
      />
      
      <SideBarLogOutButton 
        title="ออกจากระบบ" 
        icon={<LogOut size={20} />} 
        onClick={handleLogout} 
      />
    </div>
  );
}