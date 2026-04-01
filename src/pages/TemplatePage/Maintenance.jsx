import React, { useState, useEffect } from "react";
import LayoutTemplateElec from "../../components/container/LayoutTemplateElec";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/titleSlice";
import authService from "../../services/authService";

const TECHNICIAN_STATUS_OPTIONS = [
  { value: "หัวหน้าช่าง", label: "หัวหน้าช่าง" },
  { value: "ช่างซ่อมบำรุง", label: "ช่างซ่อมบำรุง" },
];

const TECHNICIAN_CATEGORY_OPTIONS = [
  {
    value: "ช่างอุปกรณ์การแพทย์ (วิศวกรรมชีวการแพทย์)",
    label: "ช่างอุปกรณ์การแพทย์ (วิศวกรรมชีวการแพทย์)",
  },
  { value: "ช่างไฟฟ้า", label: "ช่างไฟฟ้า" },
  { value: "ช่างโยธา (ก่อสร้าง/ซ่อมอาคาร)", label: "ช่างโยธา (ก่อสร้าง/ซ่อมอาคาร)" },
  { value: "ช่างระบบปรับอากาศ", label: "ช่างระบบปรับอากาศ" },
  { value: "ช่างโลหะ", label: "ช่างโลหะ" },
  { value: "ช่างเทคนิคซ่อมบำรุงทั่วไป", label: "ช่างเทคนิคซ่อมบำรุงทั่วไป" },
];

const initialFormData = {
  name: "",
  surname: "",
  email: "",
  password: "",
  phoneNumber: "",
  lineID: "",
  status: "",
  category: "",
};

