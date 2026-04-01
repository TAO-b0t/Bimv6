import { useState } from "react";

export default function ExpandableSection({
  title,
  children,
  img,
  initialExpanded = false,
  marginAuto = false,
}) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="w-full">
      <button
        onClick={toggleExpand}
        className={`w-full flex flex-row sidebar-button
                ${isExpanded ? "bg-sidebar-button text-amber-white" : "text-blue-900"}`}
      >
        {img && <img src={img} alt="svg" className="mr-3" />}
        {title}
        <p className={marginAuto ? `ml-auto` : `ml-2`}>▾</p>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded
            ? "opacity-100 translate-y-0 max-h-[500px]" // Expanded state
            : "opacity-0 -translate-y-5 max-h-0" // Collapsed state
        }`}
      >
        <div className="transition-opacity duration-700 pt-2.5 flex flex-col gap-2.5">
          {children}
        </div>
      </div>
    </div>
  );
}
//{isExpanded && <div className="">{children}</div>}
