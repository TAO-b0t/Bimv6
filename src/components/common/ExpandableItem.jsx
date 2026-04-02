import { useState, useEffect } from "react";

export default function ExpandableSection({
  title,
  children,
  icon,
  expanded,
  onToggle, 
  initialExpanded = false,
  marginAuto = false,
}) {
  const [internalExpanded, setInternalExpanded] = useState(initialExpanded);
  
  const isExpanded = expanded !== undefined ? expanded : internalExpanded;
  const handleToggle = onToggle || (() => setInternalExpanded(!internalExpanded));

  return (
    <div className="w-full">
      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-3 w-full py-2 px-4 rounded-lg transition group
          ${isExpanded ? "bg-blue-900 text-white" : "text-blue-900 hover:bg-blue-900 hover:text-white"}
        `}
      >
        <div
          className={`
            shrink-0 transition-colors
            ${isExpanded ? "text-white" : "text-blue-900 group-hover:text-white"}
          `}
        >
          {icon}
        </div>

        <span className="text-sm flex-1 text-left">{title}</span>

        <p 
          className={`
            transition-transform duration-300 
            ${marginAuto ? "ml-auto" : "ml-2"} 
            ${isExpanded ? "rotate-180" : ""}
          `}
        >
          ▾
        </p>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded
            ? "opacity-100 translate-y-0 max-h-[1000px]" 
            : "opacity-0 -translate-y-5 max-h-0"
        }`}
      >
        <div className="pt-1 flex flex-col gap-1">
          {children}
        </div>
      </div>
    </div>
  );
}