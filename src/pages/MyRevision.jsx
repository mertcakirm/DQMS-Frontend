import Sidebar from "../components/other/Navbar.jsx";
import { useEffect, useState } from "react";
import {
  acceptRevisionRequest,
  getRevisionRequestsFromStatus,
  getSelfRevisionRequests,
  rejectDocumentRevision,
  rejectRevisionRequest,
} from "../API/DocumentRevision.js";
import { getDocumentFromId } from "../API/Documents.js";
import {toast} from "react-toastify";

const MyRevision = () => {
  const [revisionRequests, setRevisionRequests] = useState([]);
  const [selfRevisionRequests, setSelfRevisionRequests] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupId, setPopupId] = useState(null);
  const [note, setNote] = useState(null);

  const togglePopup = (id) => {
    setPopupId(id);
    setIsPopupOpen(!isPopupOpen);
  };

  const getRevisionRequest = async () => {
    const dbRes = await getRevisionRequestsFromStatus(0, 1, 100);
    const result = await Promise.all(
      dbRes.map(async (r) => {
        const documentResult = await getDocumentFromId(r.documentId, false);
        return { ...r, obj: documentResult.document };
      }),
    );

    const selfdbRes = await getSelfRevisionRequests(1, 100);
    const selfResult = await Promise.all(
      selfdbRes.map(async (r) => {
        const documentResult = await getDocumentFromId(r.documentId, false);
        return { ...r, obj: documentResult.document };
      }),
    );

    setRevisionRequests(result || []);
    setSelfRevisionRequests(selfResult || []);
  };

  useEffect(() => {
    getRevisionRequest();
  }, []);

  return (
    <div className="document-parent">
      <Sidebar />
      <div className="content-container" data-aos="fade-up">
        <div className="container-fluid p-5">
          <div className="row">
            <h3 className="col-12 mb-5 large-title">Revizyonlarım</h3>
            <div
              className="row col-6"
              style={{ padding: "0px 60px 30px 20px" }}
            >
              <div className="card col-12" style={{ padding: "0px" }}>
                <div className="card-header create-doc-card-header">
                  Gönderilen Revizyon Taleplerim
                </div>
                <div
                  className="card-body p-4 justify-content-center row"
                  style={{ rowGap: "10px" }}
                >
                  {revisionRequests.length > 0 &&
                    revisionRequests.map((rev) => (
                      <div className="col-12" key={rev.id}>
                        <div className="revision-card py-3 row">
                          <div className="row align-items-center col-12">
                            <div className="col-12">
                              <strong>Doküman Başlığı : </strong>
                              {rev.obj.title}
                            </div>
                            <div className="col-12">
                              <strong>Talep Durumu : </strong>
                              {
                                {
                                  0: "Beklemede",
                                  1: "Kabul Edildi",
                                  2: "Reddedildi",
                                }[rev.status]
                              }
                            </div>
                            <div className="col-12">
                              <strong>Doküman No : </strong>
                              {rev.obj.manuelId}
                            </div>
                            <div className="col-12">
                              <strong>Talep Notu : </strong>
                              {rev.note}
                            </div>
                            <div className="col-12">
                              <strong>Talep Tarihi : </strong>
                              {new Date(rev.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {revisionRequests.length === 0 && (
                    <div className="text-center col-12">
                      Talebiniz bulunmamaktadır
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row col-6" style={{ padding: "0px 0px 30px 0px" }}>
              <div className="card col-12" style={{ padding: "0px" }}>
                <div className="card-header create-doc-card-header">
                  Onay Bekleyen Revizyon Talepleri
                </div>
                <div
                  className="card-body p-4 justify-content-center row"
                  style={{ rowGap: "10px" }}
                >
                  {revisionRequests.length > 0 &&
                    revisionRequests.map((rev) => (
                      <div className="col-12" key={rev.id}>
                        <div className="revision-card py-3 row">
                          <div className="row align-items-center col-8">
                            <div className="col-12">
                              <strong>Doküman Başlığı : </strong>
                              {rev.obj.title}
                            </div>
                            <div className="col-12">
                              <strong>Doküman No : </strong>
                              {rev.obj.manuelId}
                            </div>
                            <div className="col-12">
                              <strong>Talep Notu : </strong>
                              {rev.note}
                            </div>
                            <div className="col-12">
                              <strong>Talep Tarihi : </strong>
                              {new Date(rev.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div
                            className="row align-items-center justify-content-end col-4"
                            style={{ columnGap: "10px" }}
                          >
                            <button
                              onClick={() =>{
                                acceptRevisionRequest(rev.id, null)
                                toast.success("Revizyon Talebi Onaylandı!")
                              }
                              }
                              className="acceptbtn col-5"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => togglePopup(rev.id)}
                              className="acceptbtn2 col-5"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {revisionRequests.length === 0 && (
                    <div className="text-center col-12">
                      Bekleyen talep işlemi bulunmamaktadır
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <div>
          <div className="popup-overlay">
            <div
              className="popup-content row p-3"
              style={{ width: "30%", height: "30%", rowGap: "10px" }}
            >
              <h4 className="large-title col-12">
                Revizyon Talebi Reddetme Paneli
              </h4>
              <textarea
                className="create-doc-textarea col-12"
                value={note}
                placeholder="Red Notu"
                onChange={(e) => setNote(e.target.value)}
                style={{ height: "150px", resize: "none" }}
              ></textarea>

              <div className="row col-12 px-3 justify-content-between">
                <button
                  className="print-btn2 col-4"
                  onClick={() => togglePopup()}
                >
                  İptal
                </button>
                <button
                  className="print-btn2 col-4"
                  onClick={() => {
                    rejectRevisionRequest(popupId, note);
                    togglePopup();
                  }}
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyRevision;
