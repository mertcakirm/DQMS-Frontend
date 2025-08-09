import {
  changeDocument,
  createDocument,
  getDocumentFromId,
} from "../../API/Documents.js";
import React, { useEffect, useState } from "react";
import { convertToUTC } from "../../API/convert.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import { DMode } from "../../Helpers/DMode.js";
import { getUsers } from "../../API/User.js";

const ExternalPopUp = ({ mode, id, popupCloser }) => {
  const [title, setTitle] = useState("");
  const [data, setData] = useState(null);
  const [manuelId, setManuelId] = useState("");
  const [userNames, setUserNames] = useState([]);

  const onSave = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};

      elements.forEach((element) => {
        const fieldName = element.getAttribute("field-short-name");
        let value = element.value;

        if (!value) {
          documentFields[fieldName] = "-";
        } else if (element.type === "date") {
          value = convertToUTC(value);
        }

        documentFields[fieldName] = value;
      });

      try {
        if (mode === DMode.Create) {
          await createDocument({
            type: DocumentType.ExternalDoc,
            shortName: "document",
            title: title,
            fields: documentFields,
            department: null,
            manuelId: manuelId,
          });
        } else if (mode === DMode.Revise) {
          await createDocumentRevision(id, documentFields);
        } else if (mode === DMode.Edit) {
          await changeDocument(id, documentFields);
        }

        popupCloser(false);
      } catch (error) {
        console.error("Error saving document:", error);
      }
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
        setTitle(doc.title);

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
    window.location.href="/dokuman/listesi";
    
  };
  useEffect(() => {
    (async () => {
      const users = await getUsers();
      setUserNames(users.map((user) => user.name + " " + user.surname));
    })();
  }, []);

  return (
    <div>
      <div className="popup-overlay">
        <div className="popup-content">
          <h4 className="large-title">Yeni Doküman Ekle</h4>
          <div>
            <div className="row p-5">
              <div className="col-6 row" style={{padding: "10px 40px "}}>
                <label className="purple-text">Döküman Adı</label>
                <input
                    className="create-doc-inp"
                    value={title}
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-6 row" style={{padding: "10px 40px "}}>
                <label className="purple-text">Döküman Numarası</label>
                <input
                    className="create-doc-inp"
                    value={manuelId}
                    type="text"
                    onChange={(e) => setManuelId(e.target.value)}
                />
              </div>

              <div className="col-6 row" style={{padding: "10px 40px "}}>
                <label className="purple-text">
                  Bir Sonraki Gözden Geçirme Tarihi
                </label>
                <input
                    className="create-doc-inp"
                    field-short-name="nextreview"
                    type="date"
                />
              </div>
              <div className="col-6 row" style={{padding: "10px 40px "}}>
                <label className="purple-text">Son Gözden Geçirme Tarihi</label>
                <input
                    className="create-doc-inp"
                    field-short-name="lastreview"
                    type="date"
                />
              </div>
              <div className="col-6 row" style={{padding: "10px 40px "}}>
                <label className="purple-text">Gözden Geçirme Sıklığı</label>
                <input
                    className="create-doc-inp"
                    field-short-name="review"
                    type="number"
                />
              </div>
              <div className="col-6 row" style={{padding: "10px 40px "}}>
                <label className="purple-text">Sorumlu Kişi</label>
                <select
                    className="create-doc-inp mt-3"
                    field-short-name="person"
                >
                  <option value="">Seçim Yapın</option>
                  {userNames.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                  ))}
                </select>
              </div>
              <div
                  className="col-12 row justify-content-between"
                  style={{padding: "10px 40px "}}
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

export default ExternalPopUp;
