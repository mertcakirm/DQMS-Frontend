import React, {useContext, useEffect, useState} from "react";
import { optionsList } from "../../Helpers/units.js";
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

const ApplicationEvaluationForm2 = () => {
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [manuelId, setManuelId] = useState("");
  const filteredValue = optionsList.includes(unit) ? unit : "";
  const [state, setState] = useState({
    row: [{ id: 1, XName: "", YName: "", person: "", sign: "" }],
    JoinPerson: [
      { key: "A", value: "" },
      { key: "B", value: "" },
      { key: "C", value: "" },
      { key: "D", value: "" },
      { key: "E", value: "" },
      { key: "F", value: "" },
      { key: "G", value: "" },
    ],
  });
  const [tableData, setTableData] = useState(
    Array.from({ length: 5 }, () => Array(7).fill("")),
  );

  const [selectedRow, setSelectedRow] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedScore, setSelectedScore] = useState("");

  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;
  const calculateColumnTotals = () => {
    const totals = Array(7).fill(0);
    tableData.forEach((row) => {
      row.forEach((cell, colIndex) => {
        const value = parseFloat(cell);
        if (!isNaN(value)) {
          totals[colIndex] += value;
        }
      });
    });
    return totals;
  };
  const handleInputChangejoinperson = (index, newValue) => {
    const updatedJoinPerson = [...state.JoinPerson];
    updatedJoinPerson[index].value = newValue;
    setState({ ...state, JoinPerson: updatedJoinPerson });
  };
  const handleAddScore = () => {
    if (selectedRow && selectedColumn && selectedScore) {
      const rowIndex = parseInt(selectedRow) - 1;
      const colIndex = selectedColumn.charCodeAt(0) - 65;
      const newData = [...tableData];
      newData[rowIndex][colIndex] = selectedScore;
      setTableData(newData);
      setSelectedScore("");
    }
  };

  const columnTotals = calculateColumnTotals();
  const handleInputChange = (index, field, value) => {
    const updatedRows = state.row.map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    );
    setState({ row: updatedRows });
  };
  const addNewRow = () => {
    setState((prevState) => ({
      ...prevState,
      row: [
        ...prevState.row,
        { id: Date.now(), XName: "", YName: "", person: "", sign: "" },
      ],
    }));
  };

  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);
  const mode = queryParameters.get("mode") ?? DMode.Create;
  const handleSubmit = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};
      documentFields["points"] = JSON.stringify(state);
      documentFields["table_data"] = JSON.stringify(tableData);

      elements.forEach((element) => {
        documentFields[element.getAttribute("field-short-name")] =
          element.value;
      });
      if (mode === DMode.Create) {
        await createDocument({
          title: title,
          shortName: "document",
          type: DocumentType.ApplicationEvaluationForm2,
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

        setState(JSON.parse(doc.fields["points"].value));
        setTableData(JSON.parse(doc.fields["table_data"].value));

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
        <h3 className="col-6 large-title">Başvuru Değerlendirme Formu - 2</h3>
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

        <div className="col-12 mt-5">
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <div
              className="card-header create-doc-card-header"
              style={{ height: "50px" }}
            ></div>
            <div className="card-body justify-content-center px-5 row">
              <div
                className="row col-12 py-3 justify-content-between row-gap-4"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <div className="row col-5">
                  <label className="col-12 create-doc-p mb-3">
                    Toplantı Başkanı
                  </label>
                  <input
                    className="col-12 create-doc-inp"
                    field-short-name="field1"
                    type="text"
                  />
                </div>
                <div className="row col-5">
                  <label className="col-12 create-doc-p mb-3">
                    Toplantı Yeri
                  </label>
                  <input
                    className="col-12 create-doc-inp"
                    field-short-name="field2"
                    type="text"
                  />
                </div>
                <div className="row col-5">
                  <label className="col-12 create-doc-p mb-3">
                    Toplantı Tarihi
                  </label>
                  <input
                    className="col-12 create-doc-inp"
                    field-short-name="field3"
                    type="date"
                  />
                </div>
                <div className="row col-5">
                  <label className="col-12 create-doc-p mb-3">
                    Toplantı Sekreteri
                  </label>
                  <input
                    className="col-12 create-doc-inp"
                    field-short-name="field4"
                    type="text"
                  />
                </div>
              </div>

              <div className="col-12 row justify-content-center">
                <div
                  className="row"
                  style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
                >
                  <div className="row col-12 justify-content-between">
                    <h2 className="col-4">Puan Girişi</h2>

                    <div
                      className="col-8 row align-items-center justify-content-end"
                      style={{
                        marginBottom: "20px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <select
                        value={selectedRow}
                        onChange={(e) => setSelectedRow(e.target.value)}
                        style={{ padding: "5px" }}
                        className="col-3"
                      >
                        <option value="">Satır Seç</option>
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedColumn}
                        className="col-3"
                        onChange={(e) => setSelectedColumn(e.target.value)}
                        style={{ padding: "5px" }}
                      >
                        <option value="">Sütun Seç</option>
                        {["A", "B", "C", "D", "E", "F", "G"].map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                      <select
                        className="col-3"
                        value={selectedScore}
                        onChange={(e) => setSelectedScore(e.target.value)}
                      >
                        <option value="Belirtilmemiş">Puan Seç</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                      </select>
                      <button
                        onClick={handleAddScore}
                        className="col-2 print-btn2"
                      >
                        + Ekle
                      </button>
                    </div>
                  </div>

                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{ border: "1px solid #ccc", padding: "10px" }}
                        ></th>
                        {["A", "B", "C", "D", "E", "F", "G"].map(
                          (col, index) => (
                            <th
                              key={index}
                              style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                backgroundColor: "#f3f3f3",
                              }}
                            >
                              {col}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td
                            style={{
                              border: "1px solid #ccc",
                              padding: "10px",
                            }}
                          >
                            {rowIndex + 1}
                          </td>
                          {row.map((cell, colIndex) => (
                            <td
                              key={colIndex}
                              style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: "#e6f7ff" }}>
                        <td
                          style={{ border: "1px solid #ccc", padding: "10px" }}
                        >
                          Puan Toplam
                        </td>
                        {columnTotals.map((total, index) => (
                          <td
                            key={index}
                            style={{
                              border: "1px solid #ccc",
                              padding: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {total}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-12 row">
                  <select className="col-4" field-short-name="select1">
                    <option value="Durum Seçin">Durum Seçin</option>
                    <option value="Kabul Edildi">Kabul Edildi</option>
                    <option value="Revize">Revize</option>
                    <option value="Reddedildi">Reddedildi</option>
                  </select>
                </div>

                <div className="row justify-content-between align-items-center mt-5 col-12 p-3">
                  <p className="create-doc-p col-6">Katılımcılar</p>
                  <div>
                    <table
                      style={{
                        width: "100%",
                        border: "1px solid #ccc",
                        marginTop: "10px",
                      }}
                    >
                      <tbody>
                        {state.JoinPerson.map((item, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                textAlign: "center",
                              }}
                            >
                              {item.key}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                              }}
                            >
                              <input
                                type="text"
                                className="w-100 border-0"
                                placeholder={`${item.key} Görüşüne katılanları yazınız...`}
                                value={item.value}
                                onChange={(e) =>
                                  handleInputChangejoinperson(
                                    index,
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationEvaluationForm2;
