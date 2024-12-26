import React, {useContext, useEffect, useState} from "react";
import {getAllDocuments} from "../../API/Documents.js";
import {DocumentType} from "../../Helpers/typeMapper.js";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../UnauthPage.jsx";

const AccidentIncidentTracking = () => {

    const [documents, setDocuments] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [search, setSearch] = useState("");
    const user = useContext(UserContext);
    if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
        return <UnauthPage />;
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const result = await getAllDocuments(pageNum, 30, search, [DocumentType.AccidentIncident],["field2_1","date1","date2","field3_1","field3_2","field3_2","field1_1","field1_2","field1_4","field6_1"]);
                setDocuments(result.documents || []);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };
        fetchDocuments();
    }, [pageNum, search]);
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
                <h3 className="col-6 large-title">KAZA OLAY TAKİP LİSTESİ</h3>
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
                <input className="col-4 search-inp" type="text" placeholder="Arama Yap" value={search}
                       onChange={e => setSearch(e.target.value)}/>
            </div>

            <table className="table table-bordered table-striped mt-5">
                <thead>
                <tr>
                    <th colSpan="6"></th>
                    <th colSpan="4" className="text-center purple-text" style={{fontSize: '20px'}}>Kazaya Maruz Kalan
                    </th>
                    <th colSpan="1"></th>

                </tr>
                <tr>
                    <th className="text-center purple-text">Doküman No</th>
                    <th className="text-center purple-text">SGK Bildirim No</th>
                    <th className="text-center purple-text">SGK Bildirim Tarihi</th>
                    <th className="text-center purple-text">Kaza / Olay Tarihi</th>
                    <th className="text-center purple-text">Kaza Yeri</th>
                    <th className="text-center purple-text">Kaza Olay Açıklaması</th>
                    <th className="text-center purple-text">Adı Soyadı</th>
                    <th className="text-center purple-text">TC Kimlik No</th>
                    <th className="text-center purple-text">Görevi</th>
                    <th className="text-center purple-text">Yapılan Faaliyet</th>
                </tr>
                </thead>
                <tbody>
                {documents.length > 0 ? (
                    documents.map((doc, index) => (
                        <tr key={index}>
                            <td>{doc.id || "Belirtilmemiş"}</td>
                            <td>{doc.fields?.field2_1?.value || "Belirtilmemiş"}</td>
                            <td>{doc.fields?.date1?.value || "Belirtilmemiş"}</td>
                            <td>{doc.fields?.date2?.value || "Belirtilmemiş"}</td>
                            <td>{doc.fields?.field3_1?.value || "Belirtilmemiş"}</td>
                            <td>{doc.fields?.field3_2?.value || "Belirtilmemiş"}</td>
                            <td>{doc.fields?.field1_1?.value || "Belirtilmemiş"}</td>
                            <td>{doc.fields?.field1_4?.value || "Belirtilmemiş"}</td>
                            <td>{doc.fields?.field1_2?.value || "Belirtilmemiş"}</td>
                            <td>{doc.fields?.field6_1?.value || "Belirtilmemiş"}</td>

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
                <button className="print-btn2 col-1" onClick={() => setPageNum(pageNum - 1)}>önceki</button>
                <button className="print-btn2 col-1" onClick={() => setPageNum(pageNum + 1)}>sonraki</button>
            </div>
        </div>
    );
};

export default AccidentIncidentTracking;
