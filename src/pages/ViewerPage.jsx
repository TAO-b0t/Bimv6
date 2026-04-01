import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import modelService from "../services/modelService";
import SideBar from "../components/SideBar/SideBar";
import TopBar from "../components/TopBar/TopBar";
import EditorCanvas from "../components/EditorCanvas/EditorCanvas";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../redux/titleSlice";
import { setSidebarMode } from "../redux/sidebarModeSlice";
import IoTSensorFooter from "../components/IoT/IoTSensorFooter";
import { motion, AnimatePresence } from 'framer-motion';
import SensorSidebar from "../components/IoT/SensorSidebar";

const ViewerPage = () => {
    const { modelId } = useParams();
    const viewerDiv = useRef(null);
    const viewerRef = useRef(null); // ✅ ใช้เก็บ viewer instance
    const [urn, setUrn] = useState(null);
    const [token, setToken] = useState(null);
    const dispatch = useDispatch();
    const models = useSelector((state) => state.models.all);
    const currentModel = models.find((m) => m.id.toString() === modelId);
    const activeSection = useSelector((state) => state.section.active);
    const [selectedSensor, setSelectedSensor] = useState(null); // เซ็นเซอร์ที่คลิก

    useEffect(() => {
      const onSuccess = (doc) => {
        const defaultModel = doc.getRoot().getDefaultGeometry();
        const viewer = new Autodesk.Viewing.GuiViewer3D(viewerDiv.current, {
          extensions: [
            "Autodesk.Viewing.MarkupsCore",
            "Autodesk.Viewing.MarkupsGui",
            "Autodesk.Viewing.PropertyPanel",
            "Autodesk.ViewCubeUi",
            "Autodesk.Measure",
            "Autodesk.FirstPerson",
          ],
        });
  
        viewerRef.current = viewer; // ✅ เก็บไว้ใน ref
        viewer.start();
        viewer.loadDocumentNode(doc, defaultModel);
  
        // ✅ แก้ปัญหา viewer ทับ footer
        viewerDiv.current.style.position = "relative";
        viewerDiv.current.style.height = "100%";
  
        // ✅ Listener สำหรับคลิกแล้วแสดง dbId
        viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (event) => {
          const dbIdArray = event.dbIdArray;
          if (dbIdArray.length > 0) {
            const selectedDbId = dbIdArray[0];
            console.log("🆔 เลือก dbId:", selectedDbId);
            localStorage.setItem("dbId", selectedDbId);

          }
        });
      };
  
      const onFailure = (err) => {
        console.error("❌ โหลดเอกสารไม่สำเร็จ:", err);
      };
  
      modelService.getUrn(modelId).then((model) => {
        dispatch(setTitle(model.model_name));
      });
  
      modelService.getUrnAndTokenAndInitViewer(
        modelId,
        setUrn,
        setToken,
        viewerDiv,
        onSuccess,
        onFailure
      );
    }, [modelId, dispatch]);
  
    useEffect(() => {
      dispatch(setSidebarMode("model"));
      return () => {
        dispatch(setSidebarMode("default"));
      };
    }, [dispatch]);
    useEffect(() => {
        if (currentModel) {
        //   console.log("📦 ข้อมูลของโมเดลที่เปิดอยู่:", currentModel);
        } else {
          console.log("🚫 ไม่พบโมเดลที่ตรงกับ ID:", modelId);
        }
      }, [currentModel, modelId]);
      
    return (
<div className="inline-grid grid-cols-[16em,1fr] grid-rows-[4em,1.5em,1fr] w-full h-screen text-white font-sans font-bold">
<SideBar />
        <TopBar />
        <EditorCanvas>
  <div className="flex flex-row h-full w-full bg-[#1c2a2b] overflow-hidden">

    {/* ✅ ฝั่งซ้าย: viewer + footer */}
    <div className={`flex flex-col transition-all duration-300 ${selectedSensor ? "w-[calc(100%-400px)]" : "w-full"}`}>
      <div ref={viewerDiv} className="w-full flex-grow min-h-0" />

      <AnimatePresence>
        {activeSection === 'iot' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "250px", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* ✅ ส่ง selectedSensor handler ไปให้ Footer */}
            <IoTSensorFooter setSelectedSensor={setSelectedSensor} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <SensorSidebar sensor={selectedSensor} onClose={() => setSelectedSensor(null)} />

  </div>
</EditorCanvas>

      </div>
    );
  };
  
export default ViewerPage;
