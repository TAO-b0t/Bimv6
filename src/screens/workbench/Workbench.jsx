import React, { useState, useEffect, useRef } from "react";
import SideBar from "../../components/SideBar/SideBar";
import TopBar from "../../components/TopBar/TopBar";
import EditorCanvas from "../../components/EditorCanvas/EditorCanvas";
import bg from "../../assets/app 2/bg.png";
import AddProjectModal from "../../components/Project/AddProjectModal";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../redux/projectSlice";
import { useNavigate } from "react-router-dom";
import { setTitle } from "../../redux/titleSlice";
import { setSelectedProjectId } from "../../redux/selectedProjectSlice";
import projectService from "../../services/projectService";
import { MoreVertical, Settings, Trash2 } from "lucide-react";

export default function Workbench() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector((state) => state.projects.data);
  const loading = useSelector((state) => state.projects.loading);

  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    dispatch(setTitle("เริ่มต้นโครงการ"));
    dispatch(setSelectedProjectId(null));
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleSubmitProject = async () => {
    setShowModal(false);
    dispatch(fetchProjects());
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบโครงการนี้?")) {
      try {
        await projectService.deleteProject(projectId); // 👈 เรียก API ลบ
        dispatch(fetchProjects()); 
        setActiveMenu(null);
      } catch (error) {
        console.error("Delete failed:", error);
        alert("ไม่สามารถลบโครงการได้");
      }
    }
  };

  return (
    <div className="inline-grid grid-cols-[16em,1fr] grid-rows-[4em,1.5em,1fr] w-full text-white font-sans font-bold">
      <SideBar />
      <TopBar />
      <EditorCanvas>
        <div className="col-start-2 row-start-2 row-end-3 px-10 flex justify-between items-center">
          <div className="text-base text-white bg-[#558A8D1F] rounded-lg min-h-[4em] px-6 flex items-center w-full mr-4">
            <span>
              <span className="font-bold text-[#FEC02C]">BIM DATA BASE</span>{" "}
              เราเชื่อมต่อทุกองค์ประกอบของ{" "}
              <span className="text-[#f59e0b]">การออกแบบ วิศวกรรม</span> และการ{" "}
              <span className="text-[#f59e0b]">ควบคุมโครงการ</span>{" "}
              ได้อย่างมีประสิทธิภาพ
            </span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#028ECA] text-white font-semibold px-9 h-[4em] rounded-xl flex items-center gap-2 shadow hover:brightness-110 transition whitespace-nowrap"
          >
            <span className="text-xl font-bold">+</span>
            เพิ่มโครงการ
          </button>
          <AddProjectModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmitProject}
          />
        </div>

        <div className="col-start-2 row-start-3 p-6 w-[100%] h-full">
          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : projects.length === 0 ? (
            <div
              className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold pointer-events-none"
              style={{
                backgroundImage: `url(${bg})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          ) : (
            <div className="overflow-y-auto max-h-[42rem] pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      dispatch(setTitle(project.project_name));
                      dispatch(setSelectedProjectId(project.id));
                      navigate(`/project/${project.id}`);
                    }}
                    className="bg-[#141e1e] rounded-lg p-4 shadow-md cursor-pointer hover:bg-[#1d2b2b] transition group"
                  >
                    <div className="rounded-md overflow-hidden bg-gray-800">
                      <img
                        src={
                          project.project_img
                            ? `data:image/jpeg;base64,${project.project_img}`
                            : ""
                        }
                        alt="model"
                        className="w-full h-[200px] object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-start">
                        <div className="text-[12px] font-light text-gray-400">
                          เจ้าของโครงการ: {project.owner}
                        </div>

                        <div
                          className="relative"
                          ref={activeMenu === project.id ? menuRef : null}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(
                                activeMenu === project.id ? null : project.id,
                              );
                            }}
                            className="p-1 rounded-full hover:bg-gray-700/50 transition text-gray-400 hover:text-white"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {activeMenu === project.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-[#0b1212] border border-gray-800 rounded-md shadow-2xl z-20 py-1 overflow-hidden">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#1a2b2b] transition"
                              >
                                <Settings size={14} className="mr-2" />{" "}
                                ตั้งค่าโครงการ
                              </button>
                              <button
                                onClick={(e) =>
                                  handleDeleteProject(e, project.id)
                                }
                                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition border-t border-gray-800"
                              >
                                <Trash2 size={14} className="mr-2" /> ลบโครงการ
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-base font-bold text-gray-200 mt-1 truncate">
                        โครงการ: {project.project_name}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-3 flex flex-col gap-1 font-normal">
                        <span>
                          เริ่มโครงการเมื่อ{" "}
                          {new Date(project.create_at).toLocaleDateString(
                            "th-TH",
                          )}
                        </span>
                        <span>
                          อัปเดตล่าสุด{" "}
                          {new Date(project.create_at).toLocaleDateString(
                            "th-TH",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </EditorCanvas>
    </div>
  );
}
