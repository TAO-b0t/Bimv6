import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayoutTemplateElec from "../../components/container/LayoutTemplateElec";
import authService from "../../services/authService.js";
import { Editor } from "@tinymce/tinymce-react";
import documentService from "../../services/documentService";

export default function DocumentsId() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [documentData, setDocumentData] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authService
      .getUserProfile()
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Failed to load user data:", err.message || err);
      });
  }, []);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        const detail = await documentService.getDocumentById(id);
        const content = await documentService.getDocumentContent(id);

        setDocumentData(detail?.document || detail);
        setEditorContent(content?.content || "");
      } catch (error) {
        console.error("โหลดเอกสารไม่สำเร็จ:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadDocument();
  }, [id]);

  const handleSubmit = () => {
    navigate("/DocHistory");
  };

  const arrow = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#5FA95E" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
    </svg>
  );

  return (
    <LayoutTemplateElec>
      <div className="bg-[#091F23] h-screen text-white">
        <h1>เอกสารใหม่</h1>
        <div className="flex justify-start gap-2 mt-3 p-2">
          <div className="w-[40%]">
            <div className="bg-[#20424E] p-3 rounded-t-lg"><p>เอกสาร</p></div>

            <div style={{ width: "100%", height: "90%" }}>
              <Editor
                apiKey="nea71dfu8bcpfd9hm3zvqqxuk7c2yfnqwhp5io1veuznxhhr"
                value={editorContent}
                init={{
                  height: "100%",
                  readonly: true,
                  toolbar: false,
                  statusbar: false,
                }}
              />
            </div>
          </div>

          <div className="w-[60%]">
            <div className="bg-[#20424E] p-3 rounded-t-lg">
              <p className="text-[#FEA003]">ข้อมูลรายละเอียดเอกสารที่ต้องการแจ้ง</p>
            </div>

            <div className="grid w-full gap-2 p-5">
              <label className="grid w-[200px]">
                วันที่ส่งเอกสาร
                <input
                  type="date"
                  className="bg-[#082E36] p-2 rounded-md h-[40px]"
                  value={documentData?.date?.slice(0, 10) || ""}
                  readOnly
                />
              </label>

              <label className="grid">
                ชื่อเอกสาร
                <input
                  type="text"
                  className="bg-[#082E36] p-2 rounded-md h-[40px]"
                  value={documentData?.name || ""}
                  readOnly
                />
              </label>

              <label className="grid">
                เลขที่เอกสาร
                <input
                  type="text"
                  className="bg-[#082E36] p-2 rounded-md h-[40px]"
                  value={documentData?.doc_number || ""}
                  readOnly
                />
              </label>

              <label className="grid">
                ประเภทเอกสาร
                <input
                  type="text"
                  className="bg-[#082E36] p-2 rounded-md h-[40px]"
                  value={documentData?.type || ""}
                  readOnly
                />
              </label>

              <hr className="border-t-[3.5px] border-[#11323E] my-5" />

              <h1 className="text-xl text-[#FEA003]">ข้อมูลผู้รับเอกสาร</h1>

              <div className="flex gap-2 justify-start items-center w-full text-nowrap">
                <p>ชื่อผู้ส่งเอกสาร</p>
                <input
                  type="text"
                  value={user ? `${user.name} ${user.lastname}` : ""}
                  readOnly
                  className="bg-[#082E36] p-2 rounded-md h-[40px] w-full"
                />
                <div>{arrow}</div>
                <p>ผู้รับเอกสาร</p>
                <input
                  type="text"
                  value={documentData?.recipient || ""}
                  readOnly
                  className="bg-[#082E36] p-2 rounded-md h-[40px] w-full"
                />
              </div>

              <div className="flex justify-end mt-5">
                <button
                  className="bg-[#31515C] hover:bg-[#537986] p-2 rounded-md"
                  onClick={handleSubmit}
                >
                  กลับไปหน้าประวัติ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutTemplateElec>
  );
}