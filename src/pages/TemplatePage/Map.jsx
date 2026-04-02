import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/titleSlice";
import LayoutTemplateElec from "../../components/container/LayoutTemplateElec";
import authService from "../../services/authService.js";

export default function MapPage() {
  const dispatch = useDispatch();

  const [activeB, setActiveB] = useState("map");
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]); 

  useEffect(() => {
    dispatch(setTitle("แผนที่"));
  }, [dispatch]);

  useEffect(() => {
    authService
      .getUserProfile()
      .then((data) => setUser(data))
      .catch((err) => console.error("โหลดข้อมูลผู้ใช้ไม่สำเร็จ:", err));

    const mockProjects = [
      { id: 1, name: "โครงการภายในระบบ A" },
      { id: 2, name: "โครงการภายในระบบ B" },
    ];
    setProjects(mockProjects);
  }, []);

  return (
    <LayoutTemplateElec>
      <div className="flex overflow-hidden bg-white">

        <div className="flex-1 h-[93.8vh] p-6 flex flex-col gap-4 overflow-hidden">
          
          <div className="flex flex-col gap-2">
            <div className="bg-[#0b1212] border border-gray-800 p-4 rounded-sm flex items-start gap-2 text-[13px]">
              <span className="text-[#f1a533] font-bold shrink-0">BIM DATA BASE</span>
              <p className="text-gray-300 leading-relaxed">
                เราเชื่อมต่อทุกองค์ประกอบของการ <span className="text-[#f1a533]">ออกแบบ วิศวกรรม</span> และ <span className="text-[#f1a533]">ก่อสร้าง</span> ไว้ในที่เดียว เพื่อให้คุณสามารถวางแผนและ <span className="text-[#f1a533]">ควบคุมโครงการ</span> ได้อย่างมีประสิทธิภาพ
              </p>
            </div>
          </div>

          <div className="flex flex-1 gap-4 overflow-hidden mb-2">
            
            {/* ส่วนของแผนที่ */}
            {/* ********************************************** */}
            <div className="flex-[3.5] bg-[#1a2b2b] rounded-md overflow-hidden border border-gray-800 relative">
              <img 
                src="https://v.fastcdn.co/u/406085a2/56230553-0-Google-Maps-Custom-M.png" 
                alt="Mock Map" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-gray-500 text-sm bg-black/40 px-3 py-1 rounded-full">Map Preview Mode</span>
              </div>
            </div>
            {/* ********************************************** */}

            <div className="flex-1 bg-[#0b1212] border border-gray-800 rounded-md p-5 flex flex-col gap-6 min-w-[300px]">
              
              <div>
                <h3 className="text-white text-lg mb-4 font-medium">แผนที่: โครงการ</h3>
                <label className="text-gray-500 text-[11px] block mb-1 uppercase">โครงการภายในระบบ</label>
                <select className="w-full bg-[#0d2a2e] text-white border border-gray-700 rounded p-2 text-sm outline-none focus:border-[#4a934a]">
                  <option value="">เลือกโครงการ...</option>
                  {projects.map(proj => (
                    <option key={proj.id} value={proj.id}>{proj.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-white text-sm font-semibold">คุณสมบัติ</p>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="ละติจูด" 
                    className="w-full bg-[#0d2a2e] text-white border border-gray-700 rounded p-2 text-sm placeholder:text-gray-600 outline-none focus:border-[#4a934a]"
                  />
                  <input 
                    type="text" 
                    placeholder="ลองจิจูด" 
                    className="w-full bg-[#0d2a2e] text-white border border-gray-700 rounded p-2 text-sm placeholder:text-gray-600 outline-none focus:border-[#4a934a]"
                  />
                </div>
              </div>

              <button className="mt-auto bg-[#4e944b] hover:bg-[#438341] text-white py-2.5 rounded-md text-sm font-medium transition-all active:scale-95 shadow-lg">
                ค้นหาตำแหน่ง
              </button>
            </div>

          </div>
        </div>
      </div>
    </LayoutTemplateElec>
  );
}