import React from 'react';

// นำเข้ารูปภาพ
import ImageBimDatabase from '../assets/app/auth/images/bim-database-white.svg';
import ImageTrident from '../assets/app/auth/images/trident.svg';
import ImageBackground from '../assets/app/auth/images/background.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full">
      {/* ซ้าย: Background + โลโก้ + ข้อความ */}
      <div 
        className="relative flex w-1/2 min-h-screen bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${ImageBackground})`, backgroundSize: '100% auto' }} // ✅ ปรับพื้นหลังให้กว้างขึ้น
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center px-12 pt-24 pb-8"> {/* ✅ ขยับข้อความขึ้น */}
          {/* โลโก้ BIM Database */}
          <div className="mb-6">
            <img src={ImageBimDatabase} alt="BIM Database" className="w-auto h-auto" />
          </div>

          {/* ข้อความอธิบาย */}
          <p className="text-white text-lg leading-relaxed">
            Bimdatabase is a construction project management platform that
            supports the visualization of digital building information models
            (BIM), helping to increase the efficiency of architecture, interior
            design, and landscape architecture by integrating Digital Twin and
            IoT technologies to provide complete project visibility and precise
            management.
          </p>
        </div>
      </div>

      {/* ขวา: Form (Children) */}
      <div className="flex w-1/2 min-h-screen items-center justify-center bg-white px-16 relative">
        {/* Logo Trident ด้านขวาบน */}
        <div className="absolute top-6 right-12">
          <img src={ImageTrident} alt="Trident Logo" className="w-50 h-50" />  {/* ✅ ปรับขนาดให้พอดี */}
        </div>

        {/* Content (Login, Register, etc.) */}
        {children}

        {/* Footer Copyright */}
        <div className="absolute bottom-8 text-center text-gray-500 text-sm">
          © 2024, Trident Intelligence Service
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
