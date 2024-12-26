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
import { optionsList } from "../../Helpers/units.js";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../UnauthPage.jsx";

const MaintenancePlan = () => {
  const [devices, setDevices] = useState([
    { id: 1, deviceName: "", brand: "", model: "", maintenance: "" },
  ]);
  const [manuelId, setManuelId] = useState(null);
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const filteredValue = optionsList.includes(unit) ? unit : "";


  const handlePrint = () => {
    const elements = document.querySelectorAll("[field-short-name]");
    const documentFields = {};
    elements.forEach((element) => {
      documentFields[element.getAttribute("field-short-name")] = element.value;
    });

    const printableContent = `
      <!DOCTYPE html>
<html lang="tr">
<head>
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yıllık Bakım Planı</title>
    <style>
        .header-table, .info-table {
            border-collapse: collapse; /* Hücre kenarlarını birleştirir */
            margin: 0; /* Dış boşlukları kaldırır */
            padding: 0; /* İç boşlukları kaldırır */
        }

        .header-table td, .info-table td {
            border: 1px solid #000; /* Kenarlık ekler */
            padding: 0; /* İç boşluğu tamamen sıfırlar */
            margin: 0; /* Hücre kenarı boşluğunu sıfırlar */
        }

        .info-label {
            font-weight: bold; /* Bilgi başlıklarını vurgular */
        }

        body {
            font-family: sans-serif;
            margin: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }

        th {
            background-color: #f2f2f2;
        }

        .header-table {
            width: 100%;
            margin-bottom: 20px;
        }

        .header-table td {
            background-color: #f2f9ff;
            font-weight: bold;
            text-align: center;
            font-size: 1em;
        }

        .info-table {
            border-collapse: collapse;
            width: 100%;
        }

        .info-table .info-label {
            text-align: left;
            width: 40%;
            background-color: #f2f9ff;
        }
        
        .header-table .info-label {
            font-weight: normal;
        }

        .info-table td {
            border: 1px solid black;
            width: 60%;
        }

        .month-header {
            background-color: #ffddaa;
        }

        .month-header-empty {
            background-color: #ffffff;
            font-weight: normal;
        }

        .P-cell {
            background-color: #ffaaaa;
        }

        .G-cell {
            background-color: #aaffaa;
        }

        .centered-title {
            text-align: center;
            margin-right: 0; /* Reset margin */
            margin-bottom: 0;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            .header-table {
                float: none; /* Remove float for printing */
                page-break-inside: avoid; /* Prevent breaking the header across pages */
            }

            .header-table td {
                font-size: 0.8em; /* Smaller font size for printing */
            }

            .centered-title {
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td rowspan="2" style="width: 10%;"></td>
            <td colspan="4" style="font-size: 1.5em; text-align: center;">Yıllık Bakım Planı</td>
            <td rowspan="2" style="width: 20%;">
                <table class="info-table">
                    <tr>
                        <td>Dokuman No</td>
                        <td>${manuelId}</td>
                    </tr>
                    <tr>
                        <td>İlk Yayın Tarihi</td>
                        <td>${documentFields["p1"]}</td>
                    </tr>
                    <tr>
                        <td>Revizyon No</td>
                        <td>${data?.revisionCount || 0}</td>
                    </tr>
                    <tr>
                        <td>Yürürlük Tarihi</td>
                        <td>${documentFields["p2"]}</td>
                    </tr>
                    <tr>
                        <td>Sayfa No</td>
                        <td>${documentFields["p3"]}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    

    <table>
       <thead>
            <tr>
                <th rowspan="2">Sıra No</th>
                <th rowspan="2">Cihaz Adı</th>
                <th rowspan="2">Marka</th>
                <th rowspan="2">Model</th>
                <th class="month-header" colspan="2">1</th>
                <th class="month-header" colspan="2">2</th>
                 <th class="month-header" colspan="2">3</th>
                <th class="month-header" colspan="2">4</th>
                <th class="month-header" colspan="2">5</th>
                <th class="month-header" colspan="2">6</th>
                <th class="month-header" colspan="2">7</th>
                <th class="month-header" colspan="2">8</th>
                <th class="month-header" colspan="2">9</th>
                 <th class="month-header" colspan="2">10</th>
                <th class="month-header" colspan="2">11</th>
                <th class="month-header" colspan="2">12</th>

            </tr>
           <tr>
                <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                 <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                 <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                 <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                 <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                 <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                 <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                 <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                 <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                 <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
                 <th class="month-header-empty P-cell">P</th>
                <th class="month-header-empty G-cell">G</th>
           </tr>
        </thead>
        <tbody>
          ${
            devices == null
              ? ""
              : devices.map(
                  (device) =>
                    `<tr>
              <td>${device.id}</td>
              <td>${device.deviceName}</td>
              <td>${device.brand}</td>
              <td>${device.model}</td>
              ${Array.from({ length: 12 }, (_, i) => 1 + i).map((month) => {
                try {
                  if (device.maintenance == null) return "";

                  const array = device.maintenance.filter((m) =>
                    m.month.startsWith(month + "."),
                  );

                  return `
                       <td>${array.some((m) => m.status === "Planlanan (P)") ? "+" : "-"}</td>
                       <td>${array.some((m) => m.status === "Gerçekleşen (G)") ? "+" : "-"}</td>
                    `;
                } catch {
                  return "";
                }
              })}
            </tr>`,
                )
          }
        </tbody>
    </table>
</body>
</html>
  `;

    const printWindow = window.open(
      "",
      "_blank",
      "width=800, height=600, toolbar=no, status=no, menubar=no, scrollbars=no, resizable=no, visible=none",
    );

    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const addDeviceRow = () => {
    const newDevice = {
      id: Date.now(),
      deviceName: "",
      brand: "",
      model: "",
      maintenance: [],
    };
    setDevices([...devices, newDevice]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedDevices = devices.map((device, i) => {
      if (i === index) {
        return { ...device, [field]: value };
      }
      return device;
    });
    setDevices(updatedDevices);
  };

  const addMaintenance = (index, month, status) => {
    const newMaintenance = { id: Date.now(), month, status };
    const updatedDevices = devices.map((device, i) => {
      if (i === index) {
        return {
          ...device,
          maintenance: [...device.maintenance, newMaintenance],
        };
      }
      return device;
    });
    setDevices(updatedDevices);
  };

  const removeMaintenance = (deviceIndex, maintIndex) => {
    const updatedDevices = devices.map((device, i) => {
      if (i === deviceIndex) {
        const updatedMaintenance = device.maintenance.filter(
          (maint, index) => index !== maintIndex,
        );
        return { ...device, maintenance: updatedMaintenance };
      }
      return device;
    });
    setDevices(updatedDevices);
  };

  const removeDevice = (id) => {
    const updatedDevices = devices.filter((device) => device.id !== id);
    setDevices(updatedDevices);
  };

  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);
  const mode = queryParameters.get("mode") ?? DMode.Create;
  const handleSubmit = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};
      documentFields["devices"] = JSON.stringify(devices);

      elements.forEach((element) => {
        documentFields[element.getAttribute("field-short-name")] =
          element.value;
      });
      if (mode === DMode.Create) {
        await createDocument({
          title: title,
          shortName: "document",
          type: DocumentType.MainTenance,
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
        setDevices(JSON.parse(doc.fields["devices"].value));
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
        <h3 className="col-6 large-title">Yıllık Bakım Planı</h3>

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
          <button className="col-2 print-btn" onClick={handlePrint}>
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

        <div className="card mt-5 p-0">
          <div className="card-header text-center create-doc-card-header">
            Cihaz Bilgileri
          </div>
          <div className="card-body justify-content-between px-5 row">
            <div className="row pt-3">
              <div className="row col-12 justify-content-between">
                <p className="smalltitle col-6">Cihaz Tablosu</p>
                <button className="print-btn2 col-2" onClick={addDeviceRow}>
                  + Cihaz Ekle
                </button>
              </div>
              <div className="col-12">
                <table className="table table-bordered mt-3">
                  <thead>
                    <tr>
                      <th>Sıra No</th>
                      <th>Cihaz Adı</th>
                      <th>Marka</th>
                      <th>Model</th>
                      <th>Bakım Ayları ve Durumu</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device, deviceIndex) => (
                      <tr key={deviceIndex}>
                        <td>{deviceIndex + 1}</td>

                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={device.deviceName}
                            onChange={(e) =>
                              handleInputChange(
                                deviceIndex,
                                "deviceName",
                                e.target.value,
                              )
                            }
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={device.brand}
                            onChange={(e) =>
                              handleInputChange(
                                deviceIndex,
                                "brand",
                                e.target.value,
                              )
                            }
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={device.model}
                            onChange={(e) =>
                              handleInputChange(
                                deviceIndex,
                                "model",
                                e.target.value,
                              )
                            }
                          />
                        </td>

                        <td>
                          <div>
                            {device &&
                            Array.isArray(device.maintenance) &&
                            device.maintenance.length > 0 ? (
                              device.maintenance.map((maint, maintIndex) => (
                                <div
                                  key={maintIndex}
                                  className="d-flex align-items-center mb-1"
                                >
                                  <span className="me-2">
                                    {maint.month} ({maint.status})
                                  </span>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                      removeMaintenance(deviceIndex, maintIndex)
                                    }
                                  >
                                    Sil
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p>Bakım bilgisi bulunamadı.</p>
                            )}
                          </div>

                          <div className="mt-2">
                            <select
                              id={`status-select-${deviceIndex}`}
                              className="form-select mb-2"
                            >
                              <option value="">Durum Seçiniz</option>
                              <option value="Planlanan (P)">
                                Planlanan (P)
                              </option>
                              <option value="Gerçekleşen (G)">
                                Gerçekleşen (G)
                              </option>
                            </select>

                            <select
                              className="form-select mb-2"
                              onChange={(e) => {
                                const month = e.target.value;
                                const statusSelect = document.getElementById(
                                  `status-select-${deviceIndex}`,
                                );
                                const status = statusSelect.value;
                                addMaintenance(deviceIndex, month, status);
                              }}
                            >
                              <option value="">Ay Seçiniz</option>
                              {[...Array(12)].map((_, i) => (
                                <option key={i} value={`${i + 1}. Ay`}>
                                  {i + 1}. Ay
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeDevice(device.id)}
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
      </div>
    </div>
  );
};

export default MaintenancePlan;
