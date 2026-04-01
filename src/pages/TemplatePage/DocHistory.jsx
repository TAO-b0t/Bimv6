import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LayoutTemplateElec from "../../components/container/LayoutTemplateElec";
import { setTitle } from "../../redux/titleSlice";
import authService from "../../services/authService";
import documentService from "../../services/documentService";

export default function DocHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    dispatch(setTitle("ประวัติเอกสารอิเล็กทรอนิกส์"));
  }, [dispatch]);


  const formatThaiDate = (utcDate) => {
    if (!utcDate) return "-";

    const d = new Date(utcDate);
    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };


  const formatTime = (timeStr) => {
    if (!timeStr) return "-";

    const [time, modifier] = timeStr.split(" ");
    if (!time || !modifier) return timeStr;

    let [hours, minutes, seconds] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = String(Number(hours) + 12);
    }

    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes}:${seconds}`;
  };


  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const user = await authService.getUserProfile();
        const companyName =
          user?.company_name || user?.companyName || "";

        const data = await documentService.getDocuments(companyName);

        console.log("RAW DATA =", data);

        const mapped = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              docNumber: item.doc_number,
              name: item.name,
              type: item.type,
              date: formatThaiDate(item.date),
              time: formatTime(item.time),
              recipient: item.recipient || "-",
            }))
          : [];

        console.log("MAPPED =", mapped);

        setDocuments(mapped);
      } catch (error) {
        console.error("โหลดประวัติเอกสารไม่สำเร็จ:", error);
      }
    };

    loadDocuments();
  }, []);


  const totalPages = Math.ceil(documents.length / itemsPerPage) || 1;

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return documents.slice(start, start + itemsPerPage);
  }, [documents, currentPage]);

  const handleView = (docNumber) => {
    navigate(`/Documents/${docNumber}`);
  };


  return (
    <LayoutTemplateElec>
      <div className="py-4 bg-[#091F23] h-screen flex flex-col">
        <div className="p-3 rounded-md flex-1">
          <div className="text-white mb-3">
            <h1>ประวัติเอกสาร</h1>
            <p className="text-sm">
              หน้าเว็บที่แสดงข้อมูลเกี่ยวกับเอกสารที่เคยส่งผ่านระบบออนไลน์
            </p>
          </div>

          <div className="overflow-x-auto rounded-t-lg h-[60vh]">
            <table className="min-w-full table-auto bg-[#0B3F48] text-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-[#20424E]">
                  <th className="py-2 px-4 text-left">ลำดับ</th>
                  <th className="py-2 px-4 text-left">เลขที่เอกสาร</th>
                  <th className="py-2 px-4 text-left">ชื่อเอกสาร</th>
                  <th className="py-2 px-4 text-left">ประเภทเอกสาร</th>
                  <th className="py-2 px-4 text-left">วันที่ส่งเอกสาร</th>
                  <th className="py-2 px-4 text-left">เวลา</th>
                  <th className="py-2 px-4 text-left">ผู้รับเอกสาร</th>
                  <th className="py-2 px-4 text-left">เมนูเพิ่มเติม</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-[#0f4b56]">
                      <td className="py-2 px-4">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-2 px-4">{item.docNumber}</td>
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{item.type}</td>
                      <td className="py-2 px-4">{item.date}</td>
                      <td className="py-2 px-4">{item.time}</td>
                      <td className="py-2 px-4">{item.recipient}</td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-[#31515C] hover:bg-[#537986] px-3 py-1 rounded-md"
                          onClick={() => handleView(item.docNumber)}
                        >
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-10">
                      ไม่พบข้อมูลเอกสาร
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* pagination */}
        <div className="mt-5 flex justify-center items-center mb-10">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={currentPage === 1}
            >
              {"<"}
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </LayoutTemplateElec>
  );
}