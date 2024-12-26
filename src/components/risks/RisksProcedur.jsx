import React, {useContext, useEffect, useState} from 'react';
import {optionsList} from "../../Helpers/units.js";
import {changeDocument, createDocument, getDocumentFromId} from "../../API/Documents.js";
import {DocumentType} from "../../Helpers/typeMapper.js";
import {deleteDocumentAttachment, uploadDocumentAttachment} from "../../API/DocumentAttachment.js";
import {SvgBin, Svgdoc} from "../documents/generalcomp.jsx";
import {DMode} from "../../Helpers/DMode.js";
import {
    acceptDocumentRevision,
    createDocumentRevision,
    getRevision,
    rejectDocumentRevision
} from "../../API/DocumentRevision.js";
import {useSearchParams} from "react-router-dom";
import FileUpload from "../fileUpload.jsx";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../UnauthPage.jsx";

const RisksProcedur = () => {
    const [fileList, setFileList] = useState([]);
    const [deletionAttachmentList, setDeletionAttachmentList] = useState([]);
    const [title, setTitle] = useState("");
    const [unit, setUnit] = useState("");
    const [manuelId, setManuelId] = useState("");
    const filteredValue = optionsList.includes(unit) ? unit : "";
    const [queryParameters] = useSearchParams();
    const [data, setData] = useState(null);
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
        <title>Dokuman Hazırlama Formatı</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                line-height: 1.6;
            }
    
            .header {
                display: table;
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
    
            .header-row {
                display: table-row;
            }
    
            .logo-area {
                display: table-cell;
                width: 25%;
                border: 1px solid black;
                height: 80px;
                vertical-align: middle;
            }
    
            .title-area {
                display: table-cell;
                width: 50%;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
                text-align: center;
                vertical-align: middle;
                padding: 10px 0;
            }
    
            .info-area {
                display: table-cell;
                width: 25%;
                border: 1px solid black;
            }
    
            .title-area h2 {
                margin: 0;
                font-size: 14px;
                font-weight: bold;
            }
    
            .title-area p {
                margin: 5px 0 0 0;
                font-size: 12px;
            }
    
            .info-table {
                width: 100%;
                border-collapse: collapse;
            }
    
            .info-table tr {
                height: 16px;
            }
    
            .info-table td {
                border-bottom: 1px solid black;
                padding: 2px 5px;
                font-size: 11px;
            }
    
            .info-table tr:last-child td {
                border-bottom: none;
            }
    
            .info-table td:first-child {
                font-weight: normal;
            }
    
            .main-content h1 {
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .main-content p {
                margin: 10px 0;
                text-align: justify;
            }
    
            .section-number {
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo-area">
                <!-- Logo alanı -->
            </div>
            <div class="title-area">
                <h2>Dokuman Hazırlama Formatı</h2>
                <p>(Dokuman Adı Yazılır)</p>
            </div>
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
    
        <div class="main-content">
            <h1><span class="section-number">1. AMAÇ</span></h1>
            <p>${documentFields["field1"]}</p>
            <h1><span class="section-number">2. KAPSAM</span></h1>
            <p>${documentFields["field2"]}</p>
            <h1><span class="section-number">3. TANIMLAR</span></h1>
            <p>${documentFields["field3"]}</p>    
            <h1><span class="section-number">4. SORUMLULUKLAR</span></h1>
            <p>${documentFields["field4"]}</p>
            <h1><span class="section-number">5. UYGULAMA</span></h1>
            <p>${documentFields["field5"]}</p>
            <h1><span class="section-number">6. REFERANSLAR VE İLGİ DOKUMANLAR</span></h1>
            <p>${fileList.filter(f=>f.type==="file1").map(f=>f.fileName).join("<br />")}</p>
            <h1><span class="section-number">7. EKLER</span></h1>
            <p>${fileList.filter(f=>f.type==="file2").map(f=>f.fileName).join("<br />")}</p>
        </div>
    </body>
    </html>
  `;
        console.log(fileList.filter(f=>f==="file1").map(f=>f.fileName))
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


    const handleFileUpload = (event, type) => {
        const files = event.target.files;

        (async () => {
            const promiseArray = [];

            Array.from(files).forEach((file) => {
                promiseArray.push(
                    new Promise((resolve, reject) => {
                        if (!file) {
                            resolve(null);
                            return;
                        }

                        const reader = new FileReader();

                        reader.onload = () => {
                            const fileName = file.name;
                            const fileExtension = fileName.split(".").pop();
                            const fileBaseName = fileName.slice(
                                0,
                                -(fileExtension.length + 1),
                            );
                            const b64File = reader.result.split(",")[1];

                            resolve({
                                attachmentId: null,
                                b64: b64File,
                                extension: fileExtension,
                                fileName: fileBaseName,
                                type,
                            });
                        };

                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    }),
                );
            });

            setFileList([...fileList, ...(await Promise.all(promiseArray))]);
        })();
    };

    const handleFileRemove = (file) => {
        if (mode === DMode.Edit && file.attachmentId != null)
            setDeletionAttachmentList([...deletionAttachmentList, file.attachmentId]);

        setFileList((prev) => prev.filter((f) => f !== file));
    };

    const handleSubmit = () => {
        (async () => {
            const elements = document.querySelectorAll("[field-short-name]");
            const documentFields = {};

            elements.forEach((element) => {
                documentFields[element.getAttribute("field-short-name")] =
                    element.value;
            });

            const promiseArray = [];

            if (mode === DMode.Create) {
                const documentId = await createDocument({
                    title: title,
                    shortName: "document",
                    type: DocumentType.Document,
                    department: unit,
                    fields: documentFields,
                    ManuelId: manuelId,
                });

                fileList.forEach((file) => {
                    promiseArray.push(
                        uploadDocumentAttachment(
                            documentId,
                            file.b64,
                            file.extension,
                            file.fileName,
                            file.type,
                        ),
                    );
                });
            } else if (mode === DMode.Revise) {
                await createDocumentRevision(queryParameters.get("id"), documentFields);
            } else if (mode === DMode.Edit) {
                await changeDocument(data.id, documentFields);

                fileList
                    .filter((f) => f.attachmentId == null)
                    .forEach((file) =>
                        promiseArray.push(
                            uploadDocumentAttachment(
                                data.id,
                                file.b64,
                                file.extension,
                                file.fileName,
                                file.type,
                            ),
                        ),
                    );
                deletionAttachmentList.forEach((attachId) =>
                    promiseArray.push(deleteDocumentAttachment(data.id, attachId)),
                );
            }

            if (promiseArray.length > 0) await Promise.all(promiseArray);

            window.location.href = "/dokuman/listesi";
        })();
    };

    const onRevisionResult = (isRejected) => {
        if (isRejected)
            rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
        else acceptDocumentRevision(data.revision.documentId, data.revision.id);
        window.location.href="/onay-bekleyen-revizyonlar";

    };



    // MODE: create, edit, revise, viewRevision
    const mode = queryParameters.get("mode") ?? DMode.Create;

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

                if (mode === DMode.Edit) {
                    setFileList(
                        doc.attachments.map((a) => ({
                            attachmentId: a.attachmentID,
                            b64: null,
                            extension: a.extension,
                            fileName: a.fileName,
                            type: a.type,
                        })),
                    );
                }

                const elements = document.querySelectorAll("[field-short-name]");
                elements.forEach((element) => {
                    const fieldShortName = element.getAttribute("field-short-name");
                    element.value = doc.fields[fieldShortName].value;
                });
            })();
        }, []);
    }

    return (
        <div className="container-fluid p-5">
            <div className="row justify-content-between">
                <h3 className="col-3 large-title">Prosedür</h3>
                <div
                    className="col-6 row justify-content-end"
                    style={{ columnGap: "10px" }}
                >
                    {mode !== "viewRevision" && (
                        <button className="col-3 print-btn2" onClick={handleSubmit}>
                            Kaydet
                        </button>
                    )}
                    {mode === "viewRevision" && data != null && (
                        <>
                            <button
                                className="col-3 print-btn2 success-btn-1"
                                onClick={() => onRevisionResult(false)}
                            >
                                Onayla
                            </button>
                            <button
                                className="col-3 print-btn2 danger-btn-1"
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
                <div className="col-4">
                    <div className="card" style={{position: "sticky", top: "100px"}}>
                        <div className="card-header create-doc-card-header">
                            Doküman Bilgileri
                        </div>
                        <div className="card-body justify-content-center row">
                            <div
                                className="row mb-3 justify-content-center col-12 pb-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <label className="col-12 create-doc-p mb-3">
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
                            <div
                                className="row mb-3 justify-content-center col-12 pb-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <label className="col-12 create-doc-p mb-3">Döküman No</label>
                                <input
                                    className="col-12 create-doc-inp"
                                    value={manuelId}
                                    onChange={(e) => setManuelId(e.target.value)}
                                    type="text"
                                />
                            </div>
                            <div
                                className="row mb-3 justify-content-center col-12 pb-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <label className="col-12 create-doc-p mb-3">
                                    İlk Yayın Tarihi
                                </label>
                                <input
                                    className="col-12 create-doc-inp"
                                    type="date"
                                    field-short-name="p1"
                                />
                            </div>
                            <div
                                className="row mb-3 justify-content-center col-12 pb-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <label className="col-12 create-doc-p mb-3">
                                    Yürürlük Tarihi
                                </label>
                                <input
                                    className="col-12 create-doc-inp"
                                    type="date"
                                    field-short-name="p2"
                                />
                            </div>
                            <div
                                className="row mb-3 justify-content-center col-12 pb-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <label className="col-12 create-doc-p mb-3">Sayfa No</label>
                                <input
                                    className="col-12 create-doc-inp"
                                    type="number"
                                    field-short-name="p3"
                                />
                            </div>

                            <div
                                className="row mb-3 justify-content-center col-12 pb-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <label className="col-12 create-doc-p mb-3">
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
                <div className="col-8">
                    <div className="card">
                        <div className="card-header create-doc-card-header">
                            Doküman İçeriği
                        </div>
                        <div className="card-body justify-content-center row">
                            <div
                                className="row justify-content-center col-12 p-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <p className="create-doc-p">1. AMAÇ</p>
                                <textarea
                                    className="col-12 create-doc-textarea"
                                    name="purpose"
                                    field-short-name="field1"
                                    type="text"
                                />
                            </div>
                            <div
                                className="row justify-content-center col-12 p-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <p className="create-doc-p">2. KAPSAM</p>
                                <textarea
                                    className="col-12 create-doc-textarea"
                                    name="scope"
                                    field-short-name="field2"
                                    type="text"
                                />
                            </div>
                            <div
                                className="row justify-content-center col-12 p-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <p className="create-doc-p">3. TANIMLAR</p>
                                <textarea
                                    className="col-12 create-doc-textarea"
                                    name="definitions"
                                    field-short-name="field3"
                                    type="text"
                                />
                            </div>
                            <div
                                className="row justify-content-center col-12 p-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <p className="create-doc-p">4. SORUMLULUKLAR</p>
                                <textarea
                                    className="col-12 create-doc-textarea"
                                    name="responsibilities"
                                    field-short-name="field4"
                                    type="text"
                                />
                            </div>
                            <div
                                className="row justify-content-center col-12 p-3"
                                style={{borderBottom: "1px solid #ccc"}}
                            >
                                <p className="create-doc-p">5. UYGULAMALAR</p>
                                <textarea
                                    className="col-12 create-doc-textarea"
                                    name="implementations"
                                    field-short-name="field5"
                                    type="text"
                                />
                            </div>
                            {(mode === DMode.Create || mode === DMode.Edit) && (
                                <>
                                    <div
                                        className="row justify-content-center col-12 p-3"
                                        style={{borderBottom: "1px solid #ccc"}}
                                    >
                                        <p className="create-doc-p">
                                            6. REFERANSLAR VE İLGİLİ UYGULAMALAR
                                        </p>

                                        <FileUpload
                                            fileList={fileList}
                                            type="file1"
                                            onUpload={handleFileUpload}
                                            onRemove={handleFileRemove}
                                            canUpload={[DMode.Create, DMode.Edit].includes(mode)}
                                        />
                                    </div>

                                    <div className="row justify-content-center col-12 p-3">
                                        <p className="create-doc-p">7. EKLER</p>
                                        <FileUpload
                                            fileList={fileList}
                                            type="file2"
                                            onUpload={handleFileUpload}
                                            onRemove={handleFileRemove}
                                            canUpload={[DMode.Create, DMode.Edit].includes(mode)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-12 mt-5 row justify-content-around">
                    <div className="col-2 row">
                        <label className="col-12 purple-text text-center">Hazırlayan</label>
                        <input className="col-12 create-doc-inp text-center" field-short-name="bp-1" maxLength={30}/>
                    </div>

                    <div className="col-2 row">
                        <label className="col-12 purple-text text-center">Kontrol Eden</label>
                        <input className="col-12 create-doc-inp text-center" field-short-name="bp-2" maxLength={30}/>
                    </div>

                    <div className="col-2 row">
                        <label className="col-12 purple-text text-center">Onaylayan</label>
                        <input className="col-12 create-doc-inp text-center" field-short-name="bp-3" maxLength={30}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RisksProcedur;
