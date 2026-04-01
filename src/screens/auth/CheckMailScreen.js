import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Spinner } from '@material-tailwind/react';
import { MdOutlineEmail } from 'react-icons/md';
import { GoArrowLeft } from 'react-icons/go';
import { useForm } from 'react-hook-form';
import authService from '../../services/authService';
import AuthLayout from '../../layouts/AuthLayout'; 
import ImageBimDatabase from '../../assets/app/auth/images/bim-database-black.svg';
import cogoToast from "@dsdeepak17/cogo-toast"; 

const CheckMailScreen = () => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [doing, setDoing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '' },
  });

  /**
   *  Email Validation (Regex)
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email regex
    return emailRegex.test(email) || 'รูปแบบอีเมลไม่ถูกต้อง';
  };

  /**
   *  Handles email submission
   * @param {Object} data - Form data containing email
   */
  const _submit = async (data) => {
    setDoing(true);
    setErrorMessage("");
  
    try {
      const response = await authService.checkEmail(data.email.trim());
  
      if (response.message === "Email is available") {
        localStorage.setItem("registerEmail", data.email.trim());
  
        cogoToast.success(" Email ไม่ซ้ำกับในระบบ! กำลังนำไปยังหน้าลงทะเบียน...", {
          position: "top-center",
          hideAfter: 2, 
        });
  
        setTimeout(() => {
          navigate("/auth/register");
        }, 1000); 
      }
    } catch (error) {
      cogoToast.error(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่", {
        position: "top-center",
        hideAfter: 3,
      });
      setErrorMessage(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setDoing(false);
    }
  };
  
  

  /**
   *  Shows the email form when clicked
   */
  const _verify = () => {
    setIsShowForm(true);
  };

  return (
    <AuthLayout> 
      <div className="flex flex-col items-center pt-20">
        {/* โลโก้ */}
        <img src={ImageBimDatabase} alt="BIM Database" className="mb-6 w-100" />

        {/* หัวข้อ */}
        <h1 className="mb-2 text-center text-[2rem] font-semibold">ตรวจสอบอีเมล</h1>

        {/* คำอธิบาย */}
        <h2 className="mb-8 text-gray-700 text-sm">ตรวจสอบระบบกลางเพื่อให้ผู้ใช้ ง่ายต่อการเข้าถึง</h2>

        {/* Email Verification Form */}
        <form onSubmit={handleSubmit(_submit)} className="flex w-full max-w-md flex-col space-y-6">
          {isShowForm ? (
            <>
              {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

              {/* Email Input */}
              <Input
                {...register('email', {
                  required: 'กรุณากรอกอีเมล',
                  maxLength: 300,
                  validate: validateEmail, // Uses custom function for validation
                })}
                label=""
                placeholder="ระบุอีเมล"
                type="email"
                size="lg"
                color="gray"
                autoFocus={true}
                autoCapitalize="none"
                autoCorrect="off"
                maxLength={300}
                error={!!errors.email}
                className="w-full"
              />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}

              {/* Submit Button - Black with White Text */}
              <div className="relative">
                <Button type="submit" size="lg" fullWidth className="bg-black text-white font-semibold tracking-wide py-3" disabled={doing}>
                  ลงทะเบียน
                </Button>
                {doing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner />
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button
              type="button"
              size="lg"
              fullWidth
              className="bg-black text-white font-semibold tracking-wide flex flex-row items-center justify-center py-3 space-x-2"
              onClick={_verify}
            >
              <MdOutlineEmail size={22} />
              <span>เชื่อมต่อกับอีเมลของท่าน</span>
            </Button>
          )}

          {/* Back to Login */}
          <div className="flex flex-row items-center justify-center space-x-2 text-[0.938rem]">
            <GoArrowLeft size={16} className="text-black" />
            <button onClick={() => navigate('/auth/login')} className="text-black underline">
              กลับไปยังหน้าเข้าสู่ระบบ
            </button>
          </div>
        </form>

       
      </div>
    </AuthLayout>
  );
};

export default CheckMailScreen;
