import { useContext, useEffect, useState, useRef } from "react";
import { deleteDocument, getAllDocuments } from "../../API/Documents.js";
import { ActionPerm, checkPermFromRole } from "../../API/permissions.js";
import { UserContext } from "../../App.jsx";
import {
  DocumentType,
  getTypeTitle,
  getTypeUrl,
} from "../../Helpers/typeMapper.js";
import ProcessPopup from "../other/ProcessPopUp.jsx";
import Pagination from "../other/Pagination.jsx";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [search, setSearch] = useState(null);
  const user = useContext(UserContext);
  const [reflesh, setReflesh] = useState(false);
  const [permissionCheck, setPermissionCheck] = useState(false);
  const [isProcessPopupOpen, setProcessIsPopupOpen] = useState(false);
  const [processState, setProcessState] = useState({
    processtype: null,
    text: "",
    id: null,
  });

  const toggleProcessPopup = (type, id, text) => {
    setProcessIsPopupOpen(!isProcessPopupOpen);
    setProcessState(prevState => ({
      ...prevState,
      processtype: type,
      text: text,
      id: id
    }));
  };

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
    <title>Master Doküman Listesi</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 1cm;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 10pt;
        }

        .header-section {
            margin-bottom: 0;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: -1px;  /* Çizgileri birleştirmek için -1px margin */
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
            padding: 0;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
            padding: 0;
        }

        .info-row td {
            padding: 2pt 4pt;
            height: 20px;
            font-size: 9pt;
            border: 1px solid black;
        }

        .info-label {
            white-space: nowrap;
            width: 40%;
        }

        .info-value {
            width: 60%;
        }

        .document-table {
            width: 100%;
            border-collapse: collapse;
        }

        .document-table th, 
        .document-table td {
            border: 1px solid black;
            padding: 5px;
            text-align: left;
        }
        
        .document-table th:nth-child(1),
        .document-table td:nth-child(1) {
            width: 12%;  /* Doküman Kodu */
        }
        
        .document-table th:nth-child(2),
        .document-table td:nth-child(2) {
            width: 25%;  /* Doküman Adı */
        }
        
        .document-table th:nth-child(3),
        .document-table td:nth-child(3) {
            width: 7%;   /* Doküman Türü */
        }
        
        .document-table th:nth-child(4),
        .document-table td:nth-child(4) {
            width: 7%;   /* İlk Yayın Tarihi */
        }
        
        .document-table th:nth-child(5),
        .document-table td:nth-child(5) {
            width: 6%;   /* Revizyon No */
        }
        
        .document-table th:nth-child(6),
        .document-table td:nth-child(6) {
            width: 7%;   /* Yürürlük Tarihi */
        }
        
        .document-table th:nth-child(7),
        .document-table td:nth-child(7) {
            width: 7%;   /* Geçerlilik Tarihi */
        }
        
        .document-table th:nth-child(8),
        .document-table td:nth-child(8) {
            width: 12%;  /* Sorumlu Birim */
        }
        
        .document-table th:nth-child(9),
        .document-table td:nth-child(9) {
            width: 17%;  /* Revizyon Geçmişi */
        }

        .document-table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }

        .header-right {
            width: 200px;
        }

        .header-right td:first-child {
            width: 100px;
        }
    </style>