export default function Maintenance() {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [technicianData, setTechnicianData] = useState([]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(setTitle("ช่างซ่อมบำรุง"));
    loadTechnicians();
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(technicianData.length / itemsPerPage));
  const currentData = technicianData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setFormData(initialFormData);
    setSelectedImage(null);
    setSelectedImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loadTechnicians = async () => {
    try {
      setIsLoadingTechnicians(true);

      const currentUserProfile = await authService.getUserProfile();

      const companyName =
        currentUserProfile?.company_name ||
        currentUserProfile?.companyName ||
        "";

      if (!companyName) {
        setTechnicianData([]);
        setCurrentPage(1);
        return;
      }
      const response = await authService.getTechniciansByCompany(companyName);

      const technicianList = Array.isArray(response)
        ? response
        : Array.isArray(response?.users)
        ? response.users
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.technicians)
        ? response.technicians
        : [];
        const mappedData = technicianList.map((item, index) => ({
            id: item.id || item.txid || index + 1,
            fullName: `${item.name || ""} ${item.lastname || ""}`.trim(),
            email: item.email || "-",
            phoneNumber: item.phoneNumber || item.phone_number || "-",
            lineID: item.lineID || item.line_id || "-",
            status:
              item.status ||
              item.technician_status ||
              (item.user_role === 3 ? "ช่างซ่อมบำรุง" : "-"),
            category: item.category || item.technician_category || "-",
          }));
      setTechnicianData(mappedData);
      setCurrentPage(1);
    } catch (error) {
      console.error("ดึงข้อมูลช่างไม่สำเร็จ:", error);
      setTechnicianData([]);
    } finally {
      setIsLoadingTechnicians(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.surname || !formData.email || !formData.password) {
      alert("กรุณากรอกชื่อ นามสกุล อีเมล และรหัสผ่าน");
      return;
    }

    if (!formData.status) {
      alert("กรุณาเลือกสถานะช่าง");
      return;
    }

    if (!formData.category) {
      alert("กรุณาเลือกหมวดหมู่ช่าง");
      return;
    }

    try {
      setIsSubmitting(true);

      const currentUserProfile = await authService.getUserProfile();

      const payload = {
        name: formData.name.trim(),
        lastname: formData.surname.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim(),
        lineID: formData.lineID.trim(),
        status: formData.status,
        category: formData.category,
        role: 4,
        institution: currentUserProfile?.institution || "อื่นๆ",
        company_name:
          currentUserProfile?.company_name ||
          currentUserProfile?.companyName ||
          "",
        product_key: "a3f31c03c6f614ad",
      };

      await authService.registerTechnician(payload);

      alert("สมัครสมาชิกช่างสำเร็จ");

      await loadTechnicians();
      closeModal();
    } catch (error) {
      console.error("สมัครสมาชิกช่างไม่สำเร็จ:", error);
      alert(error?.message || error?.error || "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFirst = () => setCurrentPage(1);

  const handleLast = () => setCurrentPage(totalPages);

  const iconDocfile = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1"
      stroke="currentColor"
      className="size-20"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );

  return (
    <LayoutTemplateElec>
      <div className="bg-[#091F23] h-screen p-3 text-white">
        <div className="bg-[#0D2428F2] h-full rounded-lg p-3 flex flex-col">
          <div className="flex-1 overflow-hidden flex flex-col">
            <h1 className="text-[1rem] font-medium">รายชื่อช่างซ่อมบำรุงทั้งหมดในระบบ</h1>

            <div className="flex justify-between items-center mt-2 mb-3">
              <p className="text-sm">
                ช่างซ่อมบำรุงทั้งหมด ({technicianData.length}/25)
              </p>

              <button
                  className="text-white bg-[#378436] text-center rounded-md px-3 py-1"
                  onClick={openModal}
                >
                  สมัครสมาชิกสำหรับช่างซ่อม
                </button>
            </div>

            <div className="flex-1 bg-[#102A30] rounded-lg overflow-hidden border border-[#1E3C42]">
              <div className="overflow-auto h-full">
                <table className="w-full text-sm">
                  <thead className="bg-[#16353B] text-white sticky top-0 z-10">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">รูป</th>
                      <th className="text-left px-4 py-3 font-medium">ชื่อ-นามสกุล</th>
                      <th className="text-left px-4 py-3 font-medium">อีเมล</th>
                      <th className="text-left px-4 py-3 font-medium">เบอร์โทร</th>
                      <th className="text-left px-4 py-3 font-medium">Line ID</th>
                      <th className="text-left px-4 py-3 font-medium">สถานะ</th>
                      <th className="text-left px-4 py-3 font-medium">หมวดหมู่</th>
                    </tr>
                  </thead>

                  <tbody>
                    {isLoadingTechnicians ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-10 text-center text-gray-300">
                          กำลังโหลดข้อมูลช่าง...
                        </td>
                      </tr>
                    ) : currentData.length > 0 ? (
                      currentData.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-[#1E3C42] hover:bg-[#14333A]"
                        >
                          <td className="px-4 py-3">
                            <div className="w-10 h-10 rounded-full bg-[#22464F] flex items-center justify-center overflow-hidden">
                              <span className="text-gray-200">{iconDocfile}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{item.fullName || "-"}</td>
                          <td className="px-4 py-3">{item.email || "-"}</td>
                          <td className="px-4 py-3">{item.phoneNumber || "-"}</td>
                          <td className="px-4 py-3">{item.lineID || "-"}</td>
                          <td className="px-4 py-3">{item.status || "-"}</td>
                          <td className="px-4 py-3">{item.category || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-10 text-center text-gray-400">
                          ยังไม่มีข้อมูลช่างในบริษัท
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="text-sm text-gray-300">
                หน้า {currentPage} / {totalPages}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleFirst}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-[#1B3E45] disabled:opacity-40"
                >
                  หน้าแรก
                </button>
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-[#1B3E45] disabled:opacity-40"
                >
                  ก่อนหน้า
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-[#2E7C8A] text-white"
                          : "bg-[#1B3E45] text-white"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-[#1B3E45] disabled:opacity-40"
                >
                  ถัดไป
                </button>
                <button
                  onClick={handleLast}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-[#1B3E45] disabled:opacity-40"
                >
                  หน้าสุดท้าย
                </button>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#091F23] p-6 rounded-lg w-full max-w-2xl">
            <h1 className="text-xl text-center mb-4">สมัครสมาชิกสำหรับช่างซ่อม</h1>

            <form onSubmit={handleSubmit} className="grid gap-2">
              <div className="flex justify-start items-center mb-3">
                <img
                  src={selectedImage || "https://placehold.co/200x200"}
                  alt="Selected"
                  className="w-16 h-16 object-cover mr-4 rounded-full"
                />

                <div className="grid gap-1">
                  <p>รูปภาพ</p>
                  <label
                    htmlFor="file"
                    className="grid cursor-pointer px-2 py-1 bg-[#31515C] rounded-md"
                  >
                    เปลี่ยนรูปภาพใหม่
                    <input
                      type="file"
                      id="file"
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-y border-[#0B3F48] py-2">
                <div>
                  <label className="block text-white">ชื่อ</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded-md bg-[#122B30] text-white"
                    placeholder="ชื่อ"
                  />
                </div>

                <div>
                  <label className="block text-white">นามสกุล</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded-md bg-[#122B30] text-white"
                    placeholder="นามสกุล"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white">อีเมล</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md bg-[#122B30] text-white"
                  placeholder="example@gmail.com"
                />
              </div>

              <div>
                <label className="block text-white">รหัสผ่าน</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md bg-[#122B30] text-white"
                  placeholder="กรอกรหัสผ่าน"
                />
              </div>

            

              <div>
                <label className="block text-white">หมายเลขโทรศัพท์</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md bg-[#122B30] text-white"
                  placeholder="088-123-4567"
                />
              </div>

              <div>
                <label className="block text-white">ID Line</label>
                <input
                  type="text"
                  name="lineID"
                  value={formData.lineID}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md bg-[#122B30] text-white"
                  placeholder="Technician01"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 border-y p-3 border-[#0B3F48]">
                <div>
                  <label className="block text-white">สถานะช่างซ่อมบำรุง</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded-md bg-[#122B30] text-white"
                  >
                    <option value="">โปรดเลือกสถานะ</option>
                    {TECHNICIAN_STATUS_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white">หมวดหมู่ช่าง</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded-md bg-[#122B30] text-white"
                  >
                    <option value="">โปรดเลือกหมวดหมู่ช่าง</option>
                    {TECHNICIAN_CATEGORY_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-3">
                <button
                  type="button"
                  className="bg-gray-500 text-white rounded-md px-4 py-2"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="bg-green-500 text-white rounded-md px-4 py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "ตกลง"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </LayoutTemplateElec>
  );
}