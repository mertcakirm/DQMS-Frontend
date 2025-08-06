import React, {useContext, useEffect, useState} from "react";
import { optionsList } from "../../Helpers/units.js";
import { DMode } from "../../Helpers/DMode.js";
import {
  changeDocument,
  createDocument,
  getDocumentFromId,
} from "../../API/Documents.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import { useSearchParams } from "react-router-dom";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../other/UnauthPage.jsx";

const Debit = () => {
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [manuelId, setManuelId] = useState("");
  const [data, setData] = useState([]);
  const [queryParameters] = useSearchParams();
  const filteredValue = optionsList.includes(unit) ? unit : "";
  const [limit, setLimit] = useState([
    { kkdtype: "", standard: "", amount: "", deadline: "" },
  ]);
  const [kkd, setKkd] = useState([{ k1: "", k2: "", k3: "", k4: "" }]);
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
    <title>KKD Zimmet ve Taahhüt Formu (Sayfa 1)</title>
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
        .header-table, .info-table {
            border-collapse: collapse; /* Hücre kenarlarını birleştirir */
            margin: 0; /* Dış boşlukları kaldırır */
            padding: 0; /* İç boşlukları kaldırır */
            margin-bottom: 30px;
        }
    
        .header-table td, .info-table td {
            border: 1px solid #000; /* Kenarlık ekler */
            padding: 0; /* İç boşluğu tamamen sıfırlar */
            margin: 0; /* Hücre kenarı boşluğunu sıfırlar */
        }
    
        .info-label {
            font-weight: bold; /* Bilgi başlıklarını vurgular */
        }

        .info-table {
           margin: 0;
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
    <table class="header-table">
        <tr>
            <td rowspan="2" style="width: 10%;"></td>
            <td colspan="4" style="font-size: 1.5em; text-align: center;">KKD Zimmet ve Taahhüt Formu (Sayfa 1)</td>
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

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-family: Arial, sans-serif;">
        <tr>
            <td style="border: 1px solid black; background-color: lightgray; padding: 5px; width: 30%; text-align: left;">Adı / Soyadı</td>
            <td style="border: 1px solid black; padding: 5px; width: 70%;">${documentFields["field1"]}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black; background-color: lightgray; padding: 5px; width: 30%; text-align: left;">Unvan / Pozisyon</td>
            <td style="border: 1px solid black; padding: 5px; width: 70%;">${documentFields["field2"]}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black; background-color: lightgray; padding: 5px; width: 30%; text-align: left;">İşe Başlama Tarihi</td>
            <td style="border: 1px solid black; padding: 5px; width: 70%;">${documentFields["date1"]}</td>
        </tr>
    </table>

    <p style="font-family: Arial, sans-serif; font-size: 14px; margin-top: 20px; margin-bottom:20px;">${documentFields["field3"]}</p>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; font-family: Arial, sans-serif;">
        <tr>
            <th style="border: 1px solid black; background-color: lightgray; padding: 5px;">KKD Cinsi</th>
            <th style="border: 1px solid black; background-color: lightgray; padding: 5px;">Standart / Özelliği</th>
            <th style="border: 1px solid black; background-color: lightgray; padding: 5px;">Miktarı</th>
            <th style="border: 1px solid black; background-color: lightgray; padding: 5px;">Teslim Tarihi</th>
        </tr>
                ${limit.map(
                  (doc) =>
                    `<tr key={doc.id}>
                            <td>${doc.kkdtype || "Belirtilmemiş"}</td>
                            <td>${doc.standard || "Belirtilmemiş"}</td>
                            <td>${doc.amount || "Belirtilmemiş"}</td>
                            <td>${doc.deadline || "Belirtilmemiş"}</td>
                        </tr>`,
                )}
    </table>

    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <tr>
            <th style="border: 1px solid black; background-color: lightgray; padding: 5px; text-align: left; width: 50%;">TESLİM EDEN</th>
            <th style="border: 1px solid black; background-color: lightgray; padding: 5px; text-align: left; width: 50%;">TESLİM ALAN</th>
        </tr>
        <tr>
            <td style="border: 1px solid black; padding: 0; margin-right: 20px;">
                <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
                    <tr>
                        <td style="border: 1px solid black; margin: 0; padding: 5px; text-align: left;">Adı / Soyadı</td>
                        <td style="border: 1px solid black; margin: 0; padding: 5px;width: 300px;">${documentFields["field4"]}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; margin: 0; padding: 5px; text-align: left;">Tarih</td>
                        <td style="border: 1px solid black; margin: 0; padding: 5px;">${documentFields["date2"]}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; margin: 0; padding: 5px; text-align: left;">İmza</td>
                        <td style="border: 1px solid black; margin: 0; padding: 5px; height: 40px;"></td>
                    </tr>
                </table>
            </td>
            <td style="border: 1px solid black; padding: 0;">
                <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
                    <tr>
                        <td style="border: 1px solid black; margin: 0; padding: 5px; text-align: left;">Adı / Soyadı</td>
                        <td style="border: 1px solid black; margin: 0; padding: 5px; width: 300px;">${documentFields["field5"]}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; margin: 0; padding: 5px; text-align: left;">Tarih</td>
                        <td style="border: 1px solid black; margin: 0; padding: 5px;">${documentFields["date3"]}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; margin: 0; padding: 5px; text-align: left;">İmza</td>
                        <td style="border: 1px solid black; margin: 0; padding: 5px; height: 40px;"></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <p style="font-family: Arial, sans-serif; font-size: 14px; margin-top: 20px; margin-bottom:20px;">${documentFields["field6"]}</p>


    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead>
            <tr>
                <th style="border: 1px solid black; background-color: lightgray; text-align: center; padding: 5px;" colspan="5">KKD DEĞİŞİM TAKİP TABLOSU</th>
            </tr>
            <tr>
                <th style="border: 1px solid black; background-color: lightgray; text-align: center; padding: 5px;">KKD Cinsi</th>
                <th style="border: 1px solid black; background-color: lightgray; text-align: center; padding: 5px;">Standart / Özelliği</th>
                <th style="border: 1px solid black; background-color: lightgray; text-align: center; padding: 5px;">Miktarı</th>
                <th style="border: 1px solid black; background-color: lightgray; text-align: center; padding: 5px;">Teslim Tarihi</th>
                <th style="border: 1px solid black; background-color: lightgray; text-align: center; padding: 5px;">Kullanıcı İmza</th>
            </tr>
        </thead>
        <tbody>
                    ${kkd.map(
                      (doc) =>
                        `<tr key={doc.id}>
                            <td>${doc.k1 || "Belirtilmemiş"}</td>
                            <td>${doc.k2 || "Belirtilmemiş"}</td>
                            <td>${doc.k3 || "Belirtilmemiş"}</td>
                            <td>${doc.k4 || "Belirtilmemiş"}</td>
                            <td></td>
                        </tr>`,
                    )}
        </tbody>
    </table>
</body>
</html>
  `;
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

  const mode = queryParameters.get("mode") ?? "create";
  const onRevisionResult = (isRejected) => {
    if (isRejected)
      rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
    else acceptDocumentRevision(data.revision.documentId, data.revision.id);
    window.location.href = "/onay-bekleyen-revizyonlar";
  };

  const handleAddRowLimit = () => {
    setLimit((prevLimit) => [
      ...prevLimit,
      { kkdtype: "", standard: "", amount: "", deadline: "" },
    ]);
  };
  const handleAddRowKkd = () => {
    setKkd((prevKkd) => [...prevKkd, { k1: "", k2: "", k3: "", k4: "" }]);
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
  const handleInputChangeKkd = (index, field, value) => {
    setKkd((prevRows) => {
      const updatedKkd = [...prevRows];
      updatedKkd[index] = {
        ...updatedKkd[index],
        [field]: value,
      };
      return updatedKkd;
    });
  };

  const handleSubmit = () => {
    if (limit == null || limit.length === 0 || kkd == null || kkd.length === 0)
      return;
    const elements = document.querySelectorAll("[field-short-name]");
    const documentFields = {};
    documentFields["limit"] = JSON.stringify(limit);
    documentFields["kkd"] = JSON.stringify(kkd);
    elements.forEach((element) => {
      const fieldName = element.getAttribute("field-short-name");
      const elementTag = element.tagName.toLowerCase();
      let value = element.value;

      documentFields[fieldName] = value;
    });
    (async () => {
      if (mode === "create") {
        await createDocument({
          type: DocumentType.Debit,
          shortName: "document",
          title: title,
          fields: documentFields,
          department: unit,
          ManuelId: manuelId,
        });
      } else if (mode === "revise") {
        await createDocumentRevision(queryParameters.get("id"), documentFields);
      } else if (mode === "edit") {
        await changeDocument(queryParameters.get("id"), documentFields);
      }

      window.location.href = "/dokuman/listesi";
    })();
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
        setUnit(doc.department);
        setManuelId(doc.manuelId);
        setLimit(JSON.parse(doc.fields["limit"].value));
        setKkd(JSON.parse(doc.fields["kkd"].value));

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
        <h3 className="col-6 large-title">KKD Zimmet ve Taahhüt Formu</h3>
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
          <button onClick={handlePrint} className="col-2 print-btn">
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
        <div className="col-12">
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <div className="card-header create-doc-card-header">
              Doküman Bilgileri
            </div>
            <div className="card-body justify-content-between px-5 row">
              <div className="row mb-3 justify-content-center col-2 p-3">
                <label className="col-12 text-center create-doc-p mb-3">
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
              <div className="row mb-3 justify-content-center col-2 p-3">
                <label className="col-12 text-center create-doc-p mb-3">
                  Döküman No
                </label>
                <input
                  className="col-12 create-doc-inp"
                  value={manuelId}
                  onChange={(e) => setManuelId(e.target.value)}
                  type="text"
                />
              </div>
              <div className="row mb-3 justify-content-center col-2 p-3">
                <label className="col-12 text-center create-doc-p mb-3">
                  İlk Yayın Tarihi
                </label>
                <input
                  className="col-12 create-doc-inp"
                  type="date"
                  field-short-name="p1"
                />
              </div>
              <div className="row mb-3 justify-content-center col-2 p-3">
                <label className="col-12 text-center create-doc-p mb-3">
                  Yürürlük Tarihi
                </label>
                <input
                  className="col-12 create-doc-inp"
                  type="date"
                  field-short-name="p2"
                />
              </div>
              <div className="row mb-3 justify-content-center col-2 p-3">
                <label className="col-12 text-center create-doc-p mb-3">
                  Sayfa No
                </label>
                <input
                  className="col-12 create-doc-inp"
                  type="number"
                  field-short-name="p3"
                />
              </div>
              <div className="row mb-3 justify-content-center col-2 p-3">
                <label className="col-12 text-center create-doc-p mb-3">
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
              v
            </div>
          </div>
        </div>
        <div className="col-12 mt-5">
          <div className="card">
            <div className="card-header create-doc-card-header">
              Doküman İçeriği
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row col-12 justify-content-around"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <div className="row mb-3 justify-content-center col-3 p-3">
                  <label className="col-12 text-center create-doc-p mb-3">
                    Adı Soyadı
                  </label>
                  <input
                    className="col-12 create-doc-inp"
                    type="text"
                    field-short-name="field1"
                  />
                </div>

                <div className="row mb-3 justify-content-center col-3 p-3">
                  <label className="col-12 text-center create-doc-p mb-3">
                    Unvan / Pozisyon
                  </label>
                  <input
                    className="col-12 create-doc-inp"
                    type="text"
                    field-short-name="field2"
                  />
                </div>

                <div className="row mb-3 justify-content-center col-3 p-3">
                  <label className="col-12 text-center create-doc-p mb-3">
                    İşe Başlama Tarihi
                  </label>
                  <input
                    className="col-12 create-doc-inp"
                    type="date"
                    field-short-name="date1"
                  />
                </div>
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Metin</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field3"
                  type="text"
                />
              </div>

              <div className="col-12 row justify-content-center">
                <div className="row my-3 col-12 align-items-center justify-content-between">
                  <p className="create-doc-p col-5"></p>
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
                      <th className="col py-2">KKD Cinsi</th>
                      <th className="col py-2">Standart / Özelliği</th>
                      <th className="col py-2">Miktarı</th>
                      <th className="col py-2">Teslim Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {limit.map((row, index) => (
                      <tr key={row.index} className="row">
                        <td className="col">
                          <input
                            className="create-doc-inp border-0 w-100"
                            type="text"
                            value={row.kkdtype}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "kkdtype",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0 w-100"
                            type="text"
                            value={row.standard}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "standard",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0 w-100"
                            type="text"
                            value={row.amount}
                            onChange={(e) =>
                              handleInputChange(index, "amount", e.target.value)
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0 w-100"
                            type="date"
                            value={row.deadline}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "deadline",
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
                className="col-12 row-gap-3 mt-5 row py-4"
                style={{
                  borderTop: "1px solid #ccc",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <div className="col-12  align-items-center column-gap-5 row">
                  <p className="create-doc-p col-1">Teslim Eden</p>
                  <input
                    type="text"
                    className="col-3 create-doc-inp"
                    placeholder="Adı Soyadı"
                    field-short-name="field4"
                  />
                  <input
                    type="date"
                    className="col-3 create-doc-inp"
                    placeholder="Tarih"
                    field-short-name="date2"
                  />
                </div>
                <div className="col-12 align-items-center column-gap-5 row">
                  <p className="create-doc-p col-1 ">Teslim Alan</p>
                  <input
                    type="text"
                    className="col-3 create-doc-inp"
                    placeholder="Adı Soyadı"
                    field-short-name="field5"
                  />
                  <input
                    type="date"
                    className="col-3 create-doc-inp"
                    placeholder="Tarih"
                    field-short-name="date3"
                  />
                </div>
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Metin</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field6"
                  type="text"
                />
              </div>

              <div className="col-12 row justify-content-center mb-3">
                <div className="row my-3 col-12 align-items-center justify-content-between">
                  <p className="create-doc-p col-5"></p>
                  <button
                    onClick={handleAddRowKkd}
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
                      <th className="col py-2">KKD Değişim Takip Tablosu</th>
                    </tr>
                    <tr
                      className="row text-center"
                      style={{
                        background:
                          "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                      }}
                    >
                      <th className="col py-2">KKD Cinsi</th>
                      <th className="col py-2">Standart / Özelliği</th>
                      <th className="col py-2">Miktarı</th>
                      <th className="col py-2">Teslim Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kkd.map((row, index) => (
                      <tr key={row.index} className="row">
                        <td className="col">
                          <input
                            className="create-doc-inp border-0 w-100"
                            type="text"
                            value={row.k1}
                            onChange={(e) =>
                              handleInputChangeKkd(index, "k1", e.target.value)
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0 w-100"
                            type="text"
                            value={row.k2}
                            onChange={(e) =>
                              handleInputChangeKkd(index, "k2", e.target.value)
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0 w-100"
                            type="text"
                            value={row.k3}
                            onChange={(e) =>
                              handleInputChangeKkd(index, "k3", e.target.value)
                            }
                          />
                        </td>
                        <td className="col">
                          <input
                            className="create-doc-inp border-0 w-100"
                            type="date"
                            value={row.k4}
                            onChange={(e) =>
                              handleInputChangeKkd(index, "k4", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debit;
