import React, {useContext, useEffect, useState} from 'react';
import {optionsList} from "../../Helpers/units.js";
import {getUsers} from "../../API/User.js";
import {changeDocument, createDocument, getDocumentFromId} from "../../API/Documents.js";
import {DocumentType} from "../../Helpers/typeMapper.js";
import {DMode} from "../../Helpers/DMode.js";
import {
    acceptDocumentRevision,
    createDocumentRevision,
    getRevision,
    rejectDocumentRevision
} from "../../API/DocumentRevision.js";
import {useSearchParams} from "react-router-dom";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../UnauthPage.jsx";

const AuditReport = () => {
    const[unit, setUnit] = useState("");
    const [title, setTitle] = useState("");
    const[manuelId, setManuelId] = useState("");

    const [userNames, setUserNames] = useState([]);
    const [ auditer, setAuditer] = useState([
        { name_surname: "", tagname: ""},
    ]);
    const [ otherPerson, setOtherPerson] = useState([
        { name_surname: "", tagname: ""},
    ]);
    const [ questions, setQuestions] = useState([
        { question: "", explanation: "",conclusion:""},
    ]);

    const filteredValue = optionsList.includes(unit) ? unit : "";

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
    <title>İç Denetim Raporu - Sayfa 1</title>
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
        }

        .form-header td:nth-child(even) {
            background-color: white;
        }

        .label-cell {
            width: 25%;
            background-color: #D3D3D3 !important;
        }

        .value-cell {
            width: 75%;
        }

        .section-title {
            background-color: #D3D3D3;
            padding: 8px;
            font-weight: bold;
            text-align: center;
            border: 1px solid black;
            margin-top: 15pt;
        }

        .content-table {
            margin-top: 5pt;
        }

        .content-table th {
            background-color: #D3D3D3;
            padding: 4pt 8pt;
            font-weight: bold;
            border: 1px solid black;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header-section">
            <table class="header-table">
                <tr>
                    <td class="logo-cell"></td>
                    <td class="title-cell">İÇ DENETİM RAPORU</td>
                    <td class="info-cell" style="padding: 0;">
                        <table class="info-table" style="border-collapse: collapse; width: 100%;">
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
                    </td>
                </tr>
            </table>
        </div>

               <table class="content-table">
            <tr>
                <td class="label-cell">Denetim Tarihi</td>
                <td class="value-cell">${documentFields["date1"]}</td>
            </tr>
            <tr>
                <td class="label-cell">Denetlenen Birim</td>
                <td class="value-cell">${unit}</td>
            </tr>
        </table>
        <div class="section-title">DENETİM EKİBİ</div>
        <table class="content-table">
            <tr>
                <th style="width: 40%;">Denetçi Ad Soyad</th>
                <th style="width: 30%;">Unvanı</th>
                <th style="width: 30%;">İmza</th>
            </tr>
                ${auditer.map((doc) => (
            `<tr key={doc.id}>
                            <td>${doc.name_surname || "Belirtilmemiş"}</td>
                            <td>${doc.tagname || "Belirtilmemiş"}</td>
                            <td></td>
                        </tr>`
        ))
        }

        </table>
        <div class="section-title">DENETİMDE GÖRÜŞÜLEN KİŞİLER</div>
        <table class="content-table">
            <tr>
                <th style="width: 40%;">Ad Soyad</th>
                <th style="width: 30%;">Unvanı</th>
                <th style="width: 30%;">İmza</th>
            </tr>
                ${otherPerson.map((doc) => (
            `<tr key={doc.id}>
                            <td>${doc.name_surname || "Belirtilmemiş"}</td>
                            <td>${doc.tagname || "Belirtilmemiş"}</td>
                            <td></td>
                        </tr>`
        ))
        }
                </table>    
         <table class="content-table">
            <tr>
                <th style="width: 30%;">Sorular</th>
                <th style="width: 25%;">Tespitler/Açıklama</th>
                <th style="width: 20%;">Sonuç</th>
            </tr>

            ${questions.map((doc) => (
            `<tr key={doc.id}>
                            <td>${doc.question || "Belirtilmemiş"}</td>
                            <td>${doc.explanation || "Belirtilmemiş"}</td>
                            <td>${doc.conclusion || "Belirtilmemiş"}</td>
                        </tr>`
        ))
        }

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



    useEffect(() => {
        (async () =>{
            const users = await getUsers();
            setUserNames(users.map(user => user.name + " " + user.surname));
        })();
    }, []);

    const addWitnessRow = () => {
        setAuditer([...auditer, {name_surname: "", tagname: ""}]);
    };

    const removeWitnessRow = (index) => {
        const updatedauditer = auditer.filter((_, i) => i !== index);
        setAuditer(updatedauditer);
    };

    const handleInputChange = (index, field, value) => {
        const updatedauditer = auditer.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setAuditer(updatedauditer);
    };

    const addOtherRow = () => {
        setOtherPerson([...otherPerson, {name_surname: "", tagname: ""}]);
    };

    const removeOtherRow = (index) => {
        const updatedotherPerson = otherPerson.filter((_, i) => i !== index);
        setOtherPerson(updatedotherPerson);
    };

    const handleInputChange2 = (index, field, value) => {
        const updatedotherPerson = otherPerson.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setOtherPerson(updatedotherPerson);
    };

    const addQuestionsRow = () => {
        setQuestions([...questions, {question: "", explanation: "",conclusion:""}]);
    };

    const removeQuestionsRow = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleInputChange3 = (index, field, value) => {
        const updatedQuestions = questions.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setQuestions(updatedQuestions);
    };

    const [queryParameters] = useSearchParams();
    const [data, setData] = useState(null);
    const mode = queryParameters.get("mode") ?? DMode.Create;

    const handleSubmit=()=>{
        (async () => {
            const elements = document.querySelectorAll("[field-short-name]");
            const documentFields = {};
            documentFields["auditer"] = JSON.stringify(auditer);
            documentFields["otherPerson"] = JSON.stringify(otherPerson);
            documentFields["questions"] = JSON.stringify(questions);

            elements.forEach((element) => {
                const fieldName = element.getAttribute("field-short-name");
                const elementTag = element.tagName.toLowerCase();
                let value = element.value;

                documentFields[fieldName] = value;
            });
            if (mode === DMode.Create)
            {
            await createDocument({
                "title": title,
                "shortName": 'document',
                "type": DocumentType.Audit,
                "department": unit,
                "fields": documentFields,
                "ManuelId": manuelId,
            });
        } else if (mode === DMode.Revise)
        {
            await createDocumentRevision(queryParameters.get("id"), documentFields);
        } else if (mode === DMode.Edit)
        {
            await changeDocument(queryParameters.get("id"), documentFields);
        }
            window.location.href="/ic-denetim/cizelge"
        })();
    }


    const onRevisionResult = (isRejected) => {
        if (isRejected)
            rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
        else
            acceptDocumentRevision(data.revision.documentId, data.revision.id);
        window.location.href="/onay-bekleyen-revizyonlar";

    };

    if (mode !== DMode.Create)
    {
        const getId = queryParameters.get("id");

        if (!(!!getId))
            return;

        useEffect(() => {
            (async () => {
                let doc = await (mode === DMode.ViewRevision ? getRevision(getId) : getDocumentFromId(getId, true));

                if (mode !== DMode.ViewRevision)
                    doc = {...doc.document, attachments: doc.attachments, fields: doc.fields }
                else
                {
                    const _tempDoc = await getDocumentFromId(doc.revision.documentId, false);
                    doc = {..._tempDoc.document, attachments: _tempDoc.attachments, fields: doc.fields, revision: doc.revision }
                }

                if (!(!!doc))
                    return;

                setData(doc);

                setTitle(doc.title);
                setUnit(doc.department);
                setManuelId(doc.manuelId);

                setAuditer(JSON.parse(doc.fields["auditer"].value));
                setOtherPerson(JSON.parse(doc.fields["otherPerson"].value));
                setQuestions(JSON.parse(doc.fields["questions"].value));

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
                <h3 className="col-3 large-title">İÇ DENETİM RAPORU </h3>
                <div className="col-6 row justify-content-end" style={{columnGap: '10px'}}>
                    {mode !== "viewRevision" && <button className="col-2 print-btn2" onClick={handleSubmit}>Kaydet</button>}
                    {mode === "viewRevision" && data != null && (
                        <>
                            <button className="col-2 print-btn2 success-btn-1" onClick={() => onRevisionResult(false)}>Onayla</button>
                            <button className="col-2 print-btn2 danger-btn-1" onClick={() => onRevisionResult(true)}>Reddet</button>
                        </>
                    )}
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
            </div>
            <div className="row mt-5">


                <div className="col-4">
                    <div className="card" style={{position: 'sticky', top: '100px'}}>
                        <div className="card-header create-doc-card-header">
                            Denetim Bilgileri
                        </div>
                        <div className="card-body justify-content-center row">
                            <div className="row mb-3 justify-content-center col-12 pb-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <label className="col-12 create-doc-p mb-3">Doküman Başlığı</label>
                                <input className="col-12 create-doc-inp" name="doctitle"
                                       value={title} onChange={e => setTitle(e.target.value)} type="text"/>
                            </div>
                            <div className="row mb-3 justify-content-center col-12 pb-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <label className="col-12 create-doc-p mb-3">Döküman No</label>
                                <input className="col-12 create-doc-inp" type="text" value={manuelId} onChange={e=>setManuelId(e.target.value)}/>
                            </div>
                            <div className="row mb-3 justify-content-center col-12 pb-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <label className="col-12 create-doc-p mb-3">İlk Yayın Tarihi</label>
                                <input className="col-12 create-doc-inp" type="date" field-short-name="p1"/>
                            </div>
                            <div className="row mb-3 justify-content-center col-12 pb-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <label className="col-12 create-doc-p mb-3">Yürürlük Tarihi</label>
                                <input className="col-12 create-doc-inp" type="date" field-short-name="p2"/>
                            </div>
                            <div className="row mb-3 justify-content-center col-12 pb-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <label className="col-12 create-doc-p mb-3">Sayfa No</label>
                                <input className="col-12 create-doc-inp" type="number" field-short-name="p3"/>
                            </div>
                            <div className="row mb-3 justify-content-center col-12 pb-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <label className="col-12 create-doc-p mb-3">Denetleme Tarihi</label>
                                <input className="create-doc-inp" type="date" field-short-name="date1"/>
                            </div>
                            <div className="row justify-content-center col-12 pb-3 mb-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <label className="col-12 create-doc-p mb-3">Denetlenen Birim</label>
                                <select
                                    value={filteredValue}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="create-doc-inp">
                                    {optionsList.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="row  justify-content-center col-12 pb-3">
                                <label className="col-12 create-doc-p mb-3">Birim Sorumlusu</label>
                                <select className="col-12 mt-3 create-doc-inp" field-short-name="select1">
                                    <option value="">Seçim Yapın</option>
                                    {userNames.map((name, index) => (<option key={index} value={name}>{name}</option>))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-8 py-3" style={{border: '1px solid #ccc', borderRadius: '10px'}}>
                    <div className="row pt-3 col-12">
                        <p className="smalltitle col-6">Denetim Ekibi</p>
                        <div className="col-6 row justify-content-end">
                            <button className="print-btn2 col-6" onClick={addWitnessRow}>
                                + Ekip Üyesi Ekle
                            </button>

                        </div>

                        <div className="col-12">
                            <table className="table table-bordered mt-3">
                                <thead>
                                <tr>
                                    <th>Denetçi Adı Soyadı</th>
                                    <th>Unvanı</th>
                                    <th>İşlem</th>
                                </tr>
                                </thead>
                                <tbody>
                                {auditer.map((witness, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={witness.name_surname}
                                                onChange={(e) =>
                                                    handleInputChange(index, "name_surname", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={witness.tagname}
                                                onChange={(e) =>
                                                    handleInputChange(index, "tagname", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => removeWitnessRow(index)}
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div className="row pt-3 col-12">
                        <p className="smalltitle col-6">Görüşülen Diğer Kişiler</p>
                        <div className="col-6 row justify-content-end">
                            <button className="print-btn2 col-6" onClick={addOtherRow}>
                                + Kişi Ekle
                            </button>
                        </div>

                        <div className="col-12">
                            <table className="table table-bordered mt-3">
                                <thead>
                                <tr>
                                    <th>Adı Soyadı</th>
                                    <th>Unvanı</th>
                                    <th>İşlem</th>
                                </tr>
                                </thead>
                                <tbody>
                                {otherPerson.map((otherPerson, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={otherPerson.name_surname}
                                                onChange={(e) =>
                                                    handleInputChange2(index, "name_surname", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={otherPerson.tagname}
                                                onChange={(e) =>
                                                    handleInputChange2(index, "tagname", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => removeOtherRow(index)}
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div className="row pt-3 col-12">
                        <p className="smalltitle col-6">Sorular ve Tespitler</p>
                        <div className="col-6 row justify-content-end">
                            <button className="print-btn2 col-6" onClick={addQuestionsRow}>
                                + Soru Ekle
                            </button>
                        </div>

                        <div className="col-12">
                            <table className="table table-bordered mt-3">
                                <thead>
                                <tr>
                                    <th>Sorular</th>
                                    <th>Tespitler / Açıklama</th>
                                    <th>Sonuç</th>
                                    <th>İşlem</th>
                                </tr>
                                </thead>
                                <tbody>
                                {questions.map((questions, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={questions.question}
                                                onChange={(e) =>
                                                    handleInputChange3(index, "question", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={questions.explanation}
                                                onChange={(e) =>
                                                    handleInputChange3(index, "explanation", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={questions.conclusion}
                                                onChange={(e) =>
                                                    handleInputChange3(index, "conclusion", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => removeQuestionsRow(index)}
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditReport;
