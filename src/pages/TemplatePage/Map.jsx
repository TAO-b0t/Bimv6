import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/titleSlice";
import LayoutTemplateElec from "../../components/container/LayoutTemplateElec";
import projectService from "../../services/projectService";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ position }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (position && position[0] && position[1]) {
      map.setView(position, 15, { animate: true });
    }
  }, [position, map]);
  return null;
}

export default function MapPage() {
  const dispatch = useDispatch();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [mapPosition, setMapPosition] = useState(null);

  const getMockCoords = (id) => {
    const mocks = {
      1: { lat: 18.796145, lng: 98.953805 },
      2: { lat: 13.7563, lng: 100.5018 },
    };
    return (
      mocks[id] || {
        lat: 13.7 + Math.random() * 0.1,
        lng: 100.5 + Math.random() * 0.1,
      }
    );
  };

  const handleProjectChange = (id) => {
    setSelectedProject(id);
    const project = projects.find((p) => String(p.id) === String(id));

    if (project) {
      setLatitude(project.lat || "");
      setLongitude(project.lng || "");
    } else {
      setLatitude("");
      setLongitude("");
    }

    setMapPosition(null);
  };

  const handleSearchLocation = () => {
    if (latitude && longitude) {
      setMapPosition([parseFloat(latitude), parseFloat(longitude)]);
    }
  };

  const isSearchDisabled = !latitude || !longitude;

  useEffect(() => {
    dispatch(setTitle("แผนที่"));
    const fetchProjects = async () => {
      try {
        const response = await projectService.getProjectsByCompany();
        let rawData = Array.isArray(response) ? response : response?.data || [];
        const dataWithCoords = rawData.map((proj) => {
          const coords = getMockCoords(proj.id);
          return {
            ...proj,
            lat: proj.lat || coords.lat,
            lng: proj.lng || coords.lng,
          };
        });
        setProjects(dataWithCoords);
      } catch (error) {
        console.error("❌ โหลดข้อมูลโครงการล้มเหลว:", error);
      }
    };
    fetchProjects();
  }, [dispatch]);

  return (
    <LayoutTemplateElec>
      <div className="flex overflow-hidden bg-white">
        <div className="flex-1 h-[93.8vh] p-6 flex flex-col gap-4 overflow-hidden">
          <div className="bg-[#0b1212] border border-gray-800 p-4 rounded-sm flex items-start gap-2 text-[13px]">
            <span className="text-[#f1a533] font-bold shrink-0">
              BIM DATA BASE
            </span>
            <p className="text-gray-300 leading-relaxed">
              เราเชื่อมต่อทุกองค์ประกอบของการ{" "}
              <span className="text-[#f1a533]">ออกแบบ วิศวกรรม</span> และ{" "}
              <span className="text-[#f1a533]">ก่อสร้าง</span> ไว้ในที่เดียว...
            </p>
          </div>

          <div className="flex flex-1 gap-4 overflow-hidden mb-2">
            <div className="flex-[3.5] bg-[#1a2b2b] rounded-md overflow-hidden border border-gray-800 relative min-h-[400px]">
              <MapContainer
                center={[13.7563, 100.5018]}
                zoom={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {mapPosition && (
                  <>
                    <Marker position={mapPosition} icon={DefaultIcon} />
                    <RecenterMap position={mapPosition} />
                  </>
                )}
              </MapContainer>
            </div>

            <div className="flex-1 bg-[#0b1212] border border-gray-800 rounded-md p-5 flex flex-col gap-6 min-w-[300px]">
              <div>
                <h3 className="text-white text-lg mb-4 font-medium">
                  แผนที่: โครงการ
                </h3>
                <label className="text-gray-500 text-[11px] block mb-1 uppercase">
                  โครงการภายในระบบ
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full bg-[#0d2a2e] text-white border border-gray-700 rounded p-2 text-sm outline-none focus:border-[#4a934a]"
                >
                  <option value="">เลือกโครงการ...</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.project_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-white text-sm font-semibold">คุณสมบัติ</p>
                <div className="space-y-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 ml-1">
                      ละติจูด
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={latitude}
                      className="w-full bg-[#0d2a2e]/50 text-gray-300 border border-gray-800 rounded p-2 text-sm outline-none cursor-default"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 ml-1">
                      ลองจิจูด
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={longitude}
                      className="w-full bg-[#0d2a2e]/50 text-gray-300 border border-gray-800 rounded p-2 text-sm outline-none cursor-default"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearchLocation}
                disabled={isSearchDisabled}
                className={`mt-auto py-2.5 rounded-md text-sm font-medium transition-all shadow-lg ${
                  isSearchDisabled
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-[#4e944b] hover:bg-[#438341] text-white active:scale-95"
                }`}
              >
                ค้นหาตำแหน่ง
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutTemplateElec>
  );
}
