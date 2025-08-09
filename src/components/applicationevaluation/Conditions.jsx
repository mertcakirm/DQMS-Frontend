import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App.jsx";
import { optionsList } from "../../Helpers/unitsHelper.js";
import { ActionPerm, checkPermFromRole } from "../../API/permissions.js";
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
import UnauthPage from "../other/UnauthPage.jsx";
import {handleRevisionResult, loadDocumentData} from "../general/loadDocumentData.js";

const Conditions = () => {
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
      Array.from({ length: 5 }, () => Array(7).fill(""))
  );

  const [selectedRow, setSelectedRow] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedScore, setSelectedScore] = useState("");
  const [data, setData] = useState(null);

  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;

  const [queryParameters] = useSearchParams();
  const mode = queryParameters.get("mode") ?? DMode.Create;

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

  const handleInputChange = (index, field, value) => {
    const updatedRows = state.row.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
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
          type: DocumentType.Conditions,
          department: unit,
          fields: documentFields,
          ManuelId: manuelId,
        });
      } else if (mode === DMode.Revise) {
        await createDocument({
          title: title,
          shortName: "document",
          type: DocumentType.Conditions,
          department: unit,
          fields: documentFields,
          ManuelId: manuelId,
          revisionOf: queryParameters.get("id"),
        });
      } else if (mode === DMode.Edit) {
        await changeDocument(queryParameters.get("id"), documentFields);
      }

      window.location.href = "/dokuman/listesi";
    })();
  };

  const onRevisionResult = (isRejected) => {
    handleRevisionResult({
      data,
      isRejected,
      redirectUrl: "/onay-bekleyen-revizyonlar",
    });
  };

  useEffect(() => {
    loadDocumentData({
      mode,
      id: queryParameters.get("id"),
      setters: { setData, setTitle, setUnit, setManuelId },
      onAfterLoad: (doc) => {
        setState(JSON.parse(doc.fields["points"].value));
        setTableData(JSON.parse(doc.fields["table_data"].value));
      },
    });
  }, []);

  const columnTotals = calculateColumnTotals();
  return (
    <div className="container-fluid p-5">
      <div className="row justify-content-between">
        <h3 className="col-6 large-title">Koşullar</h3>
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
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <div className="card-header create-doc-card-header">
              Doküman Bilgileri
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
              <div className="row mb-3 justify-content-center col-12 py-3">
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
              Gereklilikler
            </div>
            <div className="card-body justify-content-center row">
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Genel Başvuru Şartları</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field1"
                  type="text"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Gerekli Belgeler</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field2"
                  type="text"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Başvuru Tarihleri</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field3"
                  type="text"
                />
              </div>
              <div className="row justify-content-center col-12 p-3">
                <p className="create-doc-p">İlave Açıklamalar</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field4"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conditions;
