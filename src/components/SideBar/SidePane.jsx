import { useState, useEffect } from "react";
import ExpandableSection from "../common/ExpandableItem";
import SideBarToggleButton from "../common/SideBarToggleButton";

import {
  LayoutDashboard,
  FileText,
  Map,
  Wrench,
  History,
  ClipboardList,
  Calendar,
  HardHat,
  FileSearch,
} from "lucide-react";

import ProjectSection from "./ProjectSection";
import ModelSidePane from "./ModelSidePane";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function SidePane() {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarMode = useSelector((state) => state.sidebarMode.mode);

  const [expandedSections, setExpandedSections] = useState({
    documentMenu: false,
    technicianMenu: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (sidebarMode === "model") {
    return <ModelSidePane />;
  }

  return (
    <div className="h-full row-start-2 row-end-3 overflow-y-auto overflow-x-hidden flex flex-col gap-2.5 p-5">
      <SideBarToggleButton
        title={"หน้าแรก"}
        icon={<LayoutDashboard size={20} />}
        active={location.pathname === "/workbench"}
        onClick={() => navigate("/workbench")}
      />
      <ExpandableSection
        title={"เมนูเอกสาร"}
        icon={<FileText size={20} />}
        expanded={expandedSections.documentMenu}
        onToggle={() => toggleSection("documentMenu")}
      >
        <SideBarToggleButton
          title={"เอกสารอิเล็กทรอนิกส์"}
          icon={<FileText size={18} />}
          isChild={true}
          active={location.pathname === "/Documents"}
          onClick={() => navigate("/Documents")}
        />
        <SideBarToggleButton
          title={"พื้นที่จัดเก็บเอกสาร"}
          icon={<FileText size={18} />}
          isChild={true}
        />
        <SideBarToggleButton
          title={"ติดตามเอกสาร"}
          icon={<FileSearch size={18} />}
          isChild={true}
        />
        <SideBarToggleButton
          title={"ประวัติเอกสารของฉัน"}
          icon={<History size={18} />}
          isChild={true}
          active={location.pathname === "/DocHistory"}
          onClick={() => navigate("/DocHistory")}
        />
      </ExpandableSection>
      <SideBarToggleButton
        title={"แผนที่"}
        icon={<Map size={20} />}
        isChild={true}
        active={location.pathname === "/map"}
        onClick={() => navigate("/map")}
      />
      <ExpandableSection
        icon={<HardHat size={20} />}
        title={"เมนูทีมช่างซ่อมบำรุง"}
        expanded={expandedSections.technicianMenu}
        onToggle={() => toggleSection("technicianMenu")}
      >
        <SideBarToggleButton
          title={"ช่างซ่อมบำรุง"}
          icon={<Wrench size={18} />}
          isChild={true}
          active={location.pathname === "/Maintenance"}
          onClick={() => navigate("/Maintenance")}
        />
        <SideBarToggleButton
          title={"ติดตามสถานะเเจ้งซ่อม"}
          icon={<ClipboardList size={18} />}
          isChild={true}
        />
        <SideBarToggleButton
          title={"ปฎิทินการเเจ้งซ่อม"}
          icon={<Calendar size={18} />}
          isChild={true}
        />
      </ExpandableSection>
      <ProjectSection />
    </div>
  );
}
