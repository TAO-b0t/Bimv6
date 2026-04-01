import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setActiveSection } from "../../redux/sectionSlice";
import { setTitle } from "../../redux/titleSlice";

import { IoIosArrowBack } from "react-icons/io";
import detailIcon from "./img/model-detail.svg";
import repairIcon from "./img/repair.svg";
import mapIcon from "./img/map.svg";
import iotIcon from "./img/iot.svg";
import ProjectSection from "./ProjectSection";

export default function ModelSidePane() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = useSelector((state) => state.selectedProject.id);
  const dispatch = useDispatch();
  const activeSection = useSelector((state) => state.section.active);
  const projects = useSelector((state) => state.projects.data);

  const buttonClass = (section) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-150 ${
      activeSection === section ? "bg-yellow-400 text-black" : " text-white"
    }`;

  return (
    <div className="h-full p-5 flex flex-col gap-4 text-white bg-[#091F23]">
      <button
        onClick={() => {
          const currentProject = projects.find(
            (project) => project.id === projectId,
          );
          dispatch(setTitle(currentProject?.project_name || "ชื่อโครงการ"));
          navigate(`/project/${projectId}`);
          localStorage.removeItem("dbId");
        }}
        className="flex items-center text-white gap-2 hover:opacity-80"
      >
        <IoIosArrowBack size={20} />
        ย้อนกลับ
      </button>

      <button
        onClick={() => dispatch(setActiveSection("detail"))}
        className={buttonClass("detail")}
      >
        <img src={detailIcon} alt="รายละเอียดโครงการ" className="w-5 h-5" />
        รายละเอียดโครงการ
      </button>

      <button
        onClick={() => dispatch(setActiveSection("repair"))}
        className={buttonClass("repair")}
      >
        <img src={repairIcon} alt="แจ้งซ่อม" className="w-5 h-5" />
        แจ้งซ่อม
      </button>

      <button
        onClick={() => dispatch(setActiveSection("map"))}
        className={buttonClass("map")}
      >
        <img src={mapIcon} alt="แผนที่" className="w-5 h-5" />
        แผนที่
      </button>

      <button
        onClick={() => {
          if (activeSection === "iot") {
            //   console.log('🔄 Unset IOT Section');
            dispatch(setActiveSection(null));
          } else {
            //   console.log('🟡 Clicked IOT Section');
            dispatch(setActiveSection("iot"));
          }
        }}
        className={buttonClass("iot")}
      >
        <img src={iotIcon} alt="ระบบเซ็นเซอร์" className="w-5 h-5" />
        ระบบเซ็นเซอร์ IOT
      </button>

      <ProjectSection />
    </div>
  );
}
