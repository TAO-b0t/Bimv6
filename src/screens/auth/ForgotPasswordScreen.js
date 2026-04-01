import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import authService from "../../services/authService"; 
import cogoToast from "@dsdeepak17/cogo-toast";
import { Button, Input, Spinner } from "@material-tailwind/react";
import { isEmail } from "class-validator";
import { useForm } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";
import ImageBimDatabase from "../../assets/app/auth/images/bim-database-black.svg";

const ForgotPasswordScreen = () => {
  const [doing, setDoing] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (data) => {
    setDoing(true);
    setErrorMessage(null);
  
    try {
      await authService.forgotPassword(data.email.trim());
  
      setDone(true);
      cogoToast.success(
        <span>
          ระบบได้ส่งลิงค์ทำรายการไปยังอีเมลของคุณแล้ว <br />
          กรุณาตรวจสอบเพื่อดำเนินการต่อ
        </span>
      );
    } catch (error) {
      if (error.status === 404) {
        setErrorMessage(
          <span>ไม่พบข้อมูลของคุณในระบบ กรุณาตรวจสอบและลองใหม่อีกครั้ง</span>
        );
      } else {
        cogoToast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setDoing(false);
    }
  };
  

  return (
    <AuthLayout>
      <div className="flex flex-col items-center pt-20">
        <img
          src={ImageBimDatabase}
          alt="BIM Database Logo"
          className="mb-6 w-80"
        />
        <h1 className="mb-2 text-center text-3xl font-bold">
          หากท่านลืมรหัสผ่านเข้าสู่ระบบ ?
        </h1>
        <h2 className="mb-6 text-center text-black">
          ไม่ต้องกังวล เราจะส่งคำแนะนำการรีเซ็ตให้คุณ
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-96 flex flex-col space-y-4"
        >
          <div className="relative">
            <Input
              {...register("email", {
                required: true,
                maxLength: 300,
                validate: (v) => !!v.trim() && isEmail(v.trim()),
              })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              size="lg"
              color="gray"
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              maxLength={300}
              error={!!errors.email}
              className="peer border border-gray-300 rounded-md px-3 py-2 w-full"
            />
            <label
              className={`
                absolute left-3 text-gray-500 transition-all 
                ${email ? "top-0 text-sm" : "top-3 text-base text-gray-400"}
              `}
            >
              อีเมล
            </label>
          </div>

          <div className="relative">
            <Button
              type="submit"
              size="lg"
              className="py-3 font-bold bg-black text-white w-full"
              disabled={doing || done}
            >
              รีเซ็ตรหัสผ่าน
            </Button>
            {doing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </div>
            )}
          </div>
          <div className="flex flex-row items-center justify-center space-x-2 text-sm text-gray-700">
            <GoArrowLeft size={16} className="text-black" />
            <Link to="/auth/login" className="underline">
              กลับไปยังหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;
