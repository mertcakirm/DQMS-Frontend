import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App.jsx";
import { ActionPerm, checkPermFromRole } from "../../API/permissions.js";
import { getAllDocuments } from "../../API/Documents.js";
import ExternalPopUp from "./ExternalPopUp.jsx";
import { DocumentType } from "../../Helpers/typeMapper.js";
import { useSearchParams } from "react-router-dom";
import {
  acceptDocumentRevision,
  rejectDocumentRevision,
} from "../../API/DocumentRevision.js";
import UnauthPage from "../other/UnauthPage.jsx";

const ExternalDocuments = () => {
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
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <title>Dış Kaynaklı Doküman Listesi</title>
            <style>
                @page {
                    size: A4;
                    margin: 1cm;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    font-size: 10pt;
                }
        
                .page {
                    width: 21cm;
                    min-height: 29.7cm;
                    padding: 1cm;
                    box-sizing: border-box;
                }
        
                .header-section {
                    margin-bottom: 0;
                }
        
                .header-table {
                    border-collapse: collapse;
                    margin-bottom: 0;
                    width: 100%;
                }
        
                .logo-cell {
                    width: 25%;
                    height: 80px;
                    vertical-align: middle;
                    border: 1px solid black;
                }
        
                .title-cell {
                    text-align: center;
                    font-weight: bold;
                    font-size: 14pt;
                    width: 45%;
                    border: 1px solid black;
                }
        
                .info-cell {
                    width: 30%;
                    padding: 0 !important;
                }
        
                .info-table {
                    margin: 0;
                    padding: 0;
                    border-collapse: collapse;
                    width: 100%;
                }
        
                .info-row td {
                    border: 1px solid black;
                    padding: 2pt 4pt;
                    height: 20px;
                    font-size: 9pt;
                }
        
                .info-label {
                    width: 40%;
                    white-space: nowrap;
                }
        
                .main-table {
                    width: 100%;
                    border-collapse: collapse;
                    page-break-inside: auto;
                    margin-top: 0;
                }
        
                .main-table th, .main-table td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: center;
                    font-weight: normal;
                }
        
                .main-table th {
                    background-color: #f0dcd1;
                }
        
                /* Print Stilleri */
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    .main-table {
                        page-break-inside: auto;
                    }
                    
                    .main-table tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    
                    .main-table th {
                        background-color: #f0dcd1 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div class="page">
                <div class="header-section">
                    <table class="header-table">
                        <tr>
                            <td class="logo-cell"></td>
                            <td class="title-cell">DIŞ KAYNAKLI DOKÜMAN LİSTESİ</td>
                            <td class="info-cell">
                                <table class="info-table">
                                    <tr class="info-row">
                                        <td class="info-label">Doküman No</td>
                                        <td></td>
                                    </tr>
                                    <tr class="info-row">
                                        <td class="info-label">İlk Yayın Tarihi</td>
                                        <td></td>
                                    </tr>
                                    <tr class="info-row">
                                        <td class="info-label">Revizyon No</td>
                                        <td></td>
                                    </tr>
                                    <tr class="info-row">
                                        <td class="info-label">Yürürlük Tarihi</td>
                                        <td></td>
                                    </tr>
                                    <tr class="info-row">
                                        <td class="info-label">Sayfa No</td>
                                        <td></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
        
                <table class="main-table">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Doküman Numarası</th>
                            <th style="width: 15%;">Doküman Adı</th>
                            <th style="width: 12%;">Yayın Tarihi</th>
                            <th style="width: 18%;">Bir Sonraki Gözden Geçirme Tarihi</th>
                            <th style="width: 18%;">Son Gözden Geçirme Tarihi</th>
                            <th style="width: 12%;">Gözden Geçirme Sıklığı</th>
                            <th style="width: 10%;">Sorumlu</th>
                        </tr>
                    </thead>
                    <tbody>
                       ${documents.map((doc) => (
                                      `<tr key={doc.id}>
                                          <td>${doc.manuelId}</td>
                                          <td>${doc.title}</td>
                                          <td>${doc.creationDate}</td>                                          
                                          <td>${documentFields["nextreview"]}</td>
                                          <td>${documentFields["lastreview"]}</td>
                                          <td>${documentFields["review"]}</td>
                                          <td>${documentFields["person"]}</td>
                                    </tr>`
                                  ))}
                        </tbody>
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


  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  function removeQueryParamsAndReload() {
    const newUrl = window.location.origin + window.location.pathname;
    window.location.href = newUrl;
  }

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const result = await getAllDocuments(
          pageNum,
          30,
          search,
          [DocumentType.ExternalDoc],
          ["nextreview", "lastreview", "review", "person"],
        );
        setDocuments(result.documents || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [pageNum, search]);

  const [queryParameters] = useSearchParams();
  useEffect(() => {
    const mode = queryParameters.get("mode");
    const id = queryParameters.get("id");

    if (mode) {
      setPopupData({ mode, id });
      setIsPopupOpen(true);
    }
  }, []);

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

  return (
    <div className="container-fluid p-5">
      <div className="row justify-content-between">
        <h3 className="col-6 large-title">DIŞ KAYNAKLI DÖKÜMAN LİSTESİ</h3>
        <div
          className="col-6 row justify-content-end"
          style={{ columnGap: "10px" }}
        >
          <button className="col-2 print-btn2" onClick={togglePopup}>
            + Ekle
          </button>
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
            <th className="purple-text">Döküman Numarası</th>
            <th className="purple-text">Döküman Adı</th>
            <th className="purple-text">Bir Sonraki Gözden Geçirme Tarihi</th>
            <th className="purple-text">Son Gözden Geçirme Tarihi</th>
            <th className="purple-text">Gözden Geçirme Sıklığı</th>
            <th className="purple-text">Sorumlu Kişi</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.manuelId || "Belirtilmemiş"}</td>
                <td>{doc.title || "Belirtilmemiş"}</td>
                <td>{doc.fields.nextreview.value || "Belirtilmemiş"}</td>
                <td>{doc.fields.lastreview.value || "Belirtilmemiş"}</td>
                <td>{doc.fields.review.value || "Belirtilmemiş"}</td>
                <td>{doc.fields.person.value || "Belirtilmemiş"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Doküman Bulunamadı
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
        <ExternalPopUp
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

export default ExternalDocuments;
