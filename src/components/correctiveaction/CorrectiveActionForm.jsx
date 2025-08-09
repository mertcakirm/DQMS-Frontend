import React, { useContext, useEffect, useState } from "react";
import {
  changeDocument,
  createDocument,
  getDocumentFromId,
} from "../../API/Documents.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import { optionsList } from "../../Helpers/unitsHelper.js";
import { getUsers } from "../../API/User.js";
import { useSearchParams } from "react-router-dom";
import { DMode } from "../../Helpers/DMode.js";
import {
  acceptDocumentRevision,
  createDocumentRevision,
  getRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import { UserContext } from "../../App.jsx";
import { ActionPerm, checkPermFromRole } from "../../API/permissions.js";
import UnauthPnl from "../other/unauthPnl.jsx";
import UnauthPage from "../other/UnauthPage.jsx";
const CorrectiveActionForm = () => {
  const [immediateCorrections, setImmediateCorrections] = useState([
    { id: Date.now(), name: "", deadline: "" },
  ]);
  const [correctiveActions, setCorrectiveActions] = useState([
    { id: Date.now(), name: "", deadline: "" },
  ]);
  const [activityTracking, setActivityTracking] = useState([]);
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [userNames, setUserNames] = useState([]);
  const [closingApproval, setClosingApproval] = useState({
    tasksCompleted: null,
    documentsReviewed: null,
    followUpRequired: null,
    followUpDone: null,
  });
  const [manuelId, setManuelId] = useState("");

  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;

  const addActivityTrackingRow = () => {
    setActivityTracking([
      ...activityTracking,
      { id: Date.now(), description: "", status: null, approvalDate: "" },
    ]);
  };
  const filteredValue = optionsList.includes(unit) ? unit : "";

  const deleteActivityTrackingRow = (id) => {
    setActivityTracking(activityTracking.filter((row) => row.id !== id));
  };

  const addImmediateCorrection = () => {
    setImmediateCorrections([
      ...immediateCorrections,
      { id: Date.now(), name: "", deadline: "" },
    ]);
  };

  const deleteImmediateCorrection = (id) => {
    const updatedRows = immediateCorrections.filter((row) => row.id !== id);
    setImmediateCorrections(updatedRows);
  };

  const addCorrectiveAction = () => {
    setCorrectiveActions([
      ...correctiveActions,
      { id: Date.now(), name: "", deadline: "" },
    ]);
  };

  const deleteCorrectiveAction = (id) => {
    const updatedRows = correctiveActions.filter((row) => row.id !== id);
    setCorrectiveActions(updatedRows);
  };

  const savePageButtonClick = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};

      elements.forEach((element) => {
        documentFields[element.getAttribute("field-short-name")] =
          element.type === "checkbox" ? element.checked : element.value;
      });

      documentFields["listImmediateCorrections"] =
        JSON.stringify(immediateCorrections);
      documentFields["listCorrectiveActions"] =
        JSON.stringify(correctiveActions);
      documentFields["listActivityTracking"] = JSON.stringify(activityTracking);

      const radioElementsGroups = Object.groupBy(
        document.querySelectorAll("[field-radio-name]"),
        (element) => element.getAttribute("field-radio-name"),
      );

      for (const [key, group] of Object.entries(radioElementsGroups)) {
        const checkedElement = group.find((element) => element.checked);

        if (checkedElement != null) {
          documentFields[key] =
            checkedElement.value.toLowerCase() === "evet" ? "true" : "false";
        }
      }

      if (mode === DMode.Create) {
        await createDocument({
          type: DocumentType.CorrectiveAction,
          shortName: "document",
          title: title,
          fields: documentFields,
          department: unit,
          ManuelId: manuelId,
        });
      } else if (mode === DMode.Revise) {
        await createDocumentRevision(queryParameters.get("id"), documentFields);
      } else if (mode === DMode.Edit) {
        await changeDocument(queryParameters.get("id"), documentFields);
      }

      window.location.href = "/duzeltici-faaliyet/cizelge";
    })();
  };

  useEffect(() => {
    (async () => {
      const users = await getUsers();
      setUserNames(users.map((user) => user.name + " " + user.surname));
    })();
  }, []);

  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);

  const mode = queryParameters.get("mode") ?? DMode.Create;

  if (mode !== DMode.Create) {
    const getId = queryParameters.get("id");

    if (!!!getId) return;

    useEffect(() => {
      (async () => {
        const doc = await (mode === DMode.ViewRevision
          ? getRevision(getId)
          : getDocumentFromId(getId, true));

        if (!!!doc) return;

        setData(doc);

        const dres = (
          mode !== DMode.ViewRevision
            ? doc
            : await getDocumentFromId(doc.revision.documentId)
        ).document;

        setTitle(dres.title);
        setUnit(dres.department);
        setManuelId(dres.manuelId);
        setData(doc);

        setImmediateCorrections(
          JSON.parse(doc.fields["listImmediateCorrections"].value),
        );
        setCorrectiveActions(
          JSON.parse(doc.fields["listCorrectiveActions"].value),
        );
        setActivityTracking(
          JSON.parse(doc.fields["listActivityTracking"].value),
        );

        setClosingApproval({
          tasksCompleted:
            doc.fields["radio1"].value === "true" ? "Evet" : "Hayır",
          documentsReviewed:
            doc.fields["radio2"].value === "true" ? "Evet" : "Hayır",
          followUpRequired:
            doc.fields["radio3"].value === "true" ? "Evet" : "Hayır",
          followUpDone:
            doc.fields["radio4"].value === "true" ? "Evet" : "Hayır",
        });

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

  const onRevisionResult = (isRejected) => {
    if (isRejected)
      rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
    else acceptDocumentRevision(data.revision.documentId, data.revision.id);
    window.location.href = "/onay-bekleyen-revizyonlar";
  };

  return (
    <div className="container-fluid p-5">
      <div className="row justify-content-between">
        <h3 className="col-6 large-title">Düzeltici Faaliyet Formu</h3>
        <div
          className="col-6 row justify-content-end"
          style={{ columnGap: "10px" }}
        >
          {mode !== "viewRevision" && (
            <button className="col-3 print-btn2" onClick={savePageButtonClick}>
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
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header text-center create-doc-card-header">
              Doküman Bilgileri
            </div>
            <div
              className="card-body justify-content-center px-5 row"
              style={{ columnGap: "20px" }}
            >
              <div className="row mb-3 justify-content-between col-3 pb-3">
                <label className="col-12 text-center create-doc-p mb-3">
                  Döküman Başlığı
                </label>
                <input
                  className="create-doc-inp col-12"
                  name="title"
                  value={title}
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="row mb-3 justify-content-center col-3 pb-3">
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
              <div className="row mb-3 justify-content-center col-3 pb-3">
                <label className="col-12 text-center create-doc-p mb-3">
                  İlk Yayın Tarihi
                </label>
                <input
                  className="col-12 create-doc-inp"
                  type="date"
                  field-short-name="p1"
                />
              </div>
              <div className="row mb-3 justify-content-center col-3 pb-3">
                <label className="col-12 text-center create-doc-p mb-3">
                  Yürürlük Tarihi
                </label>
                <input
                  className="col-12 create-doc-inp"
                  type="date"
                  field-short-name="p2"
                />
              </div>
              <div className="row mb-3 justify-content-center col-3 pb-3">
                <label className="col-12 text-center create-doc-p mb-3">
                  Sayfa No
                </label>
                <input
                  className="col-12 create-doc-inp"
                  type="number"
                  field-short-name="p3"
                />
              </div>
              <div className="row mb-3 justify-content-center col-3 pb-3">
                <label className="col-12 text-center create-doc-p mb-3">
                  Departman
                </label>
                <select
                  className="create-doc-inp col-12"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
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

      <div className="row justify-content-center mt-5 p-5 pt-0">
        <div className="col-12">
          <ul
            className="nav nav-pills mb-3 row justify-content-between create-doc-card-header p-0"
            style={{ borderRadius: "30px" }}
            id="pills-tab"
            role="tablist"
          >
            <li
              className="nav-item col-3 row justify-content-center"
              role="presentation"
            >
              <button
                className="nav-link active"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Uygunsuzluk Tespiti
              </button>
            </li>
            <li
              className="nav-item col-3 row justify-content-center"
              role="presentation"
            >
              <button
                className="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                Yönetim Sistemleri
              </button>
            </li>
            <li
              className="nav-item col-3 row justify-content-center"
              role="presentation"
            >
              <button
                className="nav-link"
                id="pills-contact-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-contact"
                type="button"
                role="tab"
                aria-controls="pills-contact"
                aria-selected="false"
              >
                Kök Neden Analizi
              </button>
            </li>
            <li
              className="nav-item col-3 row justify-content-center"
              role="presentation"
            >
              <button
                className="nav-link"
                id="pills-disabled-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-disabled"
                type="button"
                role="tab"
                aria-controls="pills-disabled"
                aria-selected="false"
              >
                Faaliyet Takibi
              </button>
            </li>
          </ul>
        </div>
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
            tabIndex="0"
          >
            <div className="card">
              <div className="card-header text-center create-doc-card-header">
                Uygunsuzluk Tespiti
              </div>
              <div className="card-body justify-content-between px-5 row">
                <div
                  className="row col-6 py-3 align-items-center"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <label className="col-7 create-doc-p">
                    Uygunsuzluk Tespit Edilen Departman
                  </label>
                  <select
                    className="create-doc-inp col-5"
                    field-short-name="select1"
                  >
                    {optionsList.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="row col-6 align-items-center py-3"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <label className="col-3 create-doc-p">Tarih</label>
                  <input
                    className="col-3 create-doc-inp"
                    type="date"
                    field-short-name="date1"
                  />
                </div>

                <div
                  className="row justify-content-center col-12 p-3"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <p className="create-doc-p">Uygunsuzluk Tanımı:</p>
                  <textarea
                    className="col-12 create-doc-textarea"
                    type="text"
                    field-short-name="field1"
                  />
                </div>

                <div
                  className="row col-6 align-items-center justify-content-between py-3"
                  style={{ borderRight: "1px solid #ccc" }}
                >
                  <label className="col-12 text-center create-doc-p">
                    DF Bildiren Kişi
                  </label>
                  <select className="col-5 mt-3" field-short-name="select2">
                    {userNames.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="col-5 create-doc-inp"
                    type="date"
                    field-short-name="date2"
                  />
                </div>
                <div
                  className="row col-6 align-items-center justify-content-between py-3"
                  style={{ borderRight: "1px solid #ccc" }}
                >
                  <label className="col-12 text-center create-doc-p">
                    DF Takibinden Sorumlu Kişi
                  </label>
                  <select className="col-5 mt-3" field-short-name="select3">
                    {userNames.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="col-5 create-doc-inp"
                    type="date"
                    field-short-name="date3"
                  />
                </div>
              </div>
            </div>

            <div className="row justify-content-end p-3">
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

          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
            tabIndex="0"
          >
            <div className="card">
              <div className="card-header text-center create-doc-card-header">
                Yönetim Sistemleri
              </div>
              <div className="card-body justify-content-between px-5 row">
                <div
                  className="row justify-content-center align-items-center col-4 p-3"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <p className="create-doc-p col-8">Düzeltici Faaliyet No</p>
                  <input
                    className="col-4 create-doc-inp"
                    type="number"
                    field-short-name="field2_1"
                  />
                </div>

                <div
                  className="row col-4 justify-content-center align-items-center py-3"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <label className="col-8 create-doc-p">
                    Düzeltici Faaliyet Açılış Tarihi
                  </label>
                  <input
                    className="col-4 create-doc-inp"
                    type="date"
                    field-short-name="date2_1"
                  />
                </div>

                <div
                  className="row col-4 py-3 align-items-center"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <label className="col-8 create-doc-p">
                    Düzeltici Faaliyet Sınıflandırması
                  </label>
                  <select
                    className="create-doc-inp col-4"
                    field-short-name="select2_1"
                  >
                    {optionsList.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="row justify-content-between p-3"
                  style={{ rowGap: "10px" }}
                >
                  <label className="col-12 create-doc-p">
                    Referans Doküman
                  </label>
                  <div className="row col-5 align-items-center">
                    <input
                      className="col-1"
                      type="checkbox"
                      field-short-name="check2_1"
                    />
                    <label className="col p-0">İç/Dış Denetim Rapor No:</label>
                    <input
                      className="col create-doc-textarea"
                      type="number"
                      field-short-name="checkNumber2_1"
                    />
                  </div>
                  <div className="row col-5 align-items-center">
                    <input
                      className="col-1"
                      type="checkbox"
                      field-short-name="check2_2"
                    />
                    <label className="col p-0">Üst Yönetim Talebi</label>
                  </div>
                  <div className="row col-5 align-items-center">
                    <input
                      className="col-1"
                      type="checkbox"
                      field-short-name="check2_3"
                    />
                    <label className="col p-0">Müşteri Şikayeti</label>
                  </div>
                  <div className="row col-5 align-items-center">
                    <input
                      className="col-1"
                      type="checkbox"
                      field-short-name="check2_4"
                    />
                    <label className="col p-0">Saha Gözlemi</label>
                  </div>
                  <div className="row col-5 align-items-center">
                    <input
                      className="col-1"
                      type="checkbox"
                      field-short-name="check2_5"
                    />
                    <label className="col p-0">Diğer</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-end p-3">
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

          <div
            className="tab-pane fade"
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
            tabIndex="0"
          >
            <div className="card">
              <div className="card-header text-center create-doc-card-header">
                Kök Neden Analizi
              </div>
              <div className="card-body justify-content-between px-5 row">
                <div
                  className="row justify-content-center col-12 p-3"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <p className="create-doc-p">Kök Neden Analizi</p>
                  <textarea
                    className="col-12 create-doc-textarea"
                    field-short-name="field3_1"
                  />
                </div>
                <div
                  className="row justify-content-center col-12 p-3"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <p className="create-doc-p">Hata Nedenleri</p>
                  <textarea
                    className="col-12 create-doc-textarea"
                    field-short-name="field3_2"
                  />
                </div>
                <div
                  className="row col-6 py-3 align-items-center"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <label className="col-7 create-doc-p">
                    Kök Neden Analizini Hazırlayan
                  </label>
                  <select className="col-5" field-short-name="select3_1">
                    <option value="">Seçim Yapın</option>
                    {userNames.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="row col-6 align-items-center py-3"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <label className="col-3 create-doc-p">Tarih</label>
                  <input
                    className="col-3 create-doc-inp"
                    type="date"
                    field-short-name="date3_1"
                  />
                </div>

                <div className="row col-12">
                  <div className="row col-6">
                    <div className="row py-5 justify-content-between col-12">
                      <h3 className="col-8">Acil Düzeltme</h3>
                      <button
                        className="col-3 print-btn2"
                        style={{ height: "45px" }}
                        onClick={addImmediateCorrection}
                      >
                        + Ekle
                      </button>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Acil Düzeltme</th>
                          <th>Sorumlu</th>
                          <th>Termin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {immediateCorrections.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <input
                                type="text"
                                value={row.name}
                                onChange={(e) => {
                                  const updatedRows = immediateCorrections.map(
                                    (r) =>
                                      r.id === row.id
                                        ? { ...r, name: e.target.value }
                                        : r,
                                  );
                                  setImmediateCorrections(updatedRows);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={row.deadline}
                                onChange={(e) => {
                                  const updatedRows = immediateCorrections.map(
                                    (r) =>
                                      r.id === row.id
                                        ? {
                                            ...r,
                                            deadline: e.target.value,
                                          }
                                        : r,
                                  );
                                  setImmediateCorrections(updatedRows);
                                }}
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  deleteImmediateCorrection(row.id)
                                }
                              >
                                Sil
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="row col-6">
                    <div className="row justify-content-between py-5 col-12">
                      <h3 className="col-8">Düzeltici Faaliyet (Aksiyon)</h3>
                      <button
                        className="col-3 print-btn2"
                        style={{ height: "45px" }}
                        onClick={addCorrectiveAction}
                      >
                        + Ekle
                      </button>
                    </div>

                    <table>
                      <thead>
                        <tr>
                          <th>Düzeltici Faaliyet (Aksiyon)</th>
                          <th>Sorumlu</th>
                          <th>Termin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {correctiveActions.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <input
                                type="text"
                                value={row.name}
                                onChange={(e) => {
                                  const updatedRows = correctiveActions.map(
                                    (r) =>
                                      r.id === row.id
                                        ? {
                                            ...r,
                                            name: e.target.value,
                                          }
                                        : r,
                                  );
                                  setCorrectiveActions(updatedRows);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={row.deadline}
                                onChange={(e) => {
                                  const updatedRows = correctiveActions.map(
                                    (r) =>
                                      r.id === row.id
                                        ? {
                                            ...r,
                                            deadline: e.target.value,
                                          }
                                        : r,
                                  );
                                  setCorrectiveActions(updatedRows);
                                }}
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteCorrectiveAction(row.id)}
                              >
                                Sil
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-end p-3">
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

          <div
            className="tab-pane fade"
            id="pills-disabled"
            role="tabpanel"
            aria-labelledby="pills-disabled-tab"
            tabIndex="0"
          >
            <div className="card">
              <div className="card-header text-center create-doc-card-header">
                Faaliyet Takibi
              </div>
              <div className="card-body justify-content-between px-5 row">
                <div
                  className="row justify-content-center py-3"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <div className="row mb-3 justify-content-end">
                    <button
                      className="col-2 print-btn2"
                      onClick={addActivityTrackingRow}
                    >
                      + Ekle
                    </button>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Faaliyet Takibi</th>
                        <th>Değerlendirme</th>
                        <th>Onay Tarihi</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityTracking.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <input
                              type="text"
                              className="create-doc-inp"
                              value={row.description}
                              onChange={(e) =>
                                setActivityTracking(
                                  activityTracking.map((r) =>
                                    r.id === row.id
                                      ? { ...r, description: e.target.value }
                                      : r,
                                  ),
                                )
                              }
                            />
                          </td>
                          <td>
                            <select
                              value={row.status || ""}
                              onChange={(e) =>
                                setActivityTracking(
                                  activityTracking.map((r) =>
                                    r.id === row.id
                                      ? { ...r, status: e.target.value }
                                      : r,
                                  ),
                                )
                              }
                            >
                              <option value="">Seç</option>
                              <option value="Tamamlandı">Tamamlandı</option>
                              <option value="Tamamlanmadı">Tamamlanmadı</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="date"
                              value={row.approvalDate}
                              onChange={(e) =>
                                setActivityTracking(
                                  activityTracking.map((r) =>
                                    r.id === row.id
                                      ? { ...r, approvalDate: e.target.value }
                                      : r,
                                  ),
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteActivityTrackingRow(row.id)}
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Kapanış Onayı */}
                <div
                  className="row justify-content-center py-3"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <h3>Kapanış Onayı</h3>
                  <div className="row pt-4" style={{ rowGap: "20px" }}>
                    <label className="col-5">
                      Tüm faaliyetler tamamlandı mı?
                    </label>
                    <div className="row align-items-center col-6">
                      <input
                        field-radio-name="radio1"
                        type="radio"
                        name="tasksCompleted"
                        value="Evet"
                        className="w-auto"
                        checked={closingApproval.tasksCompleted === "Evet"} // Doğru kontrol
                        onChange={() =>
                          setClosingApproval({
                            ...closingApproval,
                            tasksCompleted: "Evet",
                          })
                        }
                      />{" "}
                      <label className="col-3">Evet</label>
                      <input
                        field-radio-name="radio1"
                        type="radio"
                        name="tasksCompleted"
                        value="Hayır"
                        className="w-auto"
                        checked={closingApproval.tasksCompleted === "Hayır"}
                        onChange={() =>
                          setClosingApproval({
                            ...closingApproval,
                            tasksCompleted: "Hayır",
                          })
                        }
                      />{" "}
                      <label className="col-3">Hayır</label>
                    </div>
                    <br />
                    <label className="col-5">
                      Faaliyetlere bağlı oluşturulan veya revize edilen
                      dokümanlar kontrol edildi mi?
                    </label>
                    <div className="row align-items-center col-6">
                      <input
                        field-radio-name="radio2"
                        type="radio"
                        name="documentsReviewed"
                        value="Evet"
                        className="w-auto"
                        checked={closingApproval.documentsReviewed === "Evet"} // Doğru kontrol
                        onChange={() =>
                          setClosingApproval({
                            ...closingApproval,
                            documentsReviewed: "Evet",
                          })
                        }
                      />{" "}
                      <label className="col-3">Evet</label>
                      <input
                        field-radio-name="radio2"
                        type="radio"
                        name="documentsReviewed"
                        value="Hayır"
                        className="w-auto"
                        checked={closingApproval.documentsReviewed === "Hayır"}
                        onChange={() =>
                          setClosingApproval({
                            ...closingApproval,
                            documentsReviewed: "Hayır",
                          })
                        }
                      />{" "}
                      <label className="col-3">Hayır</label>
                    </div>
                    <br />
                    <label className="col-5">
                      Yerinde takip denetimi gerekli mi?
                    </label>
                    <div className="row align-items-center col-6">
                      <input
                        field-radio-name="radio3"
                        type="radio"
                        name="followUpRequired"
                        value="Evet"
                        className="w-auto"
                        checked={closingApproval.followUpRequired === "Evet"} // Doğru kontrol
                        onChange={() =>
                          setClosingApproval({
                            ...closingApproval,
                            followUpRequired: "Evet",
                          })
                        }
                      />{" "}
                      <label className="col-3">Evet</label>
                      <input
                        field-radio-name="radio3"
                        type="radio"
                        name="followUpRequired"
                        value="Hayır"
                        className="w-auto"
                        checked={closingApproval.followUpRequired === "Hayır"}
                        onChange={() =>
                          setClosingApproval({
                            ...closingApproval,
                            followUpRequired: "Hayır",
                          })
                        }
                      />{" "}
                      <label className="col-3">Hayır</label>
                    </div>
                    <br />
                    <label className="col-5">
                      Yerinde takip denetimi yapıldı mı?
                    </label>
                    <div className="row align-items-center col-6">
                      <input
                        field-radio-name="radio4"
                        type="radio"
                        name="followUpDone"
                        value="Evet"
                        className="w-auto"
                        checked={closingApproval.followUpDone === "Evet"} // Doğru kontrol
                        onChange={() =>
                          setClosingApproval({
                            ...closingApproval,
                            followUpDone: "Evet",
                          })
                        }
                      />{" "}
                      <label className="col-3">Evet</label>
                      <input
                        field-radio-name="radio4"
                        type="radio"
                        name="followUpDone"
                        value="Hayır"
                        className="w-auto"
                        checked={closingApproval.followUpDone === "Hayır"}
                        onChange={() =>
                          setClosingApproval({
                            ...closingApproval,
                            followUpDone: "Hayır",
                          })
                        }
                      />{" "}
                      <label className="col-3">Hayır</label>
                    </div>

                    <br />
                  </div>
                </div>

                {/* Kapatma - Açıklama */}

                <div
                  className="row justify-content-center py-3"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <h3>Kapatma - Açıklama</h3>
                  <div className="row justify-content-between pt-5">
                    <div className="row mb-3 justify-content-center col-5 pb-3">
                      <label className="col-12  create-doc-p mb-3">
                        Ad Soyad
                      </label>
                      <input
                        className="col-12 create-doc-inp"
                        type="text"
                        field-short-name="field4_1"
                      />
                    </div>
                    <div className="row mb-3 justify-content-center col-5 pb-3">
                      <label className="col-12  create-doc-p mb-3">Tarih</label>
                      <input
                        className="col-12 create-doc-inp"
                        name="firstPublishDate"
                        type="date"
                        field-short-name="date4_1"
                      />
                    </div>
                    <div className="row justify-content-center col-12 ">
                      <p className="create-doc-p">Açıklama</p>
                      <textarea
                        className="col-12 create-doc-textarea"
                        type="text"
                        field-short-name="field4_2"
                      />
                    </div>
                  </div>
                </div>

                {/* Yönetim Onayları */}
                <div className="row justify-content-center py-3">
                  <h3>Yönetim Onayları</h3>
                  <div className="row justify-content-between col-12 p-3">
                    <div className="col-5 mb-3">
                      <label className="col-12 create-doc-p mb-3">
                        Yönetim Sistemleri Sorumlusu
                      </label>
                      <input
                        type="text"
                        className="col-12 create-doc-inp"
                        field-short-name="field4_3"
                      />
                    </div>
                    <div className="col-5 mb-3">
                      <label className="col-12 create-doc-p mb-3">
                        Genel Müdür Yardımcısı
                      </label>
                      <input
                        type="text"
                        className="col-12 create-doc-inp"
                        field-short-name="field4_4"
                      />
                    </div>
                    <div className="col-5 mb-3">
                      <label className="col-12 create-doc-p mb-3">
                        {" "}
                        Onay Tarihi
                      </label>
                      <input
                        type="date"
                        className="col-12 create-doc-inp"
                        field-short-name="date4_2"
                      />
                    </div>
                    <div className="col-5 mb-3">
                      <label className="col-12 create-doc-p mb-3">
                        Onay Tarihi
                      </label>
                      <input
                        type="date"
                        className="col-12 create-doc-inp"
                        field-short-name="date4_3"
                      />
                    </div>
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

export default CorrectiveActionForm;
