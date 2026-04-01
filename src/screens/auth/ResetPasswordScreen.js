import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input, Button, Spinner } from "@material-tailwind/react";
import authService from "../../services/authService"; 
import AuthLayout from "../../layouts/AuthLayout";
import ImageBimDatabase from '../../assets/app/auth/images/bim-database-black.svg';

const PasswordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/;

const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ดึง token จาก URL
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!token) {
      setMessage("Invalid or missing reset token.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, data.newPassword); 

      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error) {
      setMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const newPassword = watch("newPassword");

  return (
    <AuthLayout>
      <div className="flex flex-col items-center pt-20">
      <img
          src={ImageBimDatabase}
          alt="BIM Database Logo"
          className="mb-6 w-80"
        />
        <h1 className="text-3xl font-bold mb-4">รีเซ็ตรหัสผ่าน</h1>
        <p className="mb-6 text-gray-700">โปรดกรอกรหัสผ่านใหม่ของคุณ</p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-96 flex flex-col space-y-4">
          {message && <p className="text-red-500">{message}</p>}

          <div className="relative">
            <Input
              {...register("newPassword", {
                required: "กรุณากรอกรหัสผ่านใหม่",
                pattern: {
                  value: PasswordRegExp,
                  message:
                    "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร, ตัวพิมพ์ใหญ่, ตัวพิมพ์เล็ก, ตัวเลข และอักขระพิเศษ",
                },
              })}
              type="password"
              size="lg"
              color="gray"
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              placeholder="รหัสผ่านใหม่"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="relative">
            <Input
              {...register("confirmNewPassword", {
                required: "โปรดยืนยันรหัสผ่าน",
                validate: (value) => value === newPassword || "รหัสผ่านไม่ตรงกัน",
              })}
              type="password"
              size="lg"
              color="gray"
              autoCapitalize="none"
              autoCorrect="off"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              placeholder="ยืนยันรหัสผ่านใหม่"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>
            )}
          </div>

          <div className="relative">
            <Button type="submit" size="lg" className="py-3 font-bold bg-black text-white w-full" disabled={loading}>
              {loading ? <Spinner /> : "รีเซ็ตรหัสผ่าน"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordScreen;
