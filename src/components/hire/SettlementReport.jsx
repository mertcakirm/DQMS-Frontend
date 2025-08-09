import { optionsList } from "../../Helpers/unitsHelper.js";
import React, {useContext, useEffect, useState} from "react";
import {
  changeDocument,
  createDocument,
  getDocumentFromId,
} from "../../API/Documents.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import { useSearchParams } from "react-router-dom";
import { DMode } from "../../Helpers/DMode.js";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../other/UnauthPage.jsx";

const SettlementReport = () => {
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [manuelId, setManuelId] = useState("");
  const filteredValue = optionsList.includes(unit) ? unit : "";
  const [rows, setRows] = useState([
    {
      companyName: "",
      responsible: "",
      activity: "",
      floor: "",
      officeNo: "",
      validity: "",
    },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        companyName: "",
        responsible: "",
        activity: "",
        floor: "",
        officeNo: "",
        validity: "",
      },
    ]);
  };
  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;
  const handleInputChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    );
    setRows(updatedRows);
  };

  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);
  const mode = queryParameters.get("mode") ?? DMode.Create;
  const handleSubmit = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};
      documentFields["settlementList"] = JSON.stringify(rows);

      elements.forEach((element) => {
        documentFields[element.getAttribute("field-short-name")] =
          element.value;
      });
      if (mode === DMode.Create) {
        await createDocument({
          title: title,
          shortName: "document",
          type: DocumentType.SettlementReport,
          department: unit,
          fields: documentFields,
          ManuelId: manuelId,
        });
      } else if (mode === DMode.Revise) {
        await createDocumentRevision(queryParameters.get("id"), documentFields);
      } else if (mode === DMode.Edit) {
        await changeDocument(queryParameters.get("id"), documentFields);
      }

      window.location.href = "/dokuman/listesi";
    })();
  };

  const onRevisionResult = (isRejected) => {
    if (isRejected)
      rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
    else acceptDocumentRevision(data.revision.documentId, data.revision.id);
    window.location.href = "/onay-bekleyen-revizyonlar";
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

        setRows(JSON.parse(doc.fields["settlementList"].value));

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
        <h3 className="col-3 large-title">Yerleşim Tutanağı</h3>
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
            </div>
          </div>
        </div>

        <div className="col-12 mt-5 row">
          <div className="col-12 mb-3 row justify-content-end">
            <button className="col-2 print-btn2" onClick={addRow}>
              + Veri Ekle
            </button>
          </div>
          <div className="col-12">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Şirket Adı
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Şirket Sorumlusu
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Şirket Faaliyet Alanı
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Ofis Kat
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Ofis No
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Geçerlilik Süresi
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <input
                        type="text"
                        className="border-0"
                        value={row.companyName}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "companyName",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <input
                        type="text"
                        className="border-0"
                        value={row.responsible}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "responsible",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <input
                        className="border-0"
                        type="text"
                        value={row.activity}
                        onChange={(e) =>
                          handleInputChange(index, "activity", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <input
                        className="border-0"
                        type="text"
                        value={row.floor}
                        onChange={(e) =>
                          handleInputChange(index, "floor", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <input
                        className="border-0"
                        type="text"
                        value={row.officeNo}
                        onChange={(e) =>
                          handleInputChange(index, "officeNo", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <input
                        className="border-0"
                        type="text"
                        value={row.validity}
                        onChange={(e) =>
                          handleInputChange(index, "validity", e.target.value)
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
  );
};

export default SettlementReport;
