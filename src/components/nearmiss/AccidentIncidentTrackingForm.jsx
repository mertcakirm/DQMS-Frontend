import React, {useContext, useEffect, useState} from "react";
import { optionsList } from "../../Helpers/units.js";
import { SvgBin, Svgdoc } from "../documents/generalcomp.jsx";
import { convertToUTC } from "../../API/convert.js";
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
import { DMode } from "../../Helpers/DMode.js";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import { useSearchParams } from "react-router-dom";
import FileUpload from "../other/fileUpload.jsx";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../other/UnauthPage.jsx";

const AccidentIncidentTrackingForm = () => {
  const [fileList, setFileList] = useState([]);
  const [deletionAttachmentList, setDeletionAttachmentList] = useState([]);
  const [witness, setWitness] = useState([
    { control: "", tc: "", staff: "", duty: "", contact: "", reason: "" },
  ]);
  const [unit, setUnit] = useState("");
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

  const addWitnessRow = () => {
    setWitness([
      ...witness,
      { control: "", tc: "", staff: "", duty: "", contact: "", reason: "" },
    ]);
  };

  const removeWitnessRow = (index) => {
    const updatedwitness = witness.filter((_, i) => i !== index);
    setWitness(updatedwitness);
  };

  const handleInputChange = (index, field, value) => {
    const updatedwitness = witness.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setWitness(updatedwitness);
  };


  const filteredValue = optionsList.includes(unit) ? unit : "";

  const handleSubmit = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};
      documentFields["Witness"] = JSON.stringify(witness);

      elements.forEach((element) => {
        const fieldName = element.getAttribute("field-short-name");
        const elementTag = element.tagName.toLowerCase();
        let value = element.value;

        if (elementTag === "input") {
          if (element.type === "date") value = convertToUTC(value);
        }

        documentFields[fieldName] = value;
      });

      const promiseArray = [];

      if (mode === DMode.Create) {
        const documentId = await createDocument({
          title: "Kaza Olay Bildirimi",
          shortName: "document",
          type: DocumentType.AccidentIncident,
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

      window.location.href = "/ramak-kala/kaza-olay-takip";
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
        setWitness(JSON.parse(doc.fields["Witness"].value));

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
      <div
        className="row justify-content-between"
        style={{ padding: "0px 30px" }}
      >
        <h3 className="col-6 large-title">Kaza Olay Takip Bildirim Formu</h3>
        <div
          className="col-4 row justify-content-end"
          style={{ columnGap: "10px" }}
        >
          {mode !== "viewRevision" && (
            <button className="col-3 print-btn2" onClick={handleSubmit}>
              Kaydet
            </button>
          )}
          {mode === "viewRevision" && data != null && (
            <>
              <button
                className="col-3 print-btn2 success-btn-1"
                onClick={() => onRevisionResult(false)}
              >
                Onayla
              </button>
              <button
                className="col-3 print-btn2 danger-btn-1"
                onClick={() => onRevisionResult(true)}
              >
                Reddet
              </button>
            </>
          )}

          <button className="col-3 print-btn">
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
              Kaza Geçiren Personel
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row mb-3 justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">
                  Adı ve Soyadı
                </label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
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
                  name="doctitle"
                  type="text"
                  field-short-name="field1_2"
                />
              </div>
              <div
                className="row justify-content-center col-12 pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Sicil No</label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field1_3"
                />
              </div>
              <div className="row mb-3 justify-content-center col-12 py-3">
                <label className="col-12 create-doc-p mb-3">
                  T.C. Kimlik Numarası
                </label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field1_4"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card" style={{ position: "sticky", top: "50px" }}>
            <div className="card-header create-doc-card-header">
              SGK Kaza Bildirimi
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row mb-3 justify-content-center col-12 py-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">
                  Bildirim Tarihi
                </label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="date"
                  field-short-name="date1"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 py-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Bildirim No</label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="number"
                  field-short-name="field2_1"
                />
              </div>
              <div className="row mb-3 justify-content-center col-12 py-3">
                <label className="col-12 create-doc-p mb-3">Açıklama</label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field2_2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-header create-doc-card-header">
              Kaza Bilgileri
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row mb-3 justify-content-center col-12 py-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Tarih</label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="date"
                  field-short-name="date2"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 py-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">Kaza Yeri</label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field3_1"
                />
              </div>
              <div
                className="row mb-3 justify-content-center col-12 py-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">
                  Olay / Kaza Açıklaması
                </label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field3_2"
                />
              </div>
            </div>

            <div className="row justify-content-center p-5 pt-0">
              <p className="create-doc-p">Kaza Görselleri</p>
              <FileUpload
                fileList={fileList}
                type="image"
                onUpload={handleFileUpload}
                onRemove={handleFileRemove}
                canUpload={[DMode.Create, DMode.Edit].includes(mode)}
              />
            </div>
          </div>
        </div>

        <div className="row pt-3 col-12 my-5">
          <p className="smalltitle col-6">Şahitler</p>
          <div className="col-6 row justify-content-end">
            <button className="print-btn2 col-6" onClick={addWitnessRow}>
              + Şahit Ekle
            </button>
          </div>

          <div className="col-12">
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>Kontrol Eden</th>
                  <th>T.C. Kimlik No</th>
                  <th>Kurumdan Olma Durumu</th>
                  <th>Firma Görevi</th>
                  <th>İletişim Bilgisi</th>
                  <th>Olay Yerinde Bulunma Sebebi</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {witness.map((witness, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={witness.control}
                        onChange={(e) =>
                          handleInputChange(index, "control", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={witness.tc}
                        onChange={(e) =>
                          handleInputChange(index, "tc", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={witness.staff}
                        onChange={(e) =>
                          handleInputChange(index, "staff", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={witness.duty}
                        onChange={(e) =>
                          handleInputChange(index, "duty", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={witness.contact}
                        onChange={(e) =>
                          handleInputChange(index, "contact", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={witness.reason}
                        onChange={(e) =>
                          handleInputChange(index, "reason", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeWitnessRow(index)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-header create-doc-card-header">Onay</div>
            <div className="card-body justify-content-center row">
              <div className="row mb-3 justify-content-center col-12 py-3">
                <label className="col-12 create-doc-p mb-3">
                  Bildirimde Bulunan
                </label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field4_1"
                />
              </div>
              <div className="row mb-3 justify-content-center col-12 py-3">
                <label className="col-12 create-doc-p mb-3">İG Uzmanı</label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field4_2"
                />
              </div>
              <div className="row mb-3 justify-content-center col-12 py-3">
                <label className="col-12 create-doc-p mb-3">
                  Genel Müdür Yardımcısı
                </label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field4_3"
                />
              </div>
              <div className="row mb-3 justify-content-center col-12 py-3">
                <label className="col-12 create-doc-p mb-3">Genel Müdür</label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field4_4"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-header create-doc-card-header">
              Değerlendirme ve Sonuç
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row mb-3 justify-content-center col-12 py-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">
                  Değerlendirme
                </label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field5_1"
                />
              </div>
              <div className="row mb-3 justify-content-center col-12 py-3">
                <label className="col-12 create-doc-p mb-3">Sonuç</label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field5_2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-header create-doc-card-header">
              Yapılan Faaliyetler
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row mb-3 justify-content-center col-12 py-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <label className="col-12 create-doc-p mb-3">
                  Faaliyet Tanımı
                </label>
                <input
                  className="col-12 create-doc-inp"
                  name="doctitle"
                  type="text"
                  field-short-name="field6_1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccidentIncidentTrackingForm;
