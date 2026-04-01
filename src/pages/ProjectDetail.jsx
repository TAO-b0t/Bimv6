import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import projectService from "../services/projectService";
import modelService from "../services/modelService";
import bg from "../assets/app 2/bg.png";
import SideBar from "../components/SideBar/SideBar";
import TopBar from "../components/TopBar/TopBar";
import EditorCanvas from "../components/EditorCanvas/EditorCanvas";
import UploadModelModal from "../components/Model/UploadModelModal";
import img1 from "../assets/app 2/img1.png";
import img2 from "../assets/app 2/img2.png";
import img3 from "../assets/app 2/Vector.png";
import UploadModelService from "../services/uploadModelService";
import authService from "../services/authService";
import { setAllModels } from "../redux/modelSlice";
import { useDispatch } from "react-redux";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [translationStatuses, setTranslationStatuses] = useState({});
  const navigate = useNavigate();
  let cachedToken = null;
  const dispatch = useDispatch();
  const [favoriteModelIds, setFavoriteModelIds] = useState([]);

  const cleanProgress = (progress) => {
    if (!progress) return "0%";
    if (progress.toLowerCase().includes("complete")) {
      const match = progress.match(/\d+%/);
      return match ? match[0] : "100%";
    }
    return progress;
  };
  useEffect(() => {
    const fetchFavorites = async () => {
      const profile = await authService.getUserProfile();
      const favorites = await modelService.getFavoriteModels(profile.txid);
      // console.log("🚀 Favorite models:", profile.txid);
      setFavoriteModelIds(favorites);
      // console.log("Favorite models:", favorites);
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (modelId) => {
    const profile = await authService.getUserProfile();
    const updatedFavorites = await modelService.toggleFavoriteModel(
      profile.txid,
      modelId,
      favoriteModelIds,
    );
    setFavoriteModelIds(updatedFavorites);
  };
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await projectService.getProjectById(id);
        setProject(result);

        const modelResult = await modelService.getModelsByProject(
          result.project_name,
          result.company_name,
        );
        setModels(modelResult);
        dispatch(setAllModels(modelResult)); // ✅ เก็บไว้ใน redux

        // console.log("🚀 Model result:", modelResult);
      } catch (err) {
        console.error("โหลดข้อมูลไม่สำเร็จ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  useEffect(() => {
    const checkTranslationStatus = async () => {
      try {
        const profile = await authService.getUserProfile();

        if (!cachedToken) {
          const res = await modelService.requestToken(profile.email);
          cachedToken = res.token;
        }
        const urns = models.map((model) => model.urn.replace("urn:", ""));
        const res = await UploadModelService.ConvertMultipleFiles(urns);

        // console.log("🚀 Translation status response:", res);

        const statusMap = {};
        for (const model of models) {
          const matched = res.data.statuses.find(
            (s) => s.urn === model.urn.replace("urn:", ""),
          );
          statusMap[model.id] = {
            status: matched?.status || "unknown",
            progress: cleanProgress(matched?.progress),
          };
        }

        setTranslationStatuses(statusMap);
      } catch (err) {
        console.error("❌ Translation status fetch error:", err);
      }
    };

    if (models.length > 0) checkTranslationStatus();
  }, [models]);

  const handleUploadComplete = async () => {
    if (project) {
      const updatedModels = await modelService.getModelsByProject(
        project.project_name,
        project.company_name,
      );
      setModels(updatedModels);
      setShowUploadModal(false);
    }
  };

  return (
    <div className="inline-grid grid-cols-[16em,1fr] grid-rows-[4em,1.5em,1fr] w-full text-white font-sans font-bold">
      <SideBar />
      <TopBar />
      <EditorCanvas>
        {loading ? (
          <div className="col-start-2 row-start-3 flex justify-center items-center h-full">
            กำลังโหลด...
          </div>
        ) : models.length === 0 ? (
          <div className="col-start-2 row-start-3 flex flex-col justify-center items-center h-full text-center">
            <img src={img1} className="w-10 mb-4" />
            <p className="text-lg font-semibold">โปรเจกต์นี้ยังไม่มีโมเดล</p>
            <p className="text-sm text-gray-400 mb-4">
              จัดระเบียบไฟล์ของคุณโดยเพิ่มโมเดลแรกของคุณ
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              onClick={() => setShowUploadModal(true)}
            >
              + อัปโหลดโมเดล
            </button>
            {project && (
              <UploadModelModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUploadSuccess={handleUploadComplete}
                projectName={project.project_name}
                companyName={project.company_name}
              />
            )}
          </div>
        ) : (
          <div className="col-start-2 row-start-3 p-8 h-[calc(100vh-10rem)] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <img src={img3} alt="icon" className="w-5 h-5" />
                <h2 className="text-x text-white">
                  โครงการ {project.project_name}
                </h2>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                onClick={() => setShowUploadModal(true)}
              >
                + อัปโหลดโมเดล
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => {
                const isTranslating =
                  translationStatuses[model.id]?.status !== "success";

                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      if (!isTranslating) {
                        navigate(`/viewer/${model.id}`);
                      }
                    }}
                    className={`relative rounded-xl p-4 shadow text-white transition w-full h-full 
    ${isTranslating ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:brightness-95"}
  `}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !isTranslating) {
                        navigate(`/viewer/${model.id}`);
                      }
                    }}
                  >
                    {/* ✅ ปุ่มดาวด้านในการ์ด */}
                    <button
                      className="absolute top-2 right-2 z-10 text-yellow-400 hover:text-yellow-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(model.id);
                      }}
                    >
                      {favoriteModelIds.includes(model.id) ? "★" : "☆"}
                    </button>

                    <p className="text-sm text-gray-500 mb-2">
                      {getTimeAgo(model.create_at)}
                    </p>

                    <div className="bg-white w-full h-40 rounded-lg flex justify-center items-center border pointer-events-none">
                      <img src={img1} className="w-10" />
                    </div>

                    <div className="mt-4 flex items-center gap-2 pointer-events-none">
                      <img src={img2} className="w-5" />
                      <span className="truncate">{model.model_name}</span>
                    </div>

                    {isTranslating && (
                      <div className="mt-3 text-sm text-center text-yellow-300">
                        ⚠️ กำลังแปลงไฟล์ โปรดรอสักครู่...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {project && (
              <UploadModelModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUploadSuccess={handleUploadComplete}
                projectName={project.project_name}
                companyName={project.company_name}
              />
            )}
          </div>
        )}
      </EditorCanvas>
    </div>
  );
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const updated = new Date(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Bangkok",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(timestamp)),
  );

  const diffMs = now.getTime() - updated.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMin / 60);

  if (diffHrs < 1) {
    return `อัปเดต ${diffMin} นาที ล่าสุด`;
  }

  return `อัปเดต ${diffHrs} ชั่วโมง ล่าสุด`;
}
