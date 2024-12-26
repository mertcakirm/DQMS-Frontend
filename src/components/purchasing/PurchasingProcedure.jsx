import React, {useState, useEffect, useContext} from "react";
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
import { optionsList } from "../../Helpers/units.js";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import { useSearchParams } from "react-router-dom";
import { DMode } from "../../Helpers/DMode.js";
import FileUpload from "../fileUpload.jsx";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../UnauthPage.jsx";

const PurchasingProcedure = () => {
  const [fileList, setFileList] = useState([]);
  const [deletionAttachmentList, setDeletionAttachmentList] = useState([]);
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [manuelId, setManuelId] = useState("");
  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);
  const filteredValue = optionsList.includes(unit) ? unit : "";
  const [limit, setLimit] = useState([{ f1: "", f2: "", f3: "", f4: "" }]);
  const [requests, setRequests] = useState([
    { requestName: "", assessment: "" },
  ]);
  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;
  const handlePrint = () => {
    const elements = document.querySelectorAll("[field-short-name]");
    const documentFields = {};
    elements.forEach((element) => {
      documentFields[element.getAttribute("field-short-name")] = element.value;
    });
    const printableContent = `
      <!DOCTYPE html>
<html lang="tr">
<head>
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Satın Alma Prosedürü</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px 40px;
            line-height: 1.6;
            color: #333;
            max-width: 1500px;
            margin: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            height: 25px;
        }

        th {
            background-color: #f2f2f2;
        }

        .header-table {
            width: 100%;
            margin-bottom: 20px;
        }

        .header-table td {

            font-weight: bold;
            text-align: center;
            font-size: 1em;
        }

        .info-table {
            border-collapse: collapse;
            width: 100%;
        }

        .info-table .info-label {
            text-align: left;
            width: 40%;
        }
        
        .header-table .info-label {
            font-weight: normal;
        }

        .info-table td {
            border: 1px solid black;
            width: 60%;
        }

        .month-header {
            background-color: #ffddaa;
        }

        .month-header-empty {
            background-color: #ffffff;
            font-weight: normal;
        }

        .P-cell {
            background-color: #ffaaaa;
        }

        .G-cell {
            background-color: #aaffaa;
        }

        .centered-title {
            text-align: center;
            margin-right: 0; /* Reset margin */
            margin-bottom: 0;
        }

        .approval-table {
            width: 100%;
            border: 1px solid #000;
            margin-top: 20px;
            text-align: center;
        }
        .approval-table td {
            border: 1px solid #000;
            padding: 15px;
            font-weight: bolder;
        }
        .approval-table em {
            font-style: italic;
            font-weight: normal;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            .header-table {
                float: none; /* Remove float for printing */
                page-break-inside: avoid; /* Prevent breaking the header across pages */
            }

            .header-table td {
                font-size: 0.8em; /* Smaller font size for printing */
            }

            .centered-title {
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <style>
        .header-table, .info-table {
            border-collapse: collapse; /* Hücre kenarlarını birleştirir */
            margin: 0; /* Dış boşlukları kaldırır */
            padding: 0; /* İç boşlukları kaldırır */
        }
    
        .header-table td, .info-table td {
            border: 1px solid #000; /* Kenarlık ekler */
            padding: 0; /* İç boşluğu tamamen sıfırlar */
            margin: 0; /* Hücre kenarı boşluğunu sıfırlar */
        }
    
        .info-label {
            font-weight: bold; /* Bilgi başlıklarını vurgular */
        }
    </style>
    
    <table class="header-table">
        <tr>
            <td rowspan="2" style="width: 10%;"></td>
            <td colspan="4" style="font-size: 1.5em; text-align: center;">Satın Alma Prosedürü</td>
            <td rowspan="2" style="width: 20%;">
                 <table class="info-table">
                    <tr>
                        <td>Dokuman No</td>
                        <td>${manuelId}</td>
                    </tr>
                    <tr>
                        <td>İlk Yayın Tarihi</td>
                        <td>${documentFields["p1"]}</td>
                    </tr>
                    <tr>
                        <td>Revizyon No</td>
                        <td>${data?.revisionCount || 0}</td>
                    </tr>
                    <tr>
                        <td>Yürürlük Tarihi</td>
                        <td>${documentFields["p2"]}</td>
                    </tr>
                    <tr>
                        <td>Sayfa No</td>
                        <td>${documentFields["p3"]}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px 40px;
            line-height: 1.6;
            color: #333;
            max-width: 1500px;
            margin: auto;
        }
        h1, h2, h3 {
            font-weight: bold;
        }
        h1 {
            font-size: 1.5rem;
            margin-top: 20px;
        }
        h2 {
            font-size: 1.2rem;
            margin-top: 15px;
        }
        h3 {
            font-size: 1rem;
            margin-top: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        .section-number {
            font-weight: bold;
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <h2>1. AMAÇ</h2>
    <p>${documentFields["field1"]}</p>
    <h2>2. KAPSAM</h2>
    <p>${documentFields["field2"]}</p>
    <h2>3. TANIMLAR</h2>
    <p>${documentFields["field3"]}</p>
    <h2>4. SORUMLULUKLAR</h2>
    <p>${documentFields["field4"]}</p>

    <h2>5.1. Satın Alma Politikaları</h2>
   ${documentFields["field5"]} 
    
    <h2>5.2. Satın Alma Limitleri</h2>
    <table>
       ${limit.map(
         (l) => `
        <tr>
            <td>${l.f1}</td>
            <td>${l.f2}</td>
            <td>${l.f3}</td>
            <td>${l.f4}</td>
        </tr>
`,
       )}
    </table>

    <h3>5.1. Talep Oluşturma</h3>
    <p>${documentFields["field6"]}</p>
    
    <h3>5.2. Talep Değerlendirme ve Teklif Toplama</h3>
    <table>
        ${requests.map(
          (r) => `
        <tr>
            <td>${r.requestName}</td>
            <td>${r.assessment}</td>
        </tr>`,
        )}
    </table>
    
    <p><strong>Temin Süreleri</strong></p>
    <table>
        ${times.map(
          (r) => `
        <tr>
            <td>${r.product}</td>
            <td>${r.date}</td>
        </tr>`,
        )}
    </table>
    
    <h3>5.3. Tedarikçi Seçim Kriterleri</h3>
    <p>${documentFields["field7"]}</p>

    <h3>5.4. <span class="highlight">Teklif Karşılaştırma ve Siparişin Geçilmesi</span></h3>
<p>${documentFields["field8"]}</p>

    <h3>5.5. Malzeme ya da Hizmet Kabulü</h3>
    <p>${documentFields["field9"]}</p>

    <h3>5.6. İade/Değiştirme</h3>
    <p>${documentFields["field10"]}</p>

    <h3>5.7. Sözleşmelere</h3>
    <p>${fileList
      .filter((f) => f.type === "file1")
      .map((f) => f.fileName + "." + f.extension)
      .join("<br />")}</p>
    <h2>6. REFERANSLAR VE İLGİLİ DOKÜMANLAR</h2>
    <p>${fileList
      .filter((f) => f.type === "file2")
      .map((f) => f.fileName + "." + f.extension)
      .join("<br />")}</p>
    <h2>7. EKLER</h2>
    <p>${fileList
      .filter((f) => f.type === "file3")
      .map((f) => f.fileName + "." + f.extension)
      .join("<br />")}</p>
    
    <table class="approval-table">
        <tr>
            <td>HAZIRLAYAN<br><em>(Adı Soyadı/Ünvanı/İmza/Tarih)</em></td>
            <td>KONTROL EDEN<br><em>(Adı Soyadı/Ünvanı/İmza/Tarih)</em></td>
            <td>ONAYLAYAN<br><em>(Adı Soyadı/Ünvanı/İmza/Tarih)</em></td>
        </tr>
        <tr>
            <td style="height: 60px;"></td>
            <td></td>
            <td></td>
        </tr>
    </table>
</body>
</html>
  `;
    console.log(fileList.filter((f) => f === "file1").map((f) => f.fileName));
    const printWindow = window.open(
      "",
      "_blank",
      "width=800, height=600, toolbar=no, status=no, menubar=no, scrollbars=no, resizable=no, visible=none",
    );
    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const [times, setTimes] = useState([{ product: "", date: "" }]);
  const handleAddRowLimit = () => {
    setLimit((prevLimit) => [...prevLimit, { f1: "", f2: "", f3: "", f4: "" }]);
  };

  const handleAddRowReq = () => {
    setRequests((prevRequest) => [
      ...prevRequest,
      { requestName: "", assessment: "" },
    ]);
  };
  const handleAddRowTimes = () => {
    setTimes((prevRequest) => [...prevRequest, { product: "", date: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    setLimit((prevRows) => {
      const updatedLimit = [...prevRows];
      updatedLimit[index] = {
        ...updatedLimit[index],
        [field]: value,
      };
      return updatedLimit;
    });
  };
  const handleRequestsChange = (index, field, value) => {
    setRequests((prevRequests) => {
      const updatedRequests = [...prevRequests];
      updatedRequests[index] = {
        ...updatedRequests[index],
        [field]: value,
      };
      return updatedRequests;
    });
  };
  const handleTimesChange = (index, field, value) => {
    setTimes((prevRequests) => {
      const updatedTimes = [...prevRequests];
      updatedTimes[index] = {
        ...updatedTimes[index],
        [field]: value,
      };
      return updatedTimes;
    });
  };

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
        documentFields[element.getAttribute("field-short-name")] =
          element.value;
      });

      const promiseArray = [];
      if (mode === DMode.Create) {
        const documentId = await createDocument({
          title: title,
          shortName: "document",
          type: DocumentType.PurchasingProcedure,
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
    window.location.href = "/onay-bekleyen-revizyonlar";
  };

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
        <h3 className="col-3 large-title">Prosedür</h3>
        <div
          className="col-6 row justify-content-end"
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
          <button className="col-2 print-btn" onClick={handlePrint}>
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
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <div className="card-header create-doc-card-header">
              Doküman Bilgileri
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
                  name="doctitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={manuelId}
                  onChange={(e) => setManuelId(e.target.value)}
                  type="text"
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

              <div className="row mb-3 justify-content-center col-12 pb-3">
                <label className="col-12 create-doc-p mb-3">
                  Sorumlu Birim
                </label>
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
          </div>
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
                <p className="create-doc-p">5.1. Satın Alma Politikası</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  name="implementations"
                  field-short-name="field5"
                  type="text"
                />
              </div>

              <div className="col-12 row justify-content-center">
                <div className="row my-3 col-12 align-items-center justify-content-between">
                  <p className="create-doc-p col-5">
                    5.2. Satın Alma Limitleri
                  </p>
                  <button
                    onClick={handleAddRowLimit}
                    className="print-btn2 col-2"
                    style={{ marginTop: "10px" }}
                  >
                    + Satır Ekle
                  </button>
                </div>
                <table className="col-12 table-bordered table-striped">
                  <thead>
                    <tr
                      className="row text-center"
                      style={{
                        background:
                          "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                      }}
                    >
                      <th className="col py-2">Başlangıç Tarihi</th>
                      <th className="col py-2">SÜTUN</th>
                      <th className="col py-2">SÜTUN</th>
                      <th className="col py-2">SÜTUN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {limit.map((row, index) => (
                      <tr className="row" key={index}>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0"
                            type="text"
                            value={row.f1}
                            onChange={(e) =>
                              handleInputChange(index, "f1", e.target.value)
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0"
                            type="text"
                            value={row.f2}
                            onChange={(e) =>
                              handleInputChange(index, "f2", e.target.value)
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0"
                            type="text"
                            value={row.f3}
                            onChange={(e) =>
                              handleInputChange(index, "f3", e.target.value)
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0"
                            type="text"
                            value={row.f4}
                            onChange={(e) =>
                              handleInputChange(index, "f4", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="row justify-content-center col-12 p-3 mt-3"
                style={{
                  borderBottom: "1px solid #ccc",
                  borderTop: "1px solid #ccc",
                }}
              >
                <p className="create-doc-p">5.3. Talep Oluşturma</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  name="implementations"
                  field-short-name="field6"
                  type="text"
                />
              </div>

              <div
                className="col-12 row justify-content-center pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <div className="row my-3 col-12 align-items-center justify-content-between">
                  <p className="create-doc-p col-5">
                    5.3.1. Talep Değerlendirme ve Teklif Toplama
                  </p>
                  <button
                    onClick={handleAddRowReq}
                    className="print-btn2 col-2"
                    style={{ marginTop: "10px" }}
                  >
                    + Satır Ekle
                  </button>
                </div>
                <table className="col-12 table-bordered table-striped">
                  <thead>
                    <tr
                      className="row text-center"
                      style={{
                        background:
                          "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                      }}
                    >
                      <th className="col py-2">Başlangıç Tarihi</th>
                      <th className="col py-2">SÜTUN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((row, index) => (
                      <tr className="row">
                        <td className="col">
                          <input
                            className="create-doc-inp border-0"
                            type="text"
                            value={row.requestName}
                            onChange={(e) =>
                              handleRequestsChange(
                                index,
                                "requestName",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0"
                            type="text"
                            value={row.assessment}
                            onChange={(e) =>
                              handleRequestsChange(
                                index,
                                "assessment",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="col-12 row justify-content-center pb-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <div className="row my-3 col-12 align-items-center justify-content-between">
                  <p className="create-doc-p col-5">5.4. Temin Süreleri</p>
                  <button
                    onClick={handleAddRowTimes}
                    className="print-btn2 col-2"
                    style={{ marginTop: "10px" }}
                  >
                    + Satır Ekle
                  </button>
                </div>
                <table className="col-12 table-bordered table-striped">
                  <thead>
                    <tr
                      className="row text-center"
                      style={{
                        background:
                          "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                      }}
                    >
                      <th className="col py-2">Satın Alınan</th>
                      <th className="col py-2">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {times.map((row, index) => (
                      <tr className="row">
                        <td className="col">
                          <input
                            className="create-doc-inp border-0"
                            type="text"
                            value={row.product}
                            onChange={(e) =>
                              handleTimesChange(
                                index,
                                "product",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0"
                            type="date"
                            value={row.date}
                            onChange={(e) =>
                              handleTimesChange(index, "date", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="row justify-content-center col-12 p-3 mt-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">5.5. Tedarikçi Seçim Kriterleri</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field7"
                  type="text"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3 mt-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">
                  5.6. Teklif Karşılaştırma ve Siparişin Geçilmesi
                </p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field8"
                  type="text"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3 mt-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">5.7. Malzeme ya da Hizmet Kabulü</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field9"
                  type="text"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3 mt-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">5.8. İade/Değiştirme</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field10"
                  type="text"
                />
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">5.9. Sözleşmeler</p>
                <FileUpload
                  fileList={fileList}
                  type="file1"
                  onUpload={handleFileUpload}
                  onRemove={handleFileRemove}
                  canUpload={[DMode.Create, DMode.Edit].includes(mode)}
                />
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">
                  6. REFERANSLAR VE İLGİLİ UYGULAMALAR
                </p>
                <FileUpload
                  fileList={fileList}
                  type="file2"
                  onUpload={handleFileUpload}
                  onRemove={handleFileRemove}
                  canUpload={[DMode.Create, DMode.Edit].includes(mode)}
                />
              </div>

              <div className="row justify-content-center col-12 p-3">
                <p className="create-doc-p">7. EKLER</p>
                <FileUpload
                  fileList={fileList}
                  type="file3"
                  onUpload={handleFileUpload}
                  onRemove={handleFileRemove}
                  canUpload={[DMode.Create, DMode.Edit].includes(mode)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasingProcedure;
