import React, {useContext, useEffect, useState} from "react";
import { optionsList } from "../../Helpers/unitsHelper.js";
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

const Contract3 = () => {
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [manuelId, setManuelId] = useState("");
  const filteredValue = optionsList.includes(unit) ? unit : "";
  const [state, setState] = useState({
    parties: [{ id: 1, value: "" }],
    essence: [{ id: 1, name: "", date: "", value: "" }],
    fixture: [{ id: 1, name: "", amount: "", explanation: "" }],
  });
  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;
  const handleInputChange = (stateName, id, fieldName, newValue) => {
    setState((prevState) => {
      const updatedArray = prevState[stateName].map((item) =>
        item.id === id ? { ...item, [fieldName]: newValue } : item,
      );

      return {
        ...prevState,
        [stateName]: updatedArray,
      };
    });
  };

  const addNewRow = (stateName) => {
    setState((prevState) => ({
      ...prevState,
      [stateName]: [...prevState[stateName], { id: Date.now(), value: "" }],
    }));
  };

  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);
  const mode = queryParameters.get("mode") ?? DMode.Create;
  const handleSubmit = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};
      documentFields["states"] = JSON.stringify(state);

      elements.forEach((element) => {
        documentFields[element.getAttribute("field-short-name")] =
          element.value;
      });
      if (mode === DMode.Create) {
        await createDocument({
          title: title,
          shortName: "document",
          type: DocumentType.HireCont3,
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
    if (isRejected) {
      rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
    } else {
      acceptDocumentRevision(data.revision.documentId, data.revision.id);
    }

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

        setState(JSON.parse(doc.fields["states"].value));

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
        <h3 className="col-3 large-title">Sözleşme 3</h3>
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
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <div className="card-header create-doc-card-header">
              Sözleşme Bilgileri
            </div>
            <div className="card-body justify-content-center row">
              <div
                style={{ borderBottom: "1px solid #ccc" }}
                className="row py-3 col-12"
              >
                <div className="col-6 row">
                  <label className="col-11 create-doc-p mb-3">
                    Sözleşme Tarihi
                  </label>
                  <input
                    className="col-11 create-doc-inp"
                    field-short-name="date1"
                    type="date"
                  />
                </div>
                <div className="col-6 row">
                  <label className="col-11 create-doc-p mb-3">
                    Sözleşme No
                  </label>
                  <input
                    className="col-11 create-doc-inp"
                    field-short-name="field1"
                    type="number"
                  />
                </div>
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">
                  Madde 1. Sözleşmenin Konusu ve Kapsamı
                </p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field2"
                  type="text"
                />
              </div>

              <div
                className="row justify-content-between align-items-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p col-6">
                  Madde 2. Sözleşmenin Tarafları
                </p>
                <button
                  onClick={() => addNewRow("parties")}
                  className="print-btn2 col-3"
                >
                  + Taraf Ekle
                </button>
                <div>
                  <table
                    style={{
                      width: "100%",
                      border: "1px solid #ccc",
                      marginTop: "10px",
                    }}
                  >
                    <tbody>
                      {state.parties.map((item, index) => (
                        <tr key={item.id}>
                          <td
                            style={{
                              border: "1px solid #ccc",
                              padding: "10px",
                              textAlign: "center",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ccc",
                              padding: "10px",
                            }}
                          >
                            <input
                              key={item.id}
                              type="text"
                              className="w-100 border-0"
                              placeholder="Taraf Adı"
                              value={item.value}
                              onChange={(e) =>
                                handleInputChange(
                                  "parties",
                                  item.id,
                                  "value",
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

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Madde 3. Kiralananın Cinsi</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field3"
                  type="text"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Madde 4. Kiralanan Yerin Adresi</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field4"
                  type="text"
                />
              </div>
              <div className="row justify-content-center col-12 p-3">
                <p className="create-doc-p">
                  Madde 5. Kiraya Verenin İkametgahı
                </p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field5"
                  type="text"
                />
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Madde 6. Kira Karşılığı</p>
                <input
                  className="col-12 create-doc-inp"
                  field-short-name="field6"
                  placeholder="Bir aylık kira karşılığı"
                  type="text"
                />
                <input
                  className="col-12 create-doc-inp"
                  field-short-name="field7"
                  placeholder="Bir yıllık kira karşılığı"
                  type="text"
                />
              </div>

              <div
                className="row justify-content-between align-items-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p col-6">Madde 7.</p>
                <button
                  onClick={() => addNewRow("essence")}
                  className="print-btn2 col-3"
                >
                  + Satır Ekle
                </button>
                <div>
                  <table className="table-bordered w-100 mt-3">
                    <thead>
                      <tr>
                        <th className="p-3">Mahiyeti</th>
                        <th className="p-3">Tarih</th>
                        <th className="p-3">Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.essence.map((item) => (
                        <tr key={item.id}>
                          <td style={{ border: "1px solid #ccc" }}>
                            <input
                              className="col-12 create-doc-inp"
                              style={{ border: "0" }}
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                handleInputChange(
                                  "essence",
                                  item.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td style={{ border: "1px solid #ccc" }}>
                            <input
                              className="col-12 create-doc-inp"
                              type="date"
                              style={{ border: "0" }}
                              value={item.date}
                              onChange={(e) =>
                                handleInputChange(
                                  "essence",
                                  item.id,
                                  "date",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td style={{ border: "1px solid #ccc" }}>
                            <input
                              className="col-12 create-doc-inp"
                              type="number"
                              style={{ border: "0" }}
                              value={item.value}
                              onChange={(e) =>
                                handleInputChange(
                                  "essence",
                                  item.id,
                                  "value",
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

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Madde 7.1</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field8"
                  type="text"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Madde 7.2</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field9"
                  type="text"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Madde 7.3</p>
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
                <p className="create-doc-p">Madde 7.4</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field11"
                  type="text"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Madde 7.5</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field11"
                  type="text"
                />
              </div>
              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Madde 7.6</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  field-short-name="field12"
                  type="text"
                />
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">
                  Madde 8. Kiranın Ödenme Zamanı ve Şekli
                </p>
                <textarea
                  className="col-12 create-doc-textarea"
                  placeholder="Her ayın …….. gününe kadar aylık peşin olarak ödenecektir."
                  field-short-name="field13"
                  type="text"
                />
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">Madde 9. Kira Müddeti</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  placeholder="... yıl"
                  type="text"
                  field-short-name="field14"
                />
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">
                  Madde 10. Kiralananın Kullanım Amacı
                </p>
                <textarea
                  className="col-12 create-doc-textarea"
                  placeholder="Kullanım amacını giriniz..."
                  field-short-name="field15"
                  type="text"
                />
              </div>

              <div
                className="row justify-content-center col-12 p-3"
                style={{ borderBottom: "1px solid #ccc" }}
              >
                <p className="create-doc-p">
                  Madde 11. Kiralananın Sözleşme İmza Anındaki Durumu
                </p>
                <textarea
                  className="col-12 create-doc-textarea"
                  placeholder="Kullanıma elverişli tam ve eksiksizdir..."
                  field-short-name="field16"
                  type="text"
                />
              </div>

              <div className="row justify-content-center col-12 p-3">
                <p className="create-doc-p">Madde 12. Kiralananın m2 Değeri</p>
                <textarea
                  className="col-12 create-doc-textarea"
                  placeholder="Madde 12 içeriğini giriniz..."
                  field-short-name="field17"
                  type="text"
                />
              </div>

              <div className="row justify-content-between align-items-center col-12 p-3">
                <p className="create-doc-p col-6">Demirbaş Listesi</p>
                <button
                  onClick={() => addNewRow("fixture")}
                  className="print-btn2 col-3"
                >
                  + Demirbaş Ekle
                </button>
                <div>
                  <table className="table-bordered w-100 mt-3">
                    <thead>
                      <tr>
                        <th className="p-3">Malzeme Adı-Cinsi</th>
                        <th className="p-3">Miktarı</th>
                        <th className="p-3">Açıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.fixture.map((item) => (
                        <tr key={item.id}>
                          <td style={{ border: "1px solid #ccc" }}>
                            <input
                              className="col-12 create-doc-inp"
                              style={{ border: "0" }}
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                handleInputChange(
                                  "fixture",
                                  item.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td style={{ border: "1px solid #ccc" }}>
                            <input
                              className="col-12 create-doc-inp"
                              type="text"
                              style={{ border: "0" }}
                              value={item.amount}
                              onChange={(e) =>
                                handleInputChange(
                                  "fixture",
                                  item.id,
                                  "amount",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td style={{ border: "1px solid #ccc" }}>
                            <input
                              className="col-12 create-doc-inp"
                              type="text"
                              style={{ border: "0" }}
                              value={item.explanation}
                              onChange={(e) =>
                                handleInputChange(
                                  "fixture",
                                  item.id,
                                  "explanation",
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
  );
};

export default Contract3;
