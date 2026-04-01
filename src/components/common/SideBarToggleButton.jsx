import { useState } from "react";

export default function SideBarToggleButton({
  title,
  icon,
  isChild,
  active = false,
  onClick,
}) {
  const [isClicked, setIsClicked] = useState(active);

  const handleClick = () => {
    // เรียก onClick จาก props ถ้ามี
    if (onClick) {
      onClick(); // ใช้กับ Logout ได้เลย
    } else {
      // toggle สีปุ่ม ถ้าไม่มี onClick
      setIsClicked((prev) => !prev);
    }
  };

  // return (
  //     <button
  //         onClick={handleClick}
  //         className={`w-full flex flex-row sidebar-button ${isChild ? "h-[2.125em] font-light" : ""}
  //         ${isClicked ? "bg-sidebar-button text-amber-orange"
  //             : "text-white"
  //         }`}
  //     >
  //         <div className="w-full flex flex-roj">
  //             {img && <img src={img} alt="svg" className={`mr-3 ${isChild ? "ml-3" : ""}`} />}
  //             {title}
  //         </div>
  //     </button>
  return (
    <button
      onClick={onClick}
      className={`
            flex items-center gap-3 w-full py-2 px-4 rounded-lg transition
            ${active ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-900 hover:text-white"}
            ${isChild ? "pl-8" : ""}
          `}
    >
      <div
        className={`shrink-0 ${active ? "text-[#f1a533]" : "text-gray-400"}`}
      >
        {icon}
      </div>
      <span className="text-sm">{title}</span>
    </button>
  );
}
