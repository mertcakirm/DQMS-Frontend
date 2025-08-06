import React, {useContext, useEffect, useState} from "react";
import {
  changeDocument,
  createDocument,
  getDocumentFromId,
} from "../../API/Documents.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import {
  deleteDocumentAttachment,
  uploadDocumentAttachment,
} from "../../API/DocumentAttachment.js";
import { convertToUTC } from "../../API/convert.js";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import { useSearchParams } from "react-router-dom";
import { DMode } from "../../Helpers/DMode.js";
import FileUpload from "../other/fileUpload.jsx";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../other/UnauthPage.jsx";

const IncidentReportingForm = () => {
  const [fileList, setFileList] = useState([]);
  const [title, setTitle] = useState("");
  const [deletionAttachmentList, setDeletionAttachmentList] = useState([]);
  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);
  const mode = queryParameters.get("mode") ?? DMode.Create;
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

        if (elementTag === "input") {
          if (element.type === "date") value = convertToUTC(value);
          else if (element.type === "checkbox")
            value = element.checked.toString();
        }

        documentFields[fieldName] = value;
      });

      const promiseArray = [];

      if (mode === DMode.Create) {
        const documentId = await createDocument({
          title: title,
          shortName: "document",
          type: DocumentType.Incident,
          department: null,
          fields: documentFields,
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

      window.location.href = "/ramak-kala/takip-listesi";
    })();
  };

  const onRevisionResult = (isRejected) => {
    if (isRejected)
      rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
    else acceptDocumentRevision(data.revision.documentId, data.revision.id);
    window.location.href="/onay-bekleyen-revizyonlar";

  };

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

          if (
            element.tagName.toLowerCase() === "input" &&
            element.type.toLowerCase() === "checkbox"
          )
            element.checked = doc.fields[fieldShortName].value === "true";
          else element.value = doc.fields[fieldShortName].value;
        });
      })();
    }, []);
  }

  return (
    <div className="container-fluid p-5">
      <div className="row justify-content-between">
        <h3 className="col-6 large-title">Ramak Kala Olay Bildirim Formu</h3>
        {mode !== "viewRevision" && (
          <button className="print-btn2 col-1" onClick={handleSubmit}>
            Kaydet
          </button>
        )}
        {mode === "viewRevision" && data != null && (
          <>
            <button
              className="print-btn2 col-1 success-btn-1"
              onClick={() => onRevisionResult(false)}
            >
              Onayla
            </button>
            <button
              className="print-btn2 col-1 danger-btn-1"
              onClick={() => onRevisionResult(true)}
            >
              Reddet
            </button>
          </>
        )}
      </div>

      <div className="row mt-5">
        <div className="col-3">
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <div className="card-header create-doc-card-header">
              Form Bilgileri
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">
                  Doküman Başlığı
                </label>
                <input
                  className="col-12 create-doc-inp"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Adı Soyadı</label>
                <input
                  className="col-12 create-doc-inp"
                  type="text"
                  field-short-name="field1_1"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Görevi</label>
                <input
                  className="col-12 create-doc-inp"
                  type="text"
                  field-short-name="field1_2"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Sicil No</label>
                <input
                  className="col-12 create-doc-inp"
                  type="text"
                  field-short-name="field1_3"
                />
              </div>
              <div className="row justify-content-center col-12 pb-3">
                <label className="col-12 create-doc-p mb-3">
                  T.C. Kimlik No
                </label>
                <input
                  className="col-12 create-doc-inp"
                  maxLength={11}
                  type="text"
                  field-short-name="field1_4"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-9">
          <div className="card">
            <div className="card-header create-doc-card-header">
              Form Bilgileri
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Tarih</label>
                <input
                  className="col-12 create-doc-inp"
                  type="date"
                  field-short-name="date1"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Saat</label>
                <input
                  className="col-12 create-doc-inp"
                  type="time"
                  field-short-name="time1"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Yeri</label>
                <input
                  className="col-12 create-doc-inp"
                  type="text"
                  field-short-name="field2_1"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Tanımı</label>
                <textarea
                  className="col-12 create-doc-textarea"
                  type="text"
                  field-short-name="field2_2"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Kaynağı</label>
                <input
                  className="col-12 create-doc-inp"
                  type="text"
                  field-short-name="field2_3"
                />
              </div>

              <>
                <div className="row justify-content-center pb-3 pt-0">
                  <p className="create-doc-p">Görselleri</p>
                  <FileUpload
                    fileList={fileList}
                    type="image"
                    onUpload={handleFileUpload}
                    onRemove={handleFileRemove}
                    canUpload={[DMode.Create, DMode.Edit].includes(mode)}
                  />
                </div>
              </>
            </div>
          </div>

          <div className="card mt-5">
            <div className="card-header create-doc-card-header">
              Etkilenenler
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row mb-3 justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Açıklama</label>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="fieldtexta1"
                  type="text"
                />
              </div>
              <div
                className="row col-12 p-3 pt-0"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <div className="col-3">
                  <input type="checkbox" field-short-name="check1" />
                  <label className="m-2">Çalışan</label>
                </div>
                <div className="col-3">
                  <input type="checkbox" field-short-name="check2" />
                  <label className="m-2">Müşteri</label>
                </div>
                <div className="col-3">
                  <input type="checkbox" field-short-name="check3" />
                  <label className="m-2">Ziyaretçi</label>
                </div>
                <div className="col-3">
                  <input type="checkbox" field-short-name="check4" />
                  <label className="m-2">Tedarikçi</label>
                </div>
              </div>
              <div
                className="row mb-3 justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Diğer</label>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field2_4"
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className="card mt-5">
            <div className="card-header create-doc-card-header">
              YAPILAN FAALİYETLER
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row mb-3 justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Faaliyet 1</label>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field3_1"
                  type="text"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Faaliyet 2</label>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field3_2"
                  type="text"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Faaliyet 3</label>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field3_3"
                  type="text"
                />
              </div>

              <div
                className="row justify-content-center col-12 p-3">
                <label className="col-12 create-doc-p mb-3">Faaliyet 4</label>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field3_4"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 mt-5 row justify-content-between">
        <div className="col-3 row">
          <label className="col-12 purple-text text-center">
            Bildirimde Bulunan
          </label>
          <input
            className="col-12 create-doc-inp text-center"
            field-short-name="field_f1"
            maxLength={30}
          />
        </div>

        <div className="col-3 row">
          <label className="col-12 purple-text text-center">
            İş Güvenliği Uzmanı
          </label>
          <input
            className="col-12 create-doc-inp text-center"
            field-short-name="field_f2"
            maxLength={30}
          />
        </div>

        <div className="col-3 row">
          <label className="col-12 purple-text text-center">
            Genel Müdür Yardımcısı
          </label>
          <input
            className="col-12 create-doc-inp text-center"
            field-short-name="field_f3"
            maxLength={30}
          />
        </div>

        <div className="col-3 row">
          <label className="col-12 purple-text text-center">Genel Müdür</label>
          <input
            className="col-12 create-doc-inp text-center"
            field-short-name="field_f4"
            maxLength={30}
          />
        </div>
      </div>
    </div>
  );
};

export default IncidentReportingForm;
