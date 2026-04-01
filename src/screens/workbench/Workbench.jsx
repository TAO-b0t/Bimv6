import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import TopBar from "../../components/TopBar/TopBar";
import EditorCanvas from "../../components/EditorCanvas/EditorCanvas";
import bg from "../../assets/app 2/bg.png";
import AddProjectModal from "../../components/Project/AddProjectModal";
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../../redux/projectSlice';
import { useNavigate } from "react-router-dom";
import { setTitle } from '../../redux/titleSlice'; // 👉 import action
import { setSelectedProjectId } from '../../redux/selectedProjectSlice';

export default function Workbench() {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.projects.data);
    const loading = useSelector((state) => state.projects.loading);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);
    
    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);
    useEffect(() => {
        dispatch(setTitle("เริ่มต้นโครงการ"));
        dispatch(setSelectedProjectId(null));
        dispatch(fetchProjects());
      }, [dispatch]);
      
    const handleSubmitProject = async () => {
        setShowModal(false);
        dispatch(fetchProjects());
    };

    return (
        <div className="inline-grid grid-cols-[16em,1fr] grid-rows-[4em,1.5em,1fr] w-full text-white font-sans font-bold">
            <SideBar />
            <TopBar />
            <EditorCanvas>
                <div className="col-start-2 row-start-2 row-end-3 px-10 flex justify-between items-center">
                    {/* 🔹 กล่องข้อความ BIM DATA BASE */}
                    <div className="text-base text-white bg-[#558A8D1F] rounded-lg min-h-[4em] px-6 flex items-center w-full mr-4">
                        <span>
                            <span className="font-bold text-[#FEC02C]">BIM DATA BASE</span>{" "}
                            เราเชื่อมต่อทุกองค์ประกอบของ{" "}
                            <span className="text-[#f59e0b]">การออกแบบ วิศวกรรม</span> และการ{" "}
                            <span className="text-[#f59e0b]">ควบคุมโครงการ</span> ได้อย่างมีประสิทธิภาพ
                        </span>
                    </div>

                    {/* 🔘 ปุ่มเพิ่มโครงการ */}
                    <button onClick={() => setShowModal(true)}
                        className="bg-[#028ECA] text-white font-semibold px-9 h-[4em] rounded-xl flex items-center gap-2 shadow hover:brightness-110 transition whitespace-nowrap"
                    >
                        <span className="text-xl font-bold">+</span>
                        เพิ่มโครงการ
                    </button>
                    <AddProjectModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleSubmitProject} />

                </div>

                {/* 🔸 ส่วนแสดงการ์ด */}
                <div className="col-start-2 row-start-3 p-6 w-[80%] h-full">
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
                                            dispatch(setSelectedProjectId(project.id)); // ✅ บอกว่าเลือกโปรเจกต์นี้
                                            navigate(`/project/${project.id}`);
                                          }}
                                        className="bg-[#1d2b2b] rounded-lg p-4 shadow-md cursor-pointer hover:brightness-110 transition"
                                    >
                                        <img
                                            src={
                                                project.project_img
                                                    ? `data:image/jpeg;base64,${project.project_img}`
                                                    : ""
                                            }
                                            alt="model"
                                            className="rounded-md w-full h-[200px] object-cover"
                                        />
                                        <div className="mt-2 text-sm font-light text-gray-300">
                                            เจ้าของโครงการ: {project.owner}
                                        </div>
                                        <div className="text-lg font-bold text-gray-300">
                                            โครงการ: {project.project_name}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                                            <span>
                                                เริ่มโครงการเมื่อ{" "}
                                                {new Date(project.create_at).toLocaleString("th-TH", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })}
                                            </span>
                                            <span>|</span>
                                            <span>
                                                อัปเดตล่าสุด{" "}
                                                {new Date(project.create_at).toLocaleString("th-TH", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })}
                                            </span>
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