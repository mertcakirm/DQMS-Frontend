import FileUpload from "../other/fileUpload.jsx";
import React, {useContext, useEffect, useState} from "react";
import {
  changeDocument,
  createDocument,
  getDocumentFromId,
} from "../../API/Documents.js";
import {
  deleteDocumentAttachment,
  uploadDocumentAttachment,
} from "../../API/DocumentAttachment.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import { optionsList } from "../../Helpers/unitsHelper.js";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import { useSearchParams } from "react-router-dom";
import { DMode } from "../../Helpers/DMode.js";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../other/UnauthPage.jsx";

const EmergencyDrill = () => {
  const [fileList, setFileList] = useState([]);
  const [deletionAttachmentList, setDeletionAttachmentList] = useState([]);
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [manuelId, setManuelId] = useState("");
  const filteredValue = optionsList.includes(unit) ? unit : "";

  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;
  const handleFileUpload = (event, type) => {
    const files = event.target.files;

    (async () => {
      const promiseArray = [];

      Array.from(files).forEach((file) => {
        promiseArray.push(
          new Promise((resolve, reject) => {
            if (!file) {
              resolve(null);
              return;
            }

            const reader = new FileReader();

            reader.onload = () => {
              const fileName = file.name;
              const fileExtension = fileName.split(".").pop();
              const fileBaseName = fileName.slice(
                0,
                -(fileExtension.length + 1),
              );
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
          }),
        );
      });

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
        const fieldName = element.getAttribute("field-short-name");
        const elementTag = element.tagName.toLowerCase();
        let value = element.value;

        documentFields[fieldName] = value;
      });

      const promiseArray = [];

      if (mode === DMode.Create) {
        const documentId = await createDocument({
          title: title,
          shortName: "document",
          type: DocumentType.EmergencyDrill,
          department: unit,
          fields: documentFields,
          ManuelId: manuelId,
        });

        fileList.forEach((file) => {
          promiseArray.push(
            uploadDocumentAttachment(
              documentId,
              file.b64,
              file.extension,
              file.fileName,
              file.type,
            ),
          );
        });
      } else if (mode === DMode.Revise) {
        await createDocumentRevision(queryParameters.get("id"), documentFields);
      } else if (mode === DMode.Edit) {
        await changeDocument(data.id, documentFields);

        fileList
          .filter((f) => f.attachmentId == null)
          .forEach((file) =>
            promiseArray.push(
              uploadDocumentAttachment(
                data.id,
                file.b64,
                file.extension,
                file.fileName,
                file.type,
              ),
            ),
          );
        deletionAttachmentList.forEach((attachId) =>
          promiseArray.push(deleteDocumentAttachment(data.id, attachId)),
        );
      }

      if (promiseArray.length > 0) await Promise.all(promiseArray);

      window.location.href = "/dokuman/listesi";
    })();
  };

  const onRevisionResult = (isRejected) => {
    if (isRejected)
      rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
    else acceptDocumentRevision(data.revision.documentId, data.revision.id);
    window.location.href="/onay-bekleyen-revizyonlar";
    
  };

  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);

  // MODE: create, edit, revise, viewRevision
  const mode = queryParameters.get("mode") ?? DMode.Create;

  if (mode !== DMode.Create) {
    const getId = queryParameters.get("id");

    if (!!!getId) return;

    useEffect(() => {
      (async () => {
        let doc = await (mode === DMode.ViewRevision
          ? getRevision(getId)
          : getDocumentFromId(getId, true));

        if (mode !== DMode.ViewRevision)
          doc = {
            ...doc.document,
            attachments: doc.attachments,
            fields: doc.fields,
          };
        else {
          const _tempDoc = await getDocumentFromId(
            doc.revision.documentId,
            false,
          );
          doc = {
            ..._tempDoc.document,
            attachments: _tempDoc.attachments,
            fields: doc.fields,
            revision: doc.revision,
          };
        }

        if (!!!doc) return;

        setData(doc);

        setTitle(doc.title);
        setUnit(doc.department);
        setManuelId(doc.manuelId);

        if (mode === DMode.Edit) {
          setFileList(
            doc.attachments.map((a) => ({
              attachmentId: a.attachmentID,
              b64: null,
              extension: a.extension,
              fileName: a.fileName,
              type: a.type,
            })),
          );
        }

        const elements = document.querySelectorAll("[field-short-name]");
        elements.forEach((element) => {
          const fieldShortName = element.getAttribute("field-short-name");
          element.value = doc.fields[fieldShortName].value;
        });
      })();
    }, []);
  }

  return (
    <div className="container-fluid p-5">
      <div className="row justify-content-between">
        <h3 className="col-6 large-title">
          Acil Durum Tatbikat Değerlendirme Formu
        </h3>
        <div
          className="col-6 row justify-content-end"
          style={{ columnGap: "10px" }}
        >
          {mode !== "viewRevision" && (
            <button className="col-2 print-btn2" onClick={handleSubmit}>
              Kaydet
            </button>
          )}
          {mode === "viewRevision" && data != null && (
            <>
              <button
                className="col-2 print-btn2 success-btn-1"
                onClick={() => onRevisionResult(false)}
              >
                Onayla
              </button>
              <button
                className="col-2 print-btn2 danger-btn-1"
                onClick={() => onRevisionResult(true)}
              >
                Reddet
              </button>
            </>
          )}
          <button className="col-2 print-btn">
            <svg
              width="30"
              height="30"
              viewBox="0 0 86 71"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M57.3333 44.375V56.2084C57.3333 62.125 53.75 65.0834 46.5833 65.0834H39.4167C32.25 65.0834 28.6667 62.125 28.6667 56.2084V44.375M57.3333 44.375H28.6667M57.3333 44.375V53.25H64.5C71.6667 53.25 75.25 50.2917 75.25 44.375V29.5834C75.25 23.6667 71.6667 20.7084 64.5 20.7084H21.5C14.3333 20.7084 10.75 23.6667 10.75 29.5834V44.375C10.75 50.2917 14.3333 53.25 21.5 53.25H28.6667V44.375M60.9167 44.375H25.0833M25.0833 32.5417H35.8333M25.9792 20.7084H60.0208V14.7917C60.0208 8.87502 57.3333 5.91669 49.2708 5.91669H36.7292C28.6667 5.91669 25.9792 8.87502 25.9792 14.7917V20.7084Z"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Yazdır
          </button>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-4">
          <div className="card" style={{ position: "sticky", top: "50px" }}>
            <div className="card-header create-doc-card-header">
              Döküman Bilgileri
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row mb-3 justify-content-center pb-3 col-12 "
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">
                  Doküman Başlığı
                </label>
                <input
                  className="col-12 create-doc-inp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  name="docNum"
                  type="text"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Döküman No</label>
                <input
                  className="col-12 create-doc-inp"
                  type="text"
                  value={manuelId}
                  onChange={(e) => setManuelId(e.target.value)}
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">
                  İlk Yayın Tarihi
                </label>
                <input
                  className="col-12 create-doc-inp"
                  type="date"
                  field-short-name="p1"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">
                  Yürürlük Tarihi
                </label>
                <input
                  className="col-12 create-doc-inp"
                  type="date"
                  field-short-name="p2"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Sayfa No</label>
                <input
                  className="col-12 create-doc-inp"
                  type="number"
                  field-short-name="p3"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 py-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Birim</label>
                <select
                  value={filteredValue}
                  onChange={(e) => setUnit(e.target.value)}
                  className="create-doc-inp"
                >
                  {optionsList.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row justify-content-center p-5 pt-0">
              <p className="create-doc-p">EKLER</p>
              <FileUpload
                fileList={fileList}
                type="file1"
                onUpload={handleFileUpload}
                onRemove={handleFileRemove}
                canUpload={[DMode.Create, DMode.Edit].includes(mode)}
              />
            </div>
          </div>
        </div>

        <div className="col-8">
          <div className="card mb-5">
            <div className="card-header create-doc-card-header">
              Doküman İçeriği
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">1.1.Amaç</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  name="purpose"
                  type="text"
                  field-short-name="field1"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">1.2.Kapsam</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  name="scope"
                  type="text"
                  field-short-name="field2"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">1.3.Yasal Dayanak</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  name="definitions"
                  type="text"
                  field-short-name="field3"
                />
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">2.Süreç</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  name="purpose"
                  type="text"
                  field-short-name="field4"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">3.Acil Durum Tatbikatı</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  name="scope"
                  type="text"
                  field-short-name="field5"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">4.1. Tatbikat Değerlendirmesi</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  name="scope"
                  type="text"
                  field-short-name="field6"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">4.2. Tatbikatın Başarılı Yönleri</p>
                <input
                  className="col-12 create-doc-inp"
                  type="text"
                  field-short-name="field6"
                />
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">4.3. Geliştilecek Yönler</p>
                <input
                  className="col-12 create-doc-inp"
                  type="date"
                  field-short-name="date1"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">4.4. Tespitler ve Eksiklikler</p>
                <input
                  className="col-12 create-doc-inp"
                  type="date"
                  field-short-name="date2"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3">
                <label className="col-12 create-doc-p mb-3">5.Sonuç</label>
                <textarea
                  className="col-12 create-doc-textarea"
                  type="text"
                  field-short-name="field7"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mt-5 row justify-content-between">
          <div className="col-2 row">
            <label className="col-12 purple-text text-center">
              İŞVEREN/VEKİLİ
            </label>
            <input
              className="col-12 create-doc-inp text-center"
              field-short-name="bp-1"
              maxLength={30}
            />
          </div>

          <div className="col-2 row">
            <label className="col-12 purple-text text-center">İSG UZMANI</label>
            <input
              className="col-12 create-doc-inp text-center"
              field-short-name="bp-2"
              maxLength={30}
            />
          </div>

          <div className="col-2 row">
            <label className="col-12 purple-text text-center">
              İŞYERİ HEKİMİ
            </label>
            <input
              className="col-12 create-doc-inp text-center"
              field-short-name="bp-3"
              maxLength={30}
            />
          </div>

          <div className="col-2 row">
            <label className="col-12 purple-text text-center">
              ÇALIŞAN TEMSİLCİSİ
            </label>
            <input
              className="col-12 create-doc-inp text-center"
              maxLength={30}
              field-short-name="bp-4"
            />
          </div>

          <div className="col-2 row">
            <label className="col-12 purple-text text-center">
              DESTEK ELEMANI
            </label>
            <input
              className="col-12 create-doc-inp text-center"
              maxLength={30}
              field-short-name="bp-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDrill;
