import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import cogoToast from "@dsdeepak17/cogo-toast";
import { Button, Checkbox } from "@material-tailwind/react";
import authService from "../../services/authService";
import ImageBackground from "../../assets/app/auth/images/register.png";
import ImageTrident from "../../assets/app/auth/images/trident.svg";

const institutions = [
  "หน่วยงานโรงพยาบาล",
  "หน่วยงานก่อสร้าง",
  "มหาวิทยาลัย",
  "อื่นๆ",
];

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [doing, setDoing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    institution: "",
    companyName: "",
    email: "", 
    password: "",
    cPassword: "",
    productKey: "",
    isConfirmed: false,
  });
  useEffect(() => {
    const savedEmail = localStorage.getItem("registerEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/;

  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setDoing(true);
      
        if (!formData.isConfirmed) {
          cogoToast.error("กรุณายืนยันการลงทะเบียน");
          setDoing(false);
          return;
        }
      
        if (!passwordRegex.test(formData.password)) {
          cogoToast.error("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวใหญ่ ตัวเล็ก ตัวเลข และอักขระพิเศษ");
          setDoing(false);
          return;
        }
      
        if (formData.password !== formData.cPassword) {
          cogoToast.error("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
          setDoing(false);
          return;
        }
      
        try {
          const requestData = {
            name: formData.firstName,     
            lastname: formData.lastName,   
            institution: formData.institution,
            company_name: formData.companyName,
            email: formData.email,
            password: formData.password,
            product_key: formData.productKey, 
          };
            
          const response = await authService.register(requestData);
      
          cogoToast.success("ลงทะเบียนสำเร็จ!");
          localStorage.removeItem("registerEmail"); 
          navigate("/auth/login");
        } catch (error) {
          console.error("❌ Registration Error:", error); 
          cogoToast.error(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
        } finally {
          setDoing(false);
        }
      };
      
    

  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${ImageBackground})` }}
    >
      <div className="flex w-full max-w-xl flex-col rounded-xl bg-white pb-12 shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/auth/login")}
            className="flex items-center text-lg font-semibold text-gray-800"
          >
            ◀ <span className="ml-2">ย้อนกลับ</span>
          </button>
          <img src={ImageTrident} alt="Trident Logo" className="w-30 h-30" />
        </div>

        <h1 className="mb-6 text-center text-2xl font-semibold">
          ลงทะเบียนเข้าใช้งานระบบ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex space-x-4">
          {["firstName", "lastName"].map((field, index) => (
  <div key={index} className="relative w-full">
    <input
      name={field}
      type="text"
      className="peer w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
      placeholder=""
      value={formData[field]} 
      onChange={handleChange}
      required
    />
    <label
      className={`absolute left-3 transition-all text-gray-500 ${
        formData[field] ? "top-1 text-xs text-black" : "top-1/2 text-sm -translate-y-1/2"
      } peer-focus:top-1 peer-focus:text-xs peer-focus:text-black`}
    >
      {field === "firstName" ? "ชื่อ" : "นามสกุล"}
    </label>
  </div>
))}

          </div>
<div className="relative w-full">
            <input name="email" type="email" className="peer w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none bg-gray-100" value={formData.email} disabled />
            <label className="absolute left-3 top-1 text-xs text-gray-600">อีเมล (ล็อกไว้จากการตรวจสอบ)</label>
          </div>
          <div className="relative w-full">
            <select
              name="institution"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
              value={formData.institution}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                เลือกหน่วยงาน
              </option>
              {institutions.map((institution, index) => (
                <option key={index} value={institution}>
                  {institution}
                </option>
              ))}
            </select>
          </div>

          {["companyName", "password", "cPassword", "productKey"].map(
            (field, index) => (
              <div key={index} className="relative w-full">
                <input
                  name={field}
                  type={
                    field === "password" || field === "cPassword"
                      ? "password"
                      : "text"
                  }
                  className={`peer w-full border ${
                    formData.password !== formData.cPassword &&
                    field === "cPassword"
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none`}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
                <label
                  className={`absolute left-3 transition-all text-gray-500 ${
                    formData[field] ? "top-1 text-xs text-black" : "top-3 text-sm"
                  } peer-focus:top-1 peer-focus:text-xs peer-focus:text-black`}
                >
                  {field === "companyName"
                    ? "ชื่อบริษัท"
                    : field === "password"
                    ? "รหัสผ่าน"
                    : field === "cPassword"
                    ? "ยืนยันรหัสผ่าน"
                    : "รหัสผลิตภัณฑ์"}
                </label>
                {formData.password !== formData.cPassword &&
                  field === "cPassword" && (
                    <p className="text-red-500 text-xs mt-1">
                      รหัสผ่านไม่ตรงกัน
                    </p>
                  )}
              </div>
            )
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              name="isConfirmed"
              checked={formData.isConfirmed}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <span className="text-gray-700 text-lg font-medium">
              ยืนยันการลงทะเบียน
            </span>
          </div>

          {/* แสดงข้อความแจ้งเตือนหากไม่ได้ติ๊ก Checkbox */}
          {!formData.isConfirmed && (
            <p className="text-red-500 text-xs mt-1">กรุณายืนยันการลงทะเบียน</p>
          )}

          {/* ปุ่มกดยืนยัน */}
          <Button
            type="submit"
            size="lg"
            fullWidth
            className="bg-black text-white font-semibold text-lg py-4 rounded-lg shadow-md hover:bg-gray-900 transition duration-300"
            disabled={doing || !formData.isConfirmed}
          >
            {doing ? "กำลังดำเนินการ..." : "ยืนยันเพื่อลงทะเบียนผลิตภัณฑ์"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
