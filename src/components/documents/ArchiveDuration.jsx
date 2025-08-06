import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App.jsx";
import { ActionPerm, checkPermFromRole } from "../../API/permissions.js";
import { getAllDocuments, deleteDocument } from "../../API/Documents.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import ArchiveDurationPopup from "./ArchivePopup.jsx";
import { useSearchParams } from "react-router-dom";
import UnauthPage from "../other/UnauthPage.jsx";

const ArchiveDuration = () => {
  const [documents, setDocuments] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [search, setSearch] = useState(null);
  const [permissionCheck, setPermissionCheck] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

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
<html>
<head>
    <meta charset="UTF-8">
    <title>Arşivlenme Süreleri Listesi</title>
    <style>
        @page {
            size: A4;
            margin: 1cm;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 11px;
        }

        .page {
            width: 21cm;
            min-height: 29.7cm;
            padding: 1cm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
        }

        td {
            border: 1px solid black;
            padding: 4pt;
            height: 25px;
            vertical-align: middle;
        }

        .header-section {
            margin-bottom: 15pt;
        }

        .header-table {
            border-collapse: collapse;
            margin-bottom: 15pt;
        }

        .logo-cell {
            width: 25%;
            height: 80px;
            vertical-align: middle;
        }

        .title-cell {
            text-align: center;
            font-weight: bold;
            font-size: 14pt;
            width: 45%;
        }

        .info-cell {
            width: 30%;
        }

        .info-table {
            margin: 0;
            padding: 0;
            border-collapse: collapse;
        }

        .info-row td {
            border: none;
            padding: 2pt 4pt;
            height: 20px;
            font-size: 9pt;
        }

        .info-label {
            white-space: nowrap;
        }

         .form-header td {
            height: 30px;
            padding: 4pt 8pt;
            background-color: #D3D3D3;
            text-align: center;
            font-weight: bold;
        }

        .form-header td:nth-child(even) {
           background-color: #D3D3D3;
        }


        .label-cell {
            width: 25%;
            background-color: #D3D3D3 !important;
        }
        .value-cell{
            width: 75%;
        }

        .main-table td {
            text-align: center;
        }

        .footer-table {
            margin-top: 10px; / Reduced the margin /
            width: 50%;
            float: left;
        }
        .footer-table td {
            border: 1px solid black;
            padding: 4pt;
            height: 40px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header-section">
            <table class="header-table">
                <tr>
                    <td class="logo-cell"></td>
                    <td class="title-cell">Arşivlenme Süreleri Listesi</td>
                    <td class="info-cell" style="padding: 0;">
                        <table class="info-table" style="border-collapse: collapse; width: 100%;">
                            <tr class="info-row">
                                <td class="info-label" style="border: 1px solid black; width: 40%;">Doküman No</td>
                                <td style="border: 1px solid black; width: 60%;"></td>
                            </tr>
                            <tr class="info-row">
                                <td class="info-label" style="border: 1px solid black; width: 40%;">İlk Yayın Tarihi</td>
                                <td style="border: 1px solid black; width: 60%;"></td>
                            </tr>
                            <tr class="info-row">
                                <td class="info-label" style="border: 1px solid black; width: 40%;">Revizyon No</td>
                                <td style="border: 1px solid black; width: 60%;"></td>
                            </tr>
                            <tr class="info-row">
                                <td class="info-label" style="border: 1px solid black; width: 40%;">Yürürlük Tarihi</td>
                                <td style="border: 1px solid black; width: 60%;"></td>
                            </tr>
                            <tr class="info-row">
                                <td class="info-label" style="border: 1px solid black; width: 40%;">Sayfa No</td>
                                <td style="border: 1px solid black; width: 60%;"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
        <table class="main-table">
            <tr class="form-header">
                <td class="label-cell">AİT OLDUĞU BİRİM</td>
                <td class="label-cell">KALİTE KAYDI</td>
                <td class="label-cell">ARŞİV SÜRESİ</td>
                <td class="label-cell">SORUMLU</td>
            </tr>
            
           ${documents.map(
             (doc) =>
               `<tr key={doc.id}>
                            <td>${doc.department}</td>
                            <td>${documentFields["field1"]}</td>
                            <td>${documentFields["field2"]}</td>
                            <td>${documentFields["select1"]}</td>
                     </tr>`,
           )}

        </table>
        <table class="footer-table">
            <tr>
                <td>
                    Hazırlayan
                    <br>
                    (Adı Soyadı/Ünvanı/Tarih/İmza)
                </td>
                <td>
                    Kontrol Eden
                    <br>
                    (Adı Soyadı/Ünvanı/Tarih/İmza)
                </td>
            </tr>
            <tr>
                <td>

                </td>
                <td>

                </td>
            </tr>
        </table>
    </div>
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

  const togglePopup = (id) => {
    setIsPopupOpen(!isPopupOpen);
  };


  function removeQueryParamsAndReload() {
    const newUrl = window.location.origin + window.location.pathname;
    window.location.href = newUrl;
  }

  const [queryParameters] = useSearchParams();
  useEffect(() => {
    const mode = queryParameters.get("mode");
    const id = queryParameters.get("id");

    if (mode) {
      setPopupData({ mode, id });
      setIsPopupOpen(true);
    }
  }, []);

  const fetchDocuments = async () => {
    try {
      const result = await getAllDocuments(
        pageNum,
        30,
        search,
        [DocumentType.ArchiveDoc],
        ["field1", "field2", "select1"],
      );
      setDocuments(result.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [pageNum, search]);

  useEffect(() => {
    if (checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll)) {
      setPermissionCheck(true);
    } else {
      setPermissionCheck(false);
    }
  }, []);

  const [searchTimeout, setSearchTimeout] = useState(null);
  const searchTextChanged = (searchStr) => {
    if (searchTimeout !== null) {
      clearTimeout(searchTimeout);
    }
    const newTimeout = setTimeout(() => {
      setSearch(searchStr);
      fetchDocuments();
    }, 800);
    setSearchTimeout(newTimeout);
  };

  const handleDelete = (id) => {
    deleteDocument(id);
  };

  return (
    <div className="container-fluid p-5">
      <div className="row justify-content-between">
        <h3 className="col-6 large-title">ARŞİVLENME SÜRESİ LİSTESİ</h3>
        <div
          className="col-6 row justify-content-end"
          style={{ columnGap: "10px" }}
        >
          <button className="col-2 print-btn2" onClick={togglePopup}>
            + Ekle
          </button>
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
        <input
          className="col-4 search-inp"
          type="text"
          placeholder="Arama Yap"
          onChange={(e) => searchTextChanged(e.target.value)}
        />
      </div>

      <table className="table table-bordered table-striped mt-5">
        <thead>
          <tr>
            <th className="purple-text">Ait Olduğu Birim</th>
            <th className="purple-text">Kalite Kaydı</th>
            <th className="purple-text">Arşiv Süresi</th>
            <th className="purple-text">Sorumlu</th>
            <th className="purple-text">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.department || "Belirtilmemiş"}</td>
                <td>{doc.fields.field1.value || "Belirtilmemiş"}</td>
                <td>{doc.fields.field2.value || "Belirtilmemiş"}</td>
                <td>{doc.fields.select1.value || "Belirtilmemiş"}</td>
                <td>
                  <button
                    onClick={() => {
                      handleDelete(doc.id);
                      setDocuments((prev) =>
                        prev.filter((d) => d.id != doc.id),
                      );
                    }}
                    className="edit-btn"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Doküman bulunamadı
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="row px-3 col-12 justify-content-between">
        <button
          className="print-btn2 col-1"
          onClick={() => setPageNum(pageNum - 1)}
        >
          önceki
        </button>
        <button
          className="print-btn2 col-1"
          onClick={() => setPageNum(pageNum + 1)}
        >
          sonraki
        </button>
      </div>
      {isPopupOpen && (
        <ArchiveDurationPopup
          mode={popupData ? popupData.mode : "create"}
          id={popupData ? popupData.id : null}
          popupCloser={(b) => {
            if (b === false) removeQueryParamsAndReload();
            setIsPopupOpen(b);
          }}
        />
      )}
    </div>
  );
};

export default ArchiveDuration;
