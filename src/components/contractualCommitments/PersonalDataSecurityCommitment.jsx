import React, {useContext, useEffect, useState} from "react";
import { optionsList } from "../../Helpers/units.js";
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
import { DMode } from "../../Helpers/DMode.js";
import { useSearchParams } from "react-router-dom";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../UnauthPage.jsx";

const PersonalDataSecurityCommitment = () => {
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [manuelId, setManuelId] = useState("");
  const filteredValue = optionsList.includes(unit) ? unit : "";

  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);
  const mode = queryParameters.get("mode") ?? DMode.Create;

  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;

  const handleSubmit = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};

      elements.forEach((element) => {
        documentFields[element.getAttribute("field-short-name")] =
          (element.type ?? "") === "checkbox"
            ? element.checked.toString()
            : element.value;
      });

      if (mode === DMode.Create) {
        const documentId = await createDocument({
          title: title,
          shortName: "document",
          type: DocumentType.PersonalData,
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
        setUnit(doc.department);
        setManuelId(doc.manuelId);

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
        <h3 className="col-6 large-title">
          Kişisel Veri Güvenliği Taahütnamesi
        </h3>
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
                <p className="create-doc-p">1.Yükümlülükler</p>
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
                <p className="create-doc-p">
                  2.KVVK Taahhütnamesi(Taahüt Eden)
                </p>
                <div className="col-12 row justify-content-around">
                  <input
                      className="col-3 create-doc-inp"
                      placeholder="Adı Soyadı"
                      type="text"
                      field-short-name="field2"
                  />
                  <input
                      className="col-3 create-doc-inp"
                      placeholder="Ünvanı"
                      type="text"
                      field-short-name="field3"
                  />
                  <input
                      className="col-3 create-doc-inp"
                      placeholder="Ünvanı"
                      type="text"
                      field-short-name="field4"
                  />
                </div>
              </div>

              <div className="row justify-content-center col-12 p-3">
                <p className="create-doc-p">Taraf Türleri</p>
                <div className="row col-12">
                <div
                    className="col-12"
                    style={{
                      display: "flex",
                      columnGap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="create-doc-inp"
                      field-short-name="cb1"
                    />
                    <label>Kiracı Firması </label>
                  </div>
                  <div
                    className="col-12"
                    style={{
                      display: "flex",
                      columnGap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="create-doc-inp"
                      field-short-name="cb2"
                    />
                    <label>Girişimci</label>
                  </div>
                  <div
                    className="col-12"
                    style={{
                      display: "flex",
                      columnGap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="create-doc-inp"
                      field-short-name="cb3"
                    />
                    <label>Ticari Alan </label>
                  </div>
                  <div
                    className="col-12"
                    style={{
                      display: "flex",
                      columnGap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="create-doc-inp"
                      field-short-name="cb4"
                    />
                    <label>Danışman/Eğitmen</label>
                  </div>
                  <div
                    className="col-12"
                    style={{
                      display: "flex",
                      columnGap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="create-doc-inp"
                      field-short-name="cb5"
                    />
                    <label>Tedarikçi Firma</label>
                  </div>
                  <div
                    className="col-12"
                    style={{
                      display: "flex",
                      columnGap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="create-doc-inp"
                      field-short-name="cb6"
                    />
                    <label>Taşeron/Yüklenici Firma</label>
                  </div>
                  <div
                    className="col-12"
                    style={{
                      display: "flex",
                      columnGap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="create-doc-inp"
                      field-short-name="cb7"
                    />
                    <label>Diğer</label>
                    <input
                      type="text"
                      className="create-doc-inp"
                      field-short-name="field5"
                      style={{ height: "30px" }}
                    />
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

export default PersonalDataSecurityCommitment;
