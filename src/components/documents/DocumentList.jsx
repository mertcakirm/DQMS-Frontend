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
