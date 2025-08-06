import React, {useContext, useEffect, useState} from "react";
import TargetPerPopup from "./TargetPerPopup.jsx";
import { getAllDocuments } from "../../API/Documents.js";
import { DocumentType } from "../../Helpers/typeMapper.js";
import { useSearchParams } from "react-router-dom";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../other/UnauthPage.jsx";

const TargetPerformance = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [queryParameters] = useSearchParams();
  const user = useContext(UserContext);
  if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
    return <UnauthPage />;
  useEffect(() => {
    const mode = queryParameters.get("mode");
    const id = queryParameters.get("id");

    if (mode) {
      setPopupData({ mode, id });
      setIsPopupOpen(true);
    }
  }, []);

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

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const result = await getAllDocuments(
          pageNum,
          30,
          search,
          [DocumentType.Performance],
          [
            "field1",
            "field2",
            "field3",
            "field4",
            "field5",
            "field6",
            "field7",
            "field8",
            "date1",
          ],
        );
        setDocuments(result.documents || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, [pageNum, search]);

  function removeQueryParamsAndReload() {
    const newUrl = window.location.origin + window.location.pathname;
    window.location.href = newUrl;
  }

  return (
    <div className="container-fluid table-bordered p-5">
      <div
        className="row justify-content-between"
        style={{ padding: "0px 30px" }}
      >
        <h3 className="col-6 large-title">Hedef Performans Takip Tablosu</h3>
        <div
          className="col-6 row justify-content-end"
          style={{ columnGap: "10px" }}
        >
          <button className="col-3 print-btn2" onClick={togglePopup}>
            + Veri Ekle
          </button>
          <button className="col-3 print-btn">
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
      <table className="table mt-5 table-bordered text-center table-striped">
        <thead>
          <tr className="table-header">
            <th className="purple-text" rowSpan="2">
              Doküman No
            </th>
            <th className="purple-text" rowSpan="2">
              Birim
            </th>
            <th colSpan="5">PLANLAMA</th>
            <th colSpan="4">GERÇEKLEŞME</th>
          </tr>
          <tr className="table-subheader">
            <th className="purple-text">Hedefler</th>
            <th className="purple-text">Sayı</th>
            <th className="purple-text">Kaynak</th>
            <th className="purple-text">Termin Tarihi</th>
            <th className="purple-text">Gerçekleşen Hedef</th>
            <th className="purple-text">Hedefe Ulaşma Oranı</th>
            <th className="purple-text">Gerçekleşen Bütçe</th>
            <th className="purple-text">Bütçe Gerçekleşme Oranı</th>
            <th className="purple-text">Açıklama</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <tr key={index}>
                <td>{doc.id || "Belirtilmemiş"}</td>
                <td>{doc.department || "Belirtilmemiş"}</td>
                <td>{doc.fields?.field1?.value || "Belirtilmemiş"}</td>
                <td>{doc.fields?.field2?.value || "Belirtilmemiş"}</td>
                <td>{doc.fields?.field3?.value || "Belirtilmemiş"}</td>
                <td>{doc.fields?.date1?.value || "Belirtilmemiş"}</td>
                <td>{doc.fields?.field4?.value || "Belirtilmemiş"}</td>
                <td>{doc.fields?.field5?.value || "Belirtilmemiş"}</td>
                <td>{doc.fields?.field6?.value || "Belirtilmemiş"}</td>
                <td>{doc.fields?.field7?.value || "Belirtilmemiş"}</td>
                <td>{doc.fields?.field8?.value || "Belirtilmemiş"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                Seçtiğiniz kategoride doküman bulunamadı.
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
        <TargetPerPopup
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

export default TargetPerformance;
