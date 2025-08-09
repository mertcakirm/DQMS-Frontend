import {
  changeDocument,
  createDocument,
  getDocumentFromId,
} from "../../API/Documents.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import React, { useEffect, useState } from "react";
import { optionsList } from "../../Helpers/unitsHelper.js";
import { DMode } from "../../Helpers/DMode.js";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import alert from "bootstrap/js/src/alert.js";

const TargetPerPopup = ({ mode, id, popupCloser }) => {
  const [unit, setUnit] = useState("İK");
  const [data, setData] = useState(null);
  const filteredValue = optionsList.includes(unit) ? unit : "";

  const onSave = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};
      elements.forEach((element) => {
        const fieldName = element.getAttribute("field-short-name");
        let value = element.value;
        documentFields[fieldName] = value;
      });

        if (mode === DMode.Create) {
          await createDocument({
            type: DocumentType.Performance,
            shortName: "document",
            title: "performance",
            fields: documentFields,
            department: unit,
          });
          console.log("a")
        } else if (mode === DMode.Revise) {
          await createDocumentRevision(id, documentFields);
        } else if (mode === DMode.Edit) {
          await changeDocument(id, documentFields);
        }

        popupCloser(false);
    })();
  };

  if (mode !== DMode.Create) {
    if (!!!id) return;

    useEffect(() => {
      (async () => {
        let doc = await (mode === DMode.ViewRevision
          ? getRevision(id)
          : getDocumentFromId(id, true));

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
        setUnit(doc.department);

        const elements = document.querySelectorAll("[field-short-name]");
        elements.forEach((element) => {
          const fieldShortName = element.getAttribute("field-short-name");
          element.value = doc.fields[fieldShortName].value;
        });
      })();
    }, []);
  }

  const onRevisionResult = (isRejected) => {
    if (isRejected)
      rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
    else acceptDocumentRevision(data.revision.documentId, data.revision.id);
    window.location.href="/onay-bekleyen-revizyonlar";

  };

  return (
    <div>
      <div className="popup-overlay">
        <div className="popup-content">
          <h4 className="large-title">Yeni Değerlendirme Ekle</h4>
          <div>
            <div className="row p-5">
              <div className="col-12 row" style={{ padding: "10px 40px " }}>
                <label className="purple-text">Hedefler</label>
                <input
                  className="create-doc-inp"
                  type="text"
                  field-short-name="field1"
                />
              </div>
              <div className="col-6 row" style={{ padding: "10px 40px " }}>
                <label className="purple-text">Birim</label>
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
              <div className="col-6 row" style={{ padding: "10px 40px " }}>
                <label className="purple-text">Sayı</label>
                <input
                  className="create-doc-inp"
                  type="number"
                  field-short-name="field2"
                />
              </div>
              <div className="col-6 row" style={{ padding: "10px 40px " }}>
                <label className="purple-text">Kaynak</label>
                <input
                  className="create-doc-inp"
                  type="text"
                  field-short-name="field3"
                />
              </div>
              <div className="col-6 row" style={{ padding: "10px 40px " }}>
                <label className="purple-text">Termin Tarihi</label>
                <input
                  className="create-doc-inp"
                  type="date"
                  field-short-name="date1"
                />
              </div>
              <div className="col-6 row" style={{ padding: "10px 40px " }}>
                <label className="purple-text">Gerçekleşen Hedef</label>
                <input
                  className="create-doc-inp"
                  type="number"
                  field-short-name="field4"
                />
              </div>
              <div className="col-6 row" style={{ padding: "10px 40px " }}>
                <label className="purple-text">Hedefe Ulaşma Oranı</label>
                <input
                  className="create-doc-inp"
                  type="number"
                  field-short-name="field5"
                />
              </div>
              <div className="col-6 row" style={{ padding: "10px 40px " }}>
                <label className="purple-text">Gerçekleşen Bütçe</label>
                <input
                  className="create-doc-inp"
                  type="number"
                  field-short-name="field6"
                />
              </div>
              <div className="col-6 row" style={{ padding: "10px 40px " }}>
                <label className="purple-text">Bütçe Gerçekleşme Oranı</label>
                <input
                  className="create-doc-inp"
                  type="number"
                  field-short-name="field7"
                />
              </div>
              <div className="col-12 row" style={{ padding: "10px 40px " }}>
                <label className="purple-text">Açıklama</label>
                <input
                  className="create-doc-inp"
                  type="text"
                  field-short-name="field8"
                />
              </div>

              <div
                className="col-12 row justify-content-between"
                style={{ padding: "10px 40px " }}
              >
                <button
                  type="button"
                  onClick={() => {
                    popupCloser(false);
                  }}
                  className="btn print-btn2 mt-5 col-2"
                >
                  İptal
                </button>

                {mode !== DMode.ViewRevision && (
                  <button
                    className="btn print-btn2 mt-5 col-2"
                    onClick={onSave}
                  >
                    Kaydet
                  </button>
                )}
                {mode === DMode.ViewRevision && data != null && (
                  <>
                    <button
                      className="cbtn print-btn2 mt-5 col-2 success-btn-1"
                      onClick={() => onRevisionResult(false)}
                    >
                      Onayla
                    </button>
                    <button
                      className="btn print-btn2 mt-5 col-2 danger-btn-1"
                      onClick={() => onRevisionResult(true)}
                    >
                      Reddet
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetPerPopup;
