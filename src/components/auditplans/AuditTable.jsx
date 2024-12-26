import React, {useContext, useEffect, useState} from 'react';
import {getAllDocuments} from "../../API/Documents.js";
import {DocumentType} from "../../Helpers/typeMapper.js";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../UnauthPage.jsx";

const AuditTable = () => {
    const [documents, setDocuments] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [search, setSearch] = useState("");

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
                    <title>Yıllık Denetim Planı</title>
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
                            margin-bottom: 0;
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
                            
                        }
                        .info-label {
                            white-space: nowrap;
                            width: 40%;
                        }
                        .denetim-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 0;
                        }
                        .denetim-table th, .denetim-table td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: center;
                        }
                        .denetci {
                            background-color: #e8ffe8;
                            color: red;
                            font-size: 10px;
                        }
                        .birim-header {
                            background-color: #ffebcd;
                            font-weight: bold;
                            text-align: left;
                            padding-left: 8px;
                            width: 200px;
                        }
                        .tarih-header {
                            background-color: #ffebcd;
                            font-weight: bold;
                             width: calc((100% - 200px) / 7);
                        }
                        .footer {
                             margin-top: 20px;
                            display: flex;
                            justify-content: flex-start;
                            
                            
                        }
                         .footer span{
                            margin-right: 20px;
                         }
                        
                    </style>
                </head>
                <body>
                    <div class="header-section">
                        <table class="header-table">
                            <tr>
                                <td class="logo-cell"></td>
                                <td class="title-cell">YILLIK DENETİM PLANI</td>
                                <td class="info-cell">
                                    <table class="info-table">
                                        <tr class="info-row">
                                            <td class="info-label" style="border: 1px solid black;">Doküman No</td>
                                            <td style="border: 1px solid black;"></td>
                                        </tr>
                                        <tr class="info-row">
                                            <td class="info-label" style="border: 1px solid black;">İlk Yayın Tarihi</td>
                                            <td style="border: 1px solid black;"></td>
                                        </tr>
                                        <tr class="info-row">
                                            <td class="info-label" style="border: 1px solid black;">Revizyon No</td>
                                            <td style="border: 1px solid black;"></td>
                                        </tr>
                                        <tr class="info-row">
                                            <td class="info-label" style="border: 1px solid black;">Yürürlük Tarihi</td>
                                            <td style="border: 1px solid black;"></td>
                                        </tr>
                                        <tr class="info-row">
                                            <td class="info-label" style="border: 1px solid black;">Sayfa No</td>
                                            <td style="border: 1px solid black;"></td>
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
                                <th>Denetlenecek Birim</th>
                                <th>Tarih</th>
                                <th>Denetçi</th>
                            </tr>
                        </thead>
                        <tbody>
                                ${documents.map((doc) => (
                            `<tr key={doc.id}>
                                            <td>${doc.manuelId || "Belirtilmemiş"}</td>
                                            <td>${doc.department}</td>
                                            <td>${doc.fields["date1"]}</td>
                                            <td>${doc.fields["field1"]}</td>
                                        </tr>`
                        ))
                        }
                            </tbody>
                    </table>
                
                    <div class="footer">
                        <span>Yayın Tarihi:</span>
                        <span>Rev. No:</span>
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

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const result = await getAllDocuments(pageNum, 30, search, [DocumentType.Audit],["select1","date1"]);
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
                <h3 className="col-6 large-title">İÇ DENETİM ÇİZELGESİ</h3>
                <div className="col-6 row justify-content-end " style={{columnGap: '10px'}}>
                    <button onClick={handlePrint} className="col-2 print-btn">
                        <svg width="30" height="30" viewBox="0 0 86 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M57.3333 44.375V56.2084C57.3333 62.125 53.75 65.0834 46.5833 65.0834H39.4167C32.25 65.0834 28.6667 62.125 28.6667 56.2084V44.375M57.3333 44.375H28.6667M57.3333 44.375V53.25H64.5C71.6667 53.25 75.25 50.2917 75.25 44.375V29.5834C75.25 23.6667 71.6667 20.7084 64.5 20.7084H21.5C14.3333 20.7084 10.75 23.6667 10.75 29.5834V44.375C10.75 50.2917 14.3333 53.25 21.5 53.25H28.6667V44.375M60.9167 44.375H25.0833M25.0833 32.5417H35.8333M25.9792 20.7084H60.0208V14.7917C60.0208 8.87502 57.3333 5.91669 49.2708 5.91669H36.7292C28.6667 5.91669 25.9792 8.87502 25.9792 14.7917V20.7084Z"
                                stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                        Yazdır
                    </button>
                </div>
                <input className="col-4 search-inp" type="text" placeholder="Arama Yap"
                       onChange={e => searchTextChanged(e.target.value)}/>
            </div>


            <div className="row mt-5">
                <div className="col-12">
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th className="purple-text" scope="col">Doküman No</th>
                            <th className="purple-text" scope="col">Denetlenecek Birim</th>
                            <th className="purple-text" scope="col">Tarih</th>
                            <th className="purple-text" scope="col">Denetçi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {documents.length > 0 ? (
                            documents.map((doc, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{doc.manuelId || "Belirtilmemiş"}</td>
                                        <td>{doc.department || "Belirtilmemiş"}</td>
                                        <td>{doc.fields?.date1?.value || "Belirtilmemiş"}</td>
                                        <td>{doc.fields?.select1?.value || "Belirtilmemiş"}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
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
            </div>
        </div>
    );
};

export default AuditTable;
