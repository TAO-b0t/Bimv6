import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import SidebarmenuDoc from "../../components/container/SidebarmenuDoc";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/titleSlice";
import LayoutTemplateElec from "../../components/container/LayoutTemplateElec";
import authService from "../../services/authService.js";
import documentService from "../../services/documentService";
import { useNavigate } from "react-router-dom";

export default function Documents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeB, setActiveB] = useState("template");
  const [editorContent, setEditorContent] = useState("");
  const [user, setUser] = useState(null);
  const [latestFile, setLatestFile] = useState(null);
  const [currentFileName, setCurrentFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    dispatch(setTitle("เอกสารอิเล็กทรอนิกส์"));
  }, [dispatch]);

  useEffect(() => {
    authService
      .getUserProfile()
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("โหลดข้อมูลผู้ใช้ไม่สำเร็จ:", err.message || err);
      });
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      if (!user?.company_name && !user?.companyName) return;

      const companyName = user.company_name || user.companyName;
      const data = await documentService.getDocuments(companyName);

      const mapped = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id,
            docNumber: item.doc_number,
            name: item.name,
            type: item.type,
            date: item.date,
            time: item.time,
            recipient: item.recipient,
            companyName: item.company_name,
            contentKey: item.content_key,
            url: item.url,
          }))
        : [];

      setFiles(mapped);

      if (mapped.length > 0) {
        const firstDoc = mapped[0];
        setLatestFile(firstDoc);
        setCurrentFileName(firstDoc.docNumber);

        const contentRes = await documentService.getDocumentContent(
          firstDoc.docNumber
        );
        setEditorContent(contentRes?.content || "");
      } else {
        setLatestFile(null);
        setEditorContent("");
      }
    } catch (error) {
      console.error("โหลดเอกสารไม่สำเร็จ:", error);
      Swal.fire("ผิดพลาด", "ไม่สามารถโหลดเอกสารได้", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const handleFileClick = async (file) => {
    try {
      setLoading(true);
      setLatestFile(file);
      setCurrentFileName(file.docNumber);

      const contentRes = await documentService.getDocumentContent(file.docNumber);
      setEditorContent(contentRes?.content || "");
    } catch (error) {
      console.error("โหลดเนื้อหาเอกสารไม่สำเร็จ:", error);
      Swal.fire("ผิดพลาด", "ไม่สามารถโหลดเนื้อหาเอกสารได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!editorContent) {
      Swal.fire("Error!", "กรุณากรอกข้อมูลก่อนบันทึก", "error");
      return;
    }

    const { value: fileName } = await Swal.fire({
      title: "บันทึกเอกสาร",
      input: "text",
      inputLabel: "กรุณากรอกชื่อไฟล์",
      inputPlaceholder: "ชื่อไฟล์...",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
    });

    if (!fileName) return;

    try {
      const blob = new Blob([editorContent], { type: "text/html" });
      const formData = new FormData();
      formData.append("file", blob, `${fileName}.html`);
      formData.append("fileName", fileName);
      formData.append("type", "ประเภท 1");
      formData.append("recipient", "บุคคล A");
      formData.append("companyName", user?.company_name || user?.companyName || "");

      const res = await documentService.createDocument(formData);

      Swal.fire({
        title: "สำเร็จ",
        text: "บันทึกไฟล์สำเร็จ",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchDocuments();
      navigate(`/Documents/${res.doc_number || fileName}`);
    } catch (error) {
      console.error("บันทึกเอกสารไม่สำเร็จ:", error);
      Swal.fire("ไม่สำเร็จ!", "บันทึกไฟล์ไม่สำเร็จ", "error");
    }
  };

  const handleSaveEditDocument = async () => {
    if (!currentFileName) {
      Swal.fire("แจ้งเตือน", "กรุณาเลือกเอกสารก่อน", "warning");
      return;
    }

    try {
      await documentService.updateDocument(currentFileName, {
        content: editorContent,
      });

      Swal.fire({
        title: "สำเร็จ",
        text: "บันทึกการแก้ไขสำเร็จ",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchDocuments();
    } catch (error) {
      console.error("อัปเดตเอกสารไม่สำเร็จ:", error);
      Swal.fire("ไม่สำเร็จ!", "บันทึกไฟล์ไม่สำเร็จ", "error");
    }
  };

  const iconDocfile = (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.5 1.5H9.5C6.69975 1.5 5.2996 1.5 4.23005 2.02075C3.28923 2.4788 2.52432 3.2097 2.04497 4.10871C1.5 5.13073 1.5 6.46865 1.5 9.14444V36.8556C1.5 39.5313 1.5 40.8694 2.04497 41.8913C2.52432 42.7903 3.28923 43.5213 4.23005 43.9792C5.2996 44.5 6.69975 44.5 9.5 44.5H28.5C31.3003 44.5 32.7005 44.5 33.77 43.9792C34.7108 43.5213 35.4757 42.7903 35.955 41.8913C36.5 40.8694 36.5 39.5313 36.5 36.8556V15.8333M21.5 1.5L36.5 15.8333M21.5 1.5V12.0111C21.5 13.349 21.5 14.018 21.7725 14.529C22.0122 14.9785 22.3945 15.3439 22.865 15.573C23.3997 15.8333 24.0998 15.8333 25.5 15.8333H36.5" stroke="white" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <LayoutTemplateElec>
      <div className="flex">
        <SidebarmenuDoc
          setactiveB={setActiveB}
          latestFile={files}
          onFileClick={handleFileClick}
          activeB={activeB}
        />

        {loading ? (
          <div className="flex justify-center items-center w-[100%] h-[93.8vh] bg-[#0B3F48]">
            <div className="text-white font-semibold">กำลังโหลด...</div>
          </div>
        ) : (
          activeB === "template" ? (
            <div style={{ width: "79%", height: "89.1vh" }}>
              {latestFile ? (
                <>
                  <Editor
                    apiKey="nea71dfu8bcpfd9hm3zvqqxuk7c2yfnqwhp5io1veuznxhhr"
                    value={editorContent}
                    init={{
                      height: "100%",
                      plugins:
                        "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                      toolbar:
                        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                    }}
                    onEditorChange={(content) => setEditorContent(content)}
                  />
                  <div className="w-full bg-[#0B3F48] p-2 gap-2 flex justify-end">
                    <button
                      className="bg-[#378436] text-center rounded-md py-1 px-3 text-white"
                      onClick={handleSaveDocument}
                    >
                      บันทึกเอกสาร
                    </button>
                    <button
                      className="bg-[#378436] text-center rounded-md py-1 px-3 text-white"
                      onClick={handleSaveEditDocument}
                    >
                      บันทึกเอกสารการแก้ไข
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center w-[100%] h-[93.8vh] bg-[#0B3F48]">
                  <div className="grid gap-1 justify-center text-center items-center text-white">
                    <div className="mx-auto">{iconDocfile}</div>
                    <p className="font-semibold text-xl">ไม่พบข้อมูลเอกสาร</p>
                    <p className="text-sm" style={{ opacity: 0.7 }}>
                      เริ่มต้นการใช้งานโดยเลือกเทมเพลตเอกสาร
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ width: "79%", height: "89.1vh" }}>
              <Editor
                apiKey="nea71dfu8bcpfd9hm3zvqqxuk7c2yfnqwhp5io1veuznxhhr"
                value={editorContent}
                init={{
                  height: "100%",
                  plugins:
                    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                }}
                onEditorChange={(content) => setEditorContent(content)}
              />
              <div className="w-full bg-[#0B3F48] gap-2 p-2 flex justify-end mt-auto">
                <button
                  className="bg-[#378436] text-center rounded-md py-1 px-3 text-white"
                  onClick={handleSaveDocument}
                >
                  บันทึกเอกสาร
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </LayoutTemplateElec>
  );
}