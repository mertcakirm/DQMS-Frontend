import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App.jsx";
import { ActionPerm, checkPermFromRole } from "../../API/permissions.js";
import {
  changeDocument,
  createDocument,
  getDocumentFromId,
} from "../../API/Documents.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import { optionsList } from "../../Helpers/units.js";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import { DMode } from "../../Helpers/DMode.js";
import { useSearchParams } from "react-router-dom";
import UnauthPage from "../UnauthPage.jsx";

const PestleComp = () => {
  const [category, setCategory] = useState("political");
  const [effect1, setEffect1] = useState("");
  const [effect2, setEffect2] = useState("");
  const [description, setDescription] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [unit, setUnit] = useState("");
  const [title, setTitle] = useState("");
  const [manuelId, setManuelId] = useState("");
  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);
  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;

  const filteredValue = optionsList.includes(unit) ? unit : "";

  const mode = queryParameters.get("mode") ?? "create";
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
        console.log(doc);
        setEvaluations(JSON.parse(doc.fields["evaluations"].value));

        const elements = document.querySelectorAll("[field-short-name]");
        elements.forEach((element) => {
          const fieldShortName = element.getAttribute("field-short-name");
          element.value = doc.fields[fieldShortName].value;
        });
      })();
    }, []);
  }

  const handleSave = () => {
    if (effect1 && effect2 && description) {
      const newEvaluation = {
        category,
        effects: [effect1, effect2],
        description,
      };
      setEvaluations([...evaluations, newEvaluation]);
      setEffect1("");
      setEffect2("");
      setDescription("");
    } else {
      alert("Lütfen tüm alanları doldurun.");
    }
  };

  const handleDelete = (index) => {
    setEvaluations(evaluations.filter((_, i) => i !== index));
  };

  const savePageButtonClick = () => {
    if (evaluations == null || evaluations.length === 0) return;
    const elements = document.querySelectorAll("[field-short-name]");
    const documentFields = {};
    documentFields["evaluations"] = JSON.stringify(evaluations);
    elements.forEach((element) => {
      const fieldName = element.getAttribute("field-short-name");
      const elementTag = element.tagName.toLowerCase();
      let value = element.value;

      documentFields[fieldName] = value;
    });
    (async () => {
      if (mode === "create") {
        await createDocument({
          type: DocumentType.PESTLE,
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

  return (
    <div className="container-fluid p-5">
      <div
        className="row justify-content-between"
        style={{ padding: "0px 30px" }}
      >
        <h3 className="col-6 large-title">PESTLE ANALİZİ FORMATI</h3>
        <div
          className="col-6 row justify-content-end"
          style={{ columnGap: "10px" }}
        >
          {mode !== "viewRevision" && (
            <button className="col-2 print-btn2" onClick={savePageButtonClick}>
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

        <div className="col-12 mt-3">
          <div className="card">
            <div className="card-header create-doc-card-header">
              Değerlendirmeler
            </div>
            <div className="card-body row-gap-3 pt-3 row">
              <div
                className="row col-lg-6 row-gap-4 col-12"
                style={{ height: "300px" }}
              >
                <div className="row align-items-center col-12">
                  <label className="col-4 ">Kategoriler</label>
                  <select
                    className="col-8"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Politik Tespitler">Politik Tespitler</option>
                    <option value="Ekonomik Tespitler">
                      Ekonomik Tespitler
                    </option>
                    <option value="Sosyal Tespitler">Sosyal Tespitler</option>
                    <option value="Legal Tespitler">Legal Tespitler</option>
                  </select>
                </div>
                <div className="row col-12" style={{ columnGap: "10px" }}>
                  <label className="col-4" style={{ lineHeight: "50px" }}>
                    Etkiler
                  </label>
                  <div
                    className="col-8 align-items-center row"
                    style={{ columnGap: "10px" }}
                  >
                    <input
                      className="col-4 create-doc-inp"
                      type="text"
                      value={effect1}
                      onChange={(e) => setEffect1(e.target.value)}
                      placeholder="Fırsat"
                    />
                    <input
                      className="col-4 create-doc-inp"
                      type="text"
                      value={effect2}
                      placeholder="Tehdit"
                      onChange={(e) => setEffect2(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row col-12 mt-3">
                  <textarea
                    placeholder="Açıklama"
                    style={{ resize: "none" }}
                    className="create-doc-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="col-12 mt-3 row">
                  <button
                    className="col-12 ml-3 print-btn2"
                    onClick={handleSave}
                  >
                    Ekle
                  </button>
                </div>
              </div>

              {evaluations.length > 0 && (
                <div className="col-lg-6 col-12 mt-4 p-5">
                  <h4>Eklenen Değerlendirmeler</h4>
                  <ul className="list-group">
                    {evaluations.map((evaluation, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>Kategori:</strong> {evaluation.category}{" "}
                          <br />
                          <strong>Etkiler:</strong>Fırsatlar :{" "}
                          {evaluation.effects[0]} , Tehditler :{" "}
                          {evaluation.effects[1]} <br />
                          <strong>Açıklama:</strong> {evaluation.description}
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(index)}
                        >
                          Sil
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestleComp;
