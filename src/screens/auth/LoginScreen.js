import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import authService from "../../services/authService";

// นำเข้า Layout
import AuthLayout from "../../layouts/AuthLayout";
import ImageBimDatabase from "../../assets/app/auth/images/bim-database-black.svg";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [doing, setDoing] = useState(false);
  const [done, setDone] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (payload) => {
    setDoing(true);
    setErrorMessage(null);

    try {
      const data = await authService.login(
        payload.email.trim(),
        payload.password
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setDone(true);
      navigate("/workbench"); // Redirect to Dashboard after login
    } catch (error) {
      setErrorMessage(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setDoing(false);
    }
  };

  return (
    <AuthLayout>
      {/* Form Container */}
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">
          ยินดีต้อนรับเข้าสู่การใช้งาน
        </h1>

        {/* Logo BIM Database */}
        <img
          src={ImageBimDatabase}
          alt="BIM Database"
          className="w-60 mx-auto mb-6"
        />

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-5"
        >
          {errorMessage && (
            <div className="p-3 text-red-600 bg-red-100 rounded">
              {errorMessage}
            </div>
          )}

          {/* Email Field */}
          <div className="text-left">
            <label className="block text-gray-700 text-sm font-medium">
              อีเมล
            </label>
            <Input
              {...register("email", { required: true })}
              placeholder="ระบุอีเมล"
              type="email"
              size="lg"
              className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Password Field */}
          <div className="text-left relative">
            <label className="block text-gray-700 text-sm font-medium">
              รหัสผ่าน
            </label>
            <div className="relative">
              <Input
                {...register("password", { required: true })}
                placeholder="ระบุรหัสผ่าน"
                type={isPasswordVisible ? "text" : "password"}
                size="lg"
                className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {isPasswordVisible ? (
                  <HiEyeSlash size={22} />
                ) : (
                  <HiEye size={22} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end relative z-50">
            <button
              type="button"
              className="text-sm text-gray-600 hover:underline"
              onClick={() => navigate("/auth/forgot-password")}
            >
              ลืมรหัสผ่าน?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            fullWidth
            className="bg-orange-500 text-white font-semibold py-3"
            disabled={doing || done}
          >
            เข้าสู่ระบบ
          </Button>

          {/* Register Link */}
          <div className="flex justify-center space-x-2 text-sm mt-4">
            <span>ไม่เคยมีบัญชี?</span>
            <button
              type="button"
              className=" hover:underline font-medium"
              onClick={() => navigate("/auth/check-mail")}
            >
              ลงทะเบียน
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginScreen;