</head>
<body>
    <div class="header-section">
            <table class="header-table">
                <tr>
                    <td class="logo-cell"></td>
                    <td class="title-cell">Master Doküman Listesi</td>
                    <td class="info-cell">
                        <table class="info-table">
                            <tr class="info-row">
                                <td class="info-label">Doküman No</td>
                                <td class="info-value"></td>
                            </tr>
                            <tr class="info-row">
                                <td class="info-label">İlk Yayın Tarihi</td>
                                <td class="info-value"></td>
                            </tr>
                            <tr class="info-row">
                                <td class="info-label">Revizyon No</td>
                                <td class="info-value"></td>
                            </tr>
                            <tr class="info-row">
                                <td class="info-label">Yürürlük Tarihi</td>
                                <td class="info-value"></td>
                            </tr>
                            <tr class="info-row">
                                <td class="info-label">Sayfa No</td>
                                <td class="info-value"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>

    <table class="document-table">
        <thead>
            <tr>
                <th>Doküman Kodu</th>
                <th>Doküman Adı</th>
                <th>Doküman Türü</th>
                <th>İlk Yayın Tarihi</th>
                <th>Revizyon No</th>
                <th>Sorumlu Birim</th>
            </tr>
        </thead>
        <tbody>
                ${documents.map(
                  (doc) =>
                    `<tr key={doc.id}>
                            <td>${doc.manuelId || "Belirtilmemiş"}</td>
                            <td>${doc.title}</td>
                            <td>${getTypeTitle(doc.type)}</td>
                            <td>${new Date(doc.creationDate).toLocaleDateString()}</td>
                            <td>${doc.revisionCount}</td>
                            <td>${doc.department}</td>
                        </tr>`,
                )}
            </tbody>
              <div class="info-area">
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
            </div>
        </div>
    

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

  const fetchDocuments = async () => {
    try {
      const result = await getAllDocuments(pageNum, 30, search, [
        DocumentType.Document, DocumentType.ExternalDoc, DocumentType.Swot, DocumentType.ISGRisk, DocumentType.ProcessRisk, DocumentType.YGGMeeting, DocumentType.PESTLE, DocumentType.Needs, DocumentType.CorrectiveAction, DocumentType.Performance, DocumentType.Legal, DocumentType.Suitability, DocumentType.Incident, DocumentType.Wastle, DocumentType.EmergencyDrillEnvi, DocumentType.EmergencyDrill, DocumentType.EmergencyAction, DocumentType.AccidentIncident, DocumentType.Audit, DocumentType.MainTenance, DocumentType.Revision, DocumentType.ArchiveDoc, DocumentType.HireCont1, DocumentType.HireCont2, DocumentType.HireCont3, DocumentType.SettlementReport, DocumentType.Procedur, DocumentType.MattersConsideration, DocumentType.MeetingMinutes, DocumentType.Signature, DocumentType.ApplicationEvaluationForm, DocumentType.ApplicationEvaluationForm2, DocumentType.Conditions, DocumentType.PurchaseRequestForm, DocumentType.ApprovedSupplierList, DocumentType.TrackingChart, DocumentType.PrivacyCommitment, DocumentType.PersonalData, DocumentType.SupplierEvaluationForm, DocumentType.PurchasingProcedure, DocumentType.Debit, DocumentType.MonitoringReport, DocumentType.MonitoringReport2, DocumentType.MeetingMinutesMonitor
      ]);
      setDocuments(result.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [pageNum, search,reflesh]);

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

  useEffect(() => {
    if (checkPermFromRole(user.roleValue, ActionPerm.DocumentModify)) {
      setPermissionCheck(true);
    } else {
      setPermissionCheck(false);
    }
  });

  const handleBtnClick = (docId, docType) => {
    const hasModify = checkPermFromRole(
      user.roleValue,
      ActionPerm.DocumentModify,
    );
    const hasRevise = checkPermFromRole(
      user.roleValue,
      ActionPerm.DocumentRevisionCreate,
    );

    if (!hasModify && !hasRevise) {
      window.location.href = `/revizyon-talebi?id=${encodeURIComponent(docId)}`;
    } else {
      let mode = "create";

      if (hasModify) mode = "edit";
      else if (hasRevise) mode = "revise";

      window.location.href = `${getTypeUrl(docType)}?mode=${encodeURIComponent(mode)}&id=${encodeURIComponent(docId)}`;
    }
  };

  return (
    <div className="container-fluid p-5">
      <div className="row justify-content-between">
        <h3 className="col-6 large-title">DÖKÜMAN LİSTESİ</h3>
        <div className="col-6 row justify-content-end">
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
            <th className="purple-text">Döküman No</th>
            <th className="purple-text">Döküman Adı</th>
            <th className="purple-text">Döküman Türü</th>
            <th className="purple-text">İlk Yayın Tarihi</th>
            <th className="purple-text">Revizyon No</th>
            <th className="purple-text">Sorumlu Birim</th>
            <th className="text-center purple-text">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id || "Belirtilmemiş"}</td>
                <td>{doc.title}</td>
                <td>{getTypeTitle(doc.type)}</td>
                <td>{new Date(doc.creationDate).toLocaleDateString()}</td>
                <td>{doc.revisionCount}</td>
                <td>{doc.department}</td>
                <td className="edit-btn-parent untd">
                  <button
                    className="edit-btn"
                    onClick={() => handleBtnClick(doc.id, doc.type)}
                  >
                    {checkPermFromRole(
                      user.roleValue,
                      ActionPerm.DocumentModify,
                    )
                      ? "Düzenle"
                      : checkPermFromRole(
                            user.roleValue,
                            ActionPerm.DocumentRevisionCreate,
                          )
                        ? "Revize Et"
                        : "Revizyon Talebi Oluştur"}
                  </button>

                  {checkPermFromRole(
                    user.roleValue,
                    ActionPerm.DocumentDelete,
                  ) && (
                    <button
                      className="edit-btn"
                      style={{ marginLeft: "8px" }}
                      onClick={()=>toggleProcessPopup("delete_document", doc.id,"Doküman Silinsin mi?")}
                    >
                      Sil
                    </button>
                  )}
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
      <Pagination setPageNum={setPageNum} pageNum={pageNum} />

      {isProcessPopupOpen && (
          <ProcessPopup
              onClose={(b) => {
                if (b === false) {
                  setProcessIsPopupOpen(b);
                  setReflesh(!reflesh);
                }
              }}
              text={processState.text}
              type={processState.processtype}
              id={processState.id}
          />
      )}
    </div>
  );
};

export default DocumentList;
