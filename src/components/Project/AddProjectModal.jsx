import { useEffect, useState } from "react";
import userService from "../../services/userService";
import authService from "../../services/authService";
import bgUpload from "../../assets/images/images-svgrepo-com.svg";
import userImg from "../../assets/images/logo.svg";
import UserRole from "../common/UserRole.jsx";
import projectService from "../../services/projectService";

export default function AddProjectModal({ isOpen, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectImage, setProjectImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // ฝั่งซ้าย
  const [availableUsers, setAvailableUsers] = useState([]); // ฝั่งขวา
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchInitData = async () => {
      const user = await authService.getUserProfile();
      const users = await userService.getUsersByCompany();
      setCurrentUser(user);
      setAllUsers(users);
    };
    if (isOpen) fetchInitData();
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProjectImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setStep(1); // กลับหน้าแรก
    setProjectName("");
    setProjectImage(null);
    setPreviewImage(null);
    setSelectedUsers([]);
    setAvailableUsers([]);
    setAllUsers([]);
    setCurrentUser(null);
    onClose(); // ปิด modal
  };

  const handleInviteToggle = (email) => {
    setSelectedUsers((prev) =>
      prev.includes(email) ? prev.filter((u) => u !== email) : [...prev, email],
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      const user = await authService.getUserProfile();
      const users = await userService.getUsersByCompany();

      setCurrentUser(user);
      const others = users.filter((u) => u.email !== user.email);
      setSelectedUsers([user]); // ใส่ตัวเองไว้ฝั่งซ้าย
      setAvailableUsers(others); // คนอื่นไว้ฝั่งขวา
    };

    if (isOpen) fetchData();
  }, [isOpen]);
  const handleInvite = (user) => {
    setAvailableUsers((prev) => prev.filter((u) => u.email !== user.email));
    setSelectedUsers((prev) => [...prev, user]);
  };
  const handleRemove = (user) => {
    if (user.email === currentUser.email) return; // ห้ามลบตัวเอง
    setSelectedUsers((prev) => prev.filter((u) => u.email !== user.email));
    setAvailableUsers((prev) => [...prev, user]);
  };

  const handleSubmitProject = async () => {
    const formData = new FormData();

    formData.append("project_name", projectName);
    formData.append("owner", `${currentUser.name} ${currentUser.lastname}`);
    formData.append("company_name", currentUser.company_name);
    formData.append("People_involved", JSON.stringify(selectedUsers));
    if (projectImage) formData.append("project_img", projectImage);

    try {
      const created = await projectService.createProject(formData);
      console.log("✅ สร้างโปรเจกต์สำเร็จ:", created);

      // ❌ ลบการส่งซ้ำออก
      // onSubmit(formData);

      // ✅ เปลี่ยนให้แจ้ง parent ให้ reload อย่างเดียว
      onSubmit(); // trigger reload ที่ Workbench
      handleCancel(); // ปิด modal และ reset state
    } catch (error) {
      console.error("❌ สร้างโปรเจกต์ล้มเหลว:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        className={`bg-[#0f1f23] rounded-lg ${step === 1 ? "w-[600px]" : "w-[1000px]"} p-6 text-white relative`}
      >
        <button
          onClick={handleCancel}
          className="absolute top-4 right-5 text-2xl"
        >
          ×
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              สร้างโครงการใหม่
            </h2>
            <label className="block mb-3 text-sm">ชื่อโครงการ</label>
            <input
              className="w-full p-2 rounded bg-[#1c2d32] border border-gray-600 mb-5"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer">
              <label htmlFor="upload" className="cursor-pointer">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="preview"
                    className="mx-auto h-40 object-contain"
                  />
                ) : (
                  <>
                    <img
                      src={bgUpload}
                      className="mx-auto h-14 mb-2"
                      alt="upload placeholder"
                    />
                    <p className="font-bold">
                      ลากและวางไฟล์ รูปภาพ เพื่ออัปโหลด
                    </p>
                    <p className="text-xs text-gray-400">
                      รูปภาพของคุณจะช่วยให้แสดงรายละเอียดได้ชัดเจน
                    </p>
                  </>
                )}
              </label>
              <input
                id="upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 px-6 py-2 rounded text-white"
              >
                ยกเลิก
              </button>
              <button
                className="bg-green-600 px-4 py-2 rounded"
                onClick={() => setStep(2)}
                disabled={!projectName}
              >
                ถัดไป
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-center text-lg font-semibold mb-3">
              เพิ่มผู้ร่วมเข้าโครงการ
            </h2>
            <p className="text-center text-sm mb-6">
              โครงการ: {projectName} <span className="text-[#79F2F2]"></span>
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* ฝั่งซ้าย */}
              <div className="bg-[#1B2B2C] rounded">
                <div className="flex justify-between px-4 py-3 bg-[#263A3D] rounded-t text-sm font-medium">
                  <p>ผู้ร่วมโครงการ ({selectedUsers.length})</p>
                  <p className="text-right">สถานะ</p>
                </div>
                <div className="max-h-[300px] bg-[#11323E] overflow-y-auto divide-y divide-[#263A3D]">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.email}
                      className="flex items-center  justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden">
                          <img
                            src={
                              user.email === currentUser.email ? userImg : ""
                            }
                            alt="avatar"
                          />
                        </div>
                        <div>
                          <p className="text-sm">
                            {user.name} {user.lastname}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>

                      {user.email === currentUser.email ? (
                        <UserRole role={user.user_role} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserRole role={user.user_role} />
                          <button
                            onClick={() => handleRemove(user)}
                            className="text-gray-500 text-sm hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ฝั่งขวา */}
              <div className="bg-[#1B2B2C] rounded">
                <div className="flex justify-between px-4 py-3 bg-[#263A3D] rounded-t text-sm font-medium">
                  <p>รายละเอียดสมาชิก ({availableUsers.length})</p>
                  <p className="text-right">คำเชิญ</p>
                </div>
                <div className="max-h-[300px] bg-[#11323E] overflow-y-auto divide-y divide-[#263A3D]">
                  {availableUsers.map((user) => (
                    <div
                      key={user.email}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center text-sm">
                            👤
                          </div>
                        </div>
                        <div>
                          <p className="text-sm">
                            {user.name} {user.lastname}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInvite(user)}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full"
                      >
                        เชิญ
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 🔘 ปุ่มด้านล่าง */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 px-6 py-2 rounded text-white"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSubmitProject}
                className="bg-green-600 px-6 py-2 rounded text-white"
              >
                ตกลง
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
