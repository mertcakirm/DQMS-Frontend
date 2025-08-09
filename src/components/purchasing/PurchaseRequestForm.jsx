import React, {useContext, useEffect, useState} from "react";
import { optionsList } from "../../Helpers/unitsHelper.js";
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
import UnauthPage from "../other/UnauthPage.jsx";

const PurchaseRequestForm = () => {
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [manuelId, setManuelId] = useState("");
  const filteredValue = optionsList.includes(unit) ? unit : "";
  const [rows, setRows] = useState([
    {
      date: "",
      material: "",
      properties: "",
      reason: "",
      quantity: "",
      price: "",
      amount: 0,
    },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const addRow = () => {
    setRows([
      ...rows,
      {
        date: "",
        material: "",
        properties: "",
        reason: "",
        quantity: "",
        price: "",
        amount: "",
      },
    ]);
  };
  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;
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
    <title>Satın Alma Talep Formu</title>
   <style>
        body {
            font-family: sans-serif;
            margin: 0;
            min-height: 100vh;
              display: flex;
            flex-direction: column;
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


        .header-table td {
            font-weight: bold;
            text-align: center;
            font-size: 1em;
        }


        .info-table .info-label {
            text-align: left;
            width: 40%;
        }
        
        .header-table .info-label {
            font-weight: normal;
        }

        .info-table td {
            border: 1px solid black;
            width: 60%;
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
        .main-table th, .main-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            height: 40px;
        }
          .main-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

         .payment-table td {
              border: 1px solid black;
              padding: 8px;
            text-align: center;
            }
            .payment-table .payment-label {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: left;
            }

        

         .signature-table td {
            border: 1px solid black;
            padding: 15px;
            text-align: left;
            vertical-align: top; /* Metni hücrenin üst kısmına hizala */
          }
           .signature-table .signature-title {
            font-weight: bold;
             text-align: center;
        }
        
         .signature-table .signature-label {
              font-weight: normal;
         }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh; /* Sayfa yüksekliğinin tamamını kaplar */
            margin: 0;
            background-color: #f5f5f5; /* İsteğe bağlı arka plan rengi */
        }

        td {
            padding: 10px; /* Hücre içi boşluk */
            border: 1px solid #ddd; /* Hücre kenarlığı */
        }


        .header-table td, .info-table td {
            border: 1px solid #000; /* Kenarlık ekler */
            padding: 0; /* İç boşluğu tamamen sıfırlar */
            margin: 0; /* Hücre kenarı boşluğunu sıfırlar */
        }


    </style>
</head>
<body>
    <div class="container">
          <table class="header-table">
        <tr>
            <td rowspan="2" style="width: 10%;"></td>
            <td colspan="4" style="font-size: 1.5em; text-align: center;">Satın Alma Talep Formu</td>
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
    <div class="header">
                
         BİRİM :${unit}
    
        </div>
    
<table class="main-table">
        <thead>
            <tr>
                <th>TARİH</th>
                <th>TALEP EDİLEN <br> MALZEME</th>
                <th>MALZEME <br> ÖZELLİKLERİ</th>
                <th>İHTİYAÇ <br> SEBEBİ</th>
                <th>MİKTAR</th>
                <th>FİYAT</th>
                <th>TUTAR</th>
            </tr>
        </thead>
        <tbody>
        ${rows.map(
          (doc) =>
            `<tr key={doc.id}>
            <td>${doc.date}</td>
            <td>${doc.material}</td>
            <td>${doc.properties}</td>
            <td>${doc.reason}</td>
            <td>${doc.quantity}</td>
            <td>${doc.price}</td>
            <td>${doc.amount}</td>
        </tr>`,
        )}
             
        </tbody>
    </table>
        <table class="payment-table">
            <tr>
                    <td class="payment-label">ÖDEME TÜRÜ</td>
                    <td>${documentFields["field1"]}</td>
                   <td class="payment-label">TOPLAM</td>
                   <td>${totalAmount}</td>
            </tr>
    </table>
    </div>
    


        <table class="signature-table">
            <tr>
                <td style="width: 33.33%;"><div class="signature-title">TALEP EDEN</div><br><br>
                    <div class="signature-label">İSİM: ${documentFields["bp1"]}</div><br>
                    <div class="signature-label">UNVAN:</div><br>
                <div class="signature-label">İMZA:</div></td>
                <td style="width: 33.33%;"><div class="signature-title">KONTROL EDEN</div><br>
                  <div class="signature-label">İSİM: ${documentFields["bp2"]}</div><br>
                  <div class="signature-label">UNVAN:</div><br>
                  <div class="signature-label">İMZA:</div></td>
                <td style="width: 33.33%;"><div class="signature-title">ONAY</div><br>
                    <div class="signature-label">İSİM:</div><br>
                   <div class="signature-label">UNVAN:</div><br>
                   <div class="signature-label">İMZA:</div></td>
            </tr>
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

  const handleInputChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    );
    setRows(updatedRows);
  };
  const [queryParameters] = useSearchParams();
  const [data, setData] = useState(null);
  const mode = queryParameters.get("mode") ?? DMode.Create;
  const handleSubmit = () => {
    (async () => {
      const elements = document.querySelectorAll("[field-short-name]");
      const documentFields = {};
      documentFields["materials"] = JSON.stringify(rows);

      elements.forEach((element) => {
        documentFields[element.getAttribute("field-short-name")] =
          element.value;
      });
      if (mode === DMode.Create) {
        await createDocument({
          title: title,
          shortName: "document",
          type: DocumentType.PurchaseRequestForm,
          department: unit,
          fields: documentFields,
          ManuelId: manuelId,
        });


      } else if (mode === DMode.Revise) {
        await createDocumentRevision(queryParameters.get("id"), documentFields);
      } else if (mode === DMode.Edit) {
        await changeDocument(queryParameters.get("id"), documentFields);
      }
      if (documentFields["field2"] === "İlgiliye Teslim Edildi") {
        window.location.href = "/satin-alma/tedarikci-degerlendirme";
      }
      else{
        window.location.href = "/dokuman/listesi";
      }
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

        setRows(JSON.parse(doc.fields["materials"].value));

        const elements = document.querySelectorAll("[field-short-name]");
        elements.forEach((element) => {
          const fieldShortName = element.getAttribute("field-short-name");
          element.value = doc.fields[fieldShortName].value;
        });
      })();
    }, []);
  }

  useEffect(() => {
    const total = rows.reduce(
      (sum, row) => sum + parseFloat(row.amount || 0),
      0,
    );
    setTotalAmount(total);
  }, [rows]);

  return (
    <div className="container-fluid p-5">
      <div className="row justify-content-between">
        <h3 className="col-6 large-title">Satın Alma Talep Formu</h3>
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
          <button onClick={handlePrint} className="col-2 print-btn">
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
        <div className="col-12 mt-5 row">
          <div className="col-12 row justify-content-center">
            <div className="col-12 mb-3 row justify-content-end">
              <button className="col-2 print-btn2" onClick={addRow}>
                + Veri Ekle
              </button>
            </div>
            <table className="col-12 table table-bordered">
              <thead>
                <tr>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Tarih
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Talep Edilen Malzeme
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Malzeme Özellikleri
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    İhtiyaç Sebebi
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Miktar
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Fiyat
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Tutar
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="date"
                        className="border-0 w-100"
                        value={row.date}
                        onChange={(e) =>
                          handleInputChange(index, "date", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="border-0 w-100"
                        value={row.material}
                        onChange={(e) =>
                          handleInputChange(index, "material", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="border-0 w-100"
                        value={row.properties}
                        onChange={(e) =>
                          handleInputChange(index, "properties", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="border-0 w-100"
                        value={row.reason}
                        onChange={(e) =>
                          handleInputChange(index, "reason", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="border-0 w-100"
                        value={row.quantity}
                        onChange={(e) =>
                          handleInputChange(index, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="border-0 w-100"
                        value={row.price}
                        onChange={(e) =>
                          handleInputChange(index, "price", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="border-0 w-100"
                        value={row.amount}
                        onChange={(e) =>
                          handleInputChange(index, "amount", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-12 mt-3 justify-content-between row">
            <div className="row col-8 justify-content-between">
              <select className="col-5" field-short-name="field1">
                <option value="Belirtilmemiş">Ödeme Yöntemi Seçiniz</option>
                <option value="Havale">Havale</option>
                <option value="Kredi Kartı">Kredi Kartı</option>
                <option value="Nakit">Nakit</option>
              </select>
              <select className="col-5" field-short-name="field2">
                <option value="Belirtilmemiş">Sipariş Durumu Seçiniz</option>
                <option value="Sipariş Verildi">Sipariş Verildi</option>
                <option value="Kargoya Verildi">Kargoya Verildi</option>
                <option value="Yolda">Yolda</option>
                <option value="Dağıtımda">Dağıtımda</option>
                <option value="Teslim Alındı ">Teslim Alındı</option>
                <option value="İlgiliye Teslim Edildi">
                  İlgiliye Teslim Edildi
                </option>
              </select>
            </div>

            <p className="create-doc-p col-4 text-end">
              Toplam Tutar : {totalAmount}
            </p>
          </div>

          <div className="col-12 mt-5 row justify-content-around">
            <div className="col-2 row">
              <label className="col-12 purple-text text-center">
                Talep Eden
              </label>
              <input
                className="col-12 create-doc-inp text-center"
                field-short-name="bp-1"
                maxLength={30}
              />
            </div>

            <div className="col-2 row">
              <label className="col-12 purple-text text-center">
                Kontrol Eden
              </label>
              <input
                className="col-12 create-doc-inp text-center"
                field-short-name="bp-2"
                maxLength={30}
              />
            </div>

            <div className="col-2 row">
              <label className="col-12 purple-text text-center">
                Onaylayan
              </label>
              <input
                className="col-12 create-doc-inp text-center"
                field-short-name="bp-3"
                maxLength={30}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestForm;
