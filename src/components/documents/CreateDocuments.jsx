import "./css/documentGeneral.css";
import React, { useEffect, useState } from "react";
import {
  changeDocument,
  createDocument
} from "../../API/Documents.js";
import {
  deleteDocumentAttachment,
  uploadDocumentAttachment,
} from "../../API/DocumentAttachment.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import { optionsList } from "../../Helpers/unitsHelper.js";
import {
  createDocumentRevision,
} from "../../API/DocumentRevision.js";
import { useSearchParams } from "react-router-dom";
import { DMode } from "../../Helpers/DMode.js";
import FileUpload from "../other/fileUpload.jsx";
import { handleRevisionResult, loadDocumentData } from "../general/loadDocumentData.js";
import DocumentInfoCard from "../general/DocumentInfoCard.jsx";

const CreateDocuments = () => {
  const [fileList, setFileList] = useState([]);
  const [deletionAttachmentList, setDeletionAttachmentList] = useState([]);
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [manuelId, setManuelId] = useState("");
  const filteredValue = optionsList.includes(unit) ? unit : "";
  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);
  const mode = queryParameters.get("mode") ?? DMode.Create;
  const id = queryParameters.get("id");

  useEffect(() => {
    loadDocumentData({
      mode,
      id,
      setters: {
        setData,
        setTitle,
        setUnit,
        setManuelId,
        setFileList,
      }
    });
  }, [mode, id]);


  const handleFileUpload = (event, type) => {
    const files = event.target.files;
    (async () => {
      const promiseArray = Array.from(files).map((file) => new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => {
          const fileName = file.name;
          const fileExtension = fileName.split(".").pop();
          const fileBaseName = fileName.slice(0, -(fileExtension.length + 1));
          const b64File = reader.result.split(",")[1];
          resolve({
            attachmentId: null,
            b64: b64File,
            extension: fileExtension,
            fileName: fileBaseName,
            type,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }));
      setFileList([...fileList, ...(await Promise.all(promiseArray))]);
    })();
  };

  const handleFileRemove = (file) => {
    if (mode === DMode.Edit && file.attachmentId != null)
      setDeletionAttachmentList([...deletionAttachmentList, file.attachmentId]);
    setFileList((prev) => prev.filter((f) => f !== file));
  };

  const handleSubmit = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};
      elements.forEach((element) => {
        documentFields[element.getAttribute("field-short-name")] = element.value;
      });
      const promiseArray = [];
      if (mode === DMode.Create) {
        const documentId = await createDocument({
          title,
          shortName: "document",
          type: DocumentType.Document,
          department: unit,
          fields: documentFields,
          ManuelId: manuelId,
        });
        fileList.forEach((file) =>
            promiseArray.push(uploadDocumentAttachment(documentId, file.b64, file.extension, file.fileName, file.type))
        );
      } else if (mode === DMode.Revise) {
        await createDocumentRevision(id, documentFields);
      } else if (mode === DMode.Edit) {
        await changeDocument(data.id, documentFields);
        fileList
            .filter((f) => f.attachmentId == null)
            .forEach((file) =>
                promiseArray.push(
                    uploadDocumentAttachment(data.id, file.b64, file.extension, file.fileName, file.type)
                )
            );
        deletionAttachmentList.forEach((attachId) =>
            promiseArray.push(deleteDocumentAttachment(data.id, attachId))
        );
      }
      if (promiseArray.length > 0) await Promise.all(promiseArray);
      window.location.href = "/dokuman/listesi";
    })();
  };

  const onRevisionResult = (isRejected) => {
    handleRevisionResult({
      data,
      isRejected,
      redirectUrl: "/dokuman/listesi",
    });
  };

  useEffect(() => {
    if (mode !== DMode.Create && id) {
      loadDocumentData({
        mode,
        id,
        setters: {
          setData,
          setTitle,
          setUnit,
          setManuelId,
          setFileList,
        },

      });
    }
  }, [mode, id]);

  return (
      <div className="container-fluid p-5">
        {/* Üst butonlar */}
        <div className="row justify-content-between">
          <h3 className="col-6 large-title">Doküman Oluşturma</h3>
          <div className="col-6 row justify-content-end" style={{ columnGap: "10px" }}>
            {mode !== "viewRevision" && (
                <button className="col-3 print-btn2" onClick={handleSubmit}>Kaydet</button>
            )}
            {mode === "viewRevision" && data != null && (
                <>
                  <button className="col-3 print-btn2 success-btn-1" onClick={() => onRevisionResult(false)}>Onayla</button>
                  <button className="col-3 print-btn2 danger-btn-1" onClick={() => onRevisionResult(true)}>Reddet</button>
                </>
            )}
          </div>
        </div>

        {/* Form Alanı */}
        <div className="row mt-5">
          <div className="col-4">
            <DocumentInfoCard
                title={title}
                setTitle={setTitle}
                manuelId={manuelId}
                setManuelId={setManuelId}
                unit={unit}
                setUnit={setUnit}
                filteredValue={filteredValue}
            />
          </div>
          <div className="col-8">
            <div className="card">
              <div className="card-header create-doc-card-header">
                Doküman İçeriği
              </div>
              <div className="card-body justify-content-center row">
                <div
                    className="row justify-content-center col-12 p-3"
                    style={{ borderBottom: "1px solid #ccc" }}
                >
                  <p className="create-doc-p">1. AMAÇ</p>
                  <textarea
                      className="col-12 create-doc-textarea"
                      name="purpose"
                      field-short-name="field1"
                      type="text"
                  />
                </div>
                <div
                    className="row justify-content-center col-12 p-3"
                    style={{ borderBottom: "1px solid #ccc" }}
                >
                  <p className="create-doc-p">2. KAPSAM</p>
                  <textarea
                      className="col-12 create-doc-textarea"
                      name="scope"
                      field-short-name="field2"
                      type="text"
                  />
                </div>
                <div
                    className="row justify-content-center col-12 p-3"
                    style={{ borderBottom: "1px solid #ccc" }}
                >
                  <p className="create-doc-p">3. TANIMLAR</p>
                  <textarea
                      className="col-12 create-doc-textarea"
                      name="definitions"
                      field-short-name="field3"
                      type="text"
                  />
                </div>
                <div
                    className="row justify-content-center col-12 p-3"
                    style={{ borderBottom: "1px solid #ccc" }}
                >
                  <p className="create-doc-p">4. SORUMLULUKLAR</p>
                  <textarea
                      className="col-12 create-doc-textarea"
                      name="responsibilities"
                      field-short-name="field4"
                      type="text"
                  />
                </div>
                <div
                    className="row justify-content-center col-12 p-3"
                    style={{ borderBottom: "1px solid #ccc" }}
                >
                  <p className="create-doc-p">5. UYGULAMALAR</p>
                  <textarea
                      className="col-12 create-doc-textarea"
                      name="implementations"
                      field-short-name="field5"
                      type="text"
                  />
                </div>
                {(mode === DMode.Create || mode === DMode.Edit) && (
                    <>
                      <div
                          className="row justify-content-center col-12 p-3"
                          style={{ borderBottom: "1px solid #ccc" }}
                      >
                        <p className="create-doc-p">
                          6. REFERANSLAR VE İLGİLİ UYGULAMALAR
                        </p>

                        <FileUpload
                            fileList={fileList}
                            type="file1"
                            onUpload={handleFileUpload}
                            onRemove={handleFileRemove}
                            canUpload={[DMode.Create, DMode.Edit].includes(mode)}
                        />
                      </div>

                      <div className="row justify-content-center col-12 p-3">
                        <p className="create-doc-p">7. EKLER</p>
                        <FileUpload
                            fileList={fileList}
                            type="file2"
                            onUpload={handleFileUpload}
                            onRemove={handleFileRemove}
                            canUpload={[DMode.Create, DMode.Edit].includes(mode)}
                        />
                      </div>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CreateDocuments;