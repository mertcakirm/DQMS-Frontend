import React, {useContext, useEffect, useState} from "react";
import { optionsList } from "../../Helpers/units.js";
import { useSearchParams } from "react-router-dom";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import {
  changeDocument,
  createDocument,
  getDocumentFromId,
} from "../../API/Documents.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import { DMode } from "../../Helpers/DMode.js";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../UnauthPage.jsx";

const MonitoringReport2 = () => {
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [manuelId, setManuelId] = useState("");
  const [data, setData] = useState([]);
  const [queryParameters] = useSearchParams();
  const filteredValue = optionsList.includes(unit) ? unit : "";
  const [limit, setLimit] = useState([{ kkdtype: "", standard: "" }]);
  const [kkd, setKkd] = useState([{ k1: "", k2: "" }]);
  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;
  const mode = queryParameters.get("mode") ?? "create";
  const onRevisionResult = (isRejected) => {
    if (isRejected)
      rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
    else acceptDocumentRevision(data.revision.documentId, data.revision.id);
    window.location.href = "/onay-bekleyen-revizyonlar";
  };

  const handleAddRowLimit = () => {
    setLimit((prevLimit) => [...prevLimit, { kkdtype: "", standard: "" }]);
  };
  const handleAddRowKkd = () => {
    setKkd((prevKkd) => [...prevKkd, { k1: "", k2: "" }]);
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
          type: DocumentType.MonitoringReport2,
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
        <h3 className="col-3 large-title">Proje İzleme Raporu 2</h3>
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
      </div>

      <div className="col-12 row justify-content-center mb-3 px-5">
        <div className="row my-3 col-12 align-items-center justify-content-between">
          <p className="create-doc-p col-5">A. Proje Bilgileri</p>
          <button
            onClick={handleAddRowKkd}
            className="print-btn2 col-2"
            style={{ marginTop: "10px" }}
          >
            + Satır Ekle
          </button>
        </div>
        <table className="col-12 table-bordered table-striped">
          <tbody>
            {kkd.map((row, index) => (
              <tr key={row.index} className="row">
                <td className="col">
                  <input
                    className="create-doc-inp border-0"
                    type="text"
                    value={row.k1}
                    onChange={(e) =>
                      handleInputChangeKkd(index, "k1", e.target.value)
                    }
                  />
                </td>
                <td className="col">
                  <input
                    className="create-doc-inp border-0"
                    type="text"
                    value={row.k2}
                    onChange={(e) =>
                      handleInputChangeKkd(index, "k2", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="row justify-content-center col-12 p-3 px-5"
        style={{ borderBottom: "1px solid #ccc" }}
      >
        <p className="create-doc-p">Görüş</p>
        <textarea
          className="col-12 create-doc-textarea"
          field-short-name="field2"
          type="text"
        />
      </div>

      <div className="col-12 row justify-content-center px-5">
        <div className="row my-3 col-12 align-items-center justify-content-between">
          <p className="create-doc-p col-5">B. Proje Bilgileri</p>
          <button
            onClick={handleAddRowLimit}
            className="print-btn2 col-2"
            style={{ marginTop: "10px" }}
          >
            + Satır Ekle
          </button>
        </div>
        <table className="col-12 table-bordered table-striped">
          <tbody>
            {limit.map((row, index) => (
              <tr key={row.index} className="row">
                <td className="col">
                  <input
                    className="create-doc-inp border-0"
                    type="text"
                    value={row.kkdtype}
                    onChange={(e) =>
                      handleInputChange(index, "kkdtype", e.target.value)
                    }
                  />
                </td>
                <td className="col">
                  <input
                    className="create-doc-inp border-0"
                    type="text"
                    value={row.standard}
                    onChange={(e) =>
                      handleInputChange(index, "standard", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="row justify-content-center col-12 p-3 px-5"
        style={{ borderBottom: "1px solid #ccc" }}
      >
        <p className="create-doc-p">Görüş</p>
        <textarea
          className="col-12 create-doc-textarea"
          field-short-name="field3"
          type="text"
        />
      </div>

      <div className="row col-12 px-5 mt-3 justify-content-center column-gap-3">
        <div className="row mb-3 justify-content-center col-4 p-3">
          <label className="col-12 text-center create-doc-p mb-3">
            Kontrol Eden
          </label>
          <input
            className="col-12 create-doc-inp text-center"
            type="text"
            field-short-name="field1"
          />
        </div>
        <div className="row mb-3 justify-content-center col-4 p-3">
          <label className="col-12 text-center create-doc-p mb-3">
            Tanınan Son Tarih
          </label>
          <input
            className="col-12 create-doc-inp justify-content-center"
            type="date"
            field-short-name="field2"
          />
        </div>
      </div>
    </div>
  );
};

export default MonitoringReport2;
