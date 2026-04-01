import React, { useState, useEffect } from "react";
import addIcon from "./img/add_svgrepo.com.svg";
import cubeIcon from "../../assets/app 2/cube.png";
import projectService from "../../services/projectService";
import AddProjectModal from "../../components/Project/AddProjectModal";
import { useSelector, useDispatch } from "react-redux";
import { setTitle } from "../../redux/titleSlice"; // 👈 import redux action
import { useNavigate } from "react-router-dom";
import { setSelectedProjectId } from "../../redux/selectedProjectSlice";

import { fetchProjects } from "../../redux/projectSlice";

export default function ProjectSection() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.data);
  const loading = useSelector((state) => state.projects.loading);
  const [showModal, setShowModal] = useState(false);
  //   const [selectedProjectId, setSelectedProjectId] = useState(null); // 👈 เพิ่ม state
  const navigate = useNavigate();
  const selectedProjectId = useSelector((state) => state.selectedProject.id);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleSubmitProject = async () => {
    setShowModal(false);
    dispatch(fetchProjects());
  };
  if (loading) {
    return (
      <div className="mt-12 px-2.5 text-sm text-gray-400">
        กำลังโหลดโครงการ...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <>
        <p className="px-2.5 font-extrabold mt-12">โครงการ</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex flow-col items-center h-10 border-dashed rounded-lg border-[1px] border-gray-400 text-gray-400 mt-2 ml-2"
        >
          <img src={addIcon} alt="add icon" className="px-3" />
          เพิ่มโครงการ
        </button>
        <AddProjectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitProject}
        />
      </>
    );
  }

  return (
    <div className="mt-12">
      <p className="px-2.5 font-extrabold mb-5">โครงการ</p>
      <ul className="space-y-5">
        {projects.map((project, index) => (
          <li
            key={index}
            onClick={() => {
              dispatch(setTitle(project.project_name));
              dispatch(setSelectedProjectId(project.id)); // ✅ update redux state
              navigate(`/project/${project.id}`);
            }}
            className={`flex items-center text-blue-900 px-3 py-1 rounded-md cursor-pointer transition ${
              selectedProjectId === project.id
                ? "bg-yellow-400 text-black"
                : "hover:bg-yellow-400 hover:text-black"
            }`}
          >
            {" "}
            <img src={cubeIcon} alt="cube" className="w-5 h-5 mr-3" />
            <span className="truncate max-w-[160px]">
              {project.project_name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
