import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/other/Navbar.jsx";
import { getTypeTitle, getTypeUrl } from "../Helpers/typeMapper.js";
import { UserContext } from "../App.jsx";
import { ActionPerm, checkPermFromRole } from "../API/permissions.js";
import { getAllRevision } from "../API/DocumentRevision.js";
import { getDocumentFromId } from "../API/Documents.js";

const CompletedRevision = () => {
  const [documentList, setDocumentList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const user = useContext(UserContext);
  const fetchDocuments = () => {
    (async () => {
      const result = await Promise.all(
        (await getAllRevision(pageNum, 30)).map(async (r) => {
          return {revisionId:r.id,...(await getDocumentFromId(r.documentId, false)).document};
        }),
      );

      console.log(result);
      setDocumentList(result);
    })();
  };

  useEffect(() => {
    fetchDocuments();
  }, [pageNum]);

  const onBtnClick = (revId, docType) => {
    window.location.href = `${getTypeUrl(docType)}?mode=viewRevision&id=${revId}`;
  };

  return (
    <div>
      <Sidebar />
      <div className="content-container p-5" data-aos="fade-up">
        <div className="row justify-content-between">
          <h3 className="col-6 large-title">Onay Bekleyen Revizyonlar</h3>
          <div className="col-6 row justify-content-end">
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
            {documentList.length > 0 ? (
              documentList.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.manuelId || "Belirtilmemiş"}</td>
                  <td>{doc.title}</td>
                  <td>{getTypeTitle(doc.type)}</td>
                  <td>{new Date(doc.creationDate).toLocaleDateString()}</td>
                  <td>{doc.revisionCount}</td>
                  <td>{doc.department}</td>
                  <td className="edit-btn-parent untd">
                    <button
                      className="edit-btn"
                      onClick={() => onBtnClick(doc.revisionId, doc.type)}
                    >
                      Değerlendir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Revizyon Bulunamadı
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
      </div>
    </div>
  );
};

export default CompletedRevision;
