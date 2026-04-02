import { useState } from "react";

export default function SideBarLogoutButton({
  title,
  icon,
  isChild,
  active = false,
  onClick,
}) {
  const [isClicked, setIsClicked] = useState(active);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsClicked((prev) => !prev);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
            flex items-center gap-3 w-full py-2 px-4 rounded-lg transition group
            ${active ? "bg-red-500 text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}
            ${isChild ? "pl-8" : ""}
          `}
    >
      <div
        className={`
          shrink-0 transition-colors
          ${active ? "bg-red-500 text-white" : "text-red-500 group-hover:bg-red-500 group-hover:text-white"}
        `}
      >
        {icon}
      </div>
      <span className="text-sm">{title}</span>
    </button>
  );
}
