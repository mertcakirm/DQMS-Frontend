import React, {useContext, useEffect, useState} from "react";
import {changeDocument, createDocument, getDocumentFromId} from "../../API/Documents.js";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import {DocumentType} from "../../Helpers/typeMapper.js";
import {optionsList} from "../../Helpers/units.js";
import {getUsers} from "../../API/User.js";
import {useSearchParams} from "react-router-dom";
import {DMode} from "../../Helpers/DMode.js";
import {
    acceptDocumentRevision,
    createDocumentRevision,
    getRevision,
    rejectDocumentRevision
} from "../../API/DocumentRevision.js";
import UnauthPage from "../other/UnauthPage.jsx";



const ReviewManagement = () => {
    const [participants, setParticipants] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState("");
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState("");
    const [decisions, setDecisions] = useState([
        { decision: "", unit: "", deadline: "" },
    ]);
    const[title, setTitle] = useState('')
    const[unit, setUnit] = useState("")
    const[manuelId, setManuelId] = useState("");
    const filteredValue = optionsList.includes(unit) ? unit : "";
    const [userNames, setUserNames] = useState([]);

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
    <title>YGG Toplantı Tutanağı</title>
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

        .form-table{
            margin-bottom: 15px;
        }


    </style>
</head>
<body>
    <div class="page">
        <div class="header-section">
            <table class="header-table">
                <tr>
                    <td class="logo-cell"></td>
                    <td class="title-cell">YGG Toplantı Tutanağı</td>
                    <td class="info-cell" style="padding: 0;">
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
                    </td>
                </tr>
            </table>
        </div>

        <table class="form-table">
            <tr>
                <td class="label-cell">YGG Tarihi</td>
                <td class="value-cell">${documentFields["date"]}</td>
            </tr>
            <tr>
                <td class="label-cell">YGG Yeri</td>
                <td class="value-cell">${documentFields["place"]}</td>
            </tr>
            <tr>
                <td class="label-cell">Saati</td>
                <td class="value-cell">${documentFields["time"]}</td>
            </tr>
        </table>
        
        <table >
            <thead>
                <tr>
                    <td colspan="4" style="text-align:center; font-weight: bold; background-color: #D3D3D3;">KATILIMCILAR</td>
                </tr>
                <tr>
                    <td style="background-color: #D3D3D3; font-weight: bold;">Ad Soyad</td>
                    <td style="background-color: #D3D3D3; font-weight: bold;">İmza</td>
                </tr>
            </thead>
            <tbody>  
                    ${participants.map((doc) => (
                        `<tr key={doc.id}>
                            <td>${doc || "Belirtilmemiş"}</td>
                            <td></td>
                        </tr>`
                ))
                }
            </tbody>
        </table>
         <table class="agenda-table">
            <tr>
                <th colspan="2">GÜNDEM KONULARI</th>
            </tr>
                    ${topics.map((doc,index) => (
                        `<tr key={index}>
                            <td>${index}</td>
                            <td>${doc}</td>
                        </tr>`
                        ))
                        }
        </table>
        
        
        <table class="decisions-table">
                <tr class="section-header">
                    <td colspan="3">ALINAN KARARLAR</td>
                </tr>
                <tr class="table-header">
                    <td class="kararlar-cell">Kararlar</td>
                    <td class="sorumlu-cell">Sorumlu Birim</td>
                    <td class="termin-cell">Termin Tarihi</td>
                </tr>
                    ${decisions.map((doc) => (
                        `<tr key={index}>
                            <td>${doc.decision || "Belirtilmemiş"}</td>
                            <td>${doc.unit || "Belirtilmemiş"}</td>
                            <td>${doc.deadline || "Belirtilmemiş"}</td>
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

    const user = useContext(UserContext);
    if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
        return <UnauthPage />;

    useEffect(() => {
        (async () =>{
            const users = await getUsers();
            setUserNames(users.map(user => user.name + " " + user.surname));
        })();
    }, []);

    const addDecisionRow = () => {
        setDecisions([...decisions, { decision: "", unit: "", deadline: "" }]);
    };

    const removeDecisionRow = (index) => {
        const updatedDecisions = decisions.filter((_, i) => i !== index);
        setDecisions(updatedDecisions);
    };

    const handleInputChange = (index, field, value) => {
        const updatedDecisions = decisions.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setDecisions(updatedDecisions);
    };

    const addParticipant = () => {
        if (selectedParticipant && !participants.includes(selectedParticipant)) {
            setParticipants([...participants, selectedParticipant]);
            setSelectedParticipant(""); // Reset the selection
        }
    };

    const removeParticipant = (participant) => {
        setParticipants(participants.filter((item) => item !== participant));
    };


    const addTopic = () => {
        if (newTopic.trim() === "") return;
        setTopics([...topics, newTopic]);
        setNewTopic("");
    };

    const removeTopic = (topic) => {
        const updatedTopics = topics.filter((t) => t !== topic);
        setTopics(updatedTopics);
    };


    const onSave = () => {
        (async () => {
            const elements = document.querySelectorAll("input[field-short-name]");
            const documentFields = {};

            elements.forEach((element) => {
                documentFields[element.getAttribute("field-short-name")] = element.value;
            });

            documentFields["participants"] = JSON.stringify(participants);
            documentFields["topics"] = JSON.stringify(topics);
            documentFields["decisions"] = JSON.stringify(decisions);

            if (mode === DMode.Create)
            {
                await createDocument({
                    "type": DocumentType.YGGMeeting,
                    "shortName": "document",
                    "title": title,
                    "fields": documentFields,
                    "department":unit,
                    "ManuelId":manuelId

                });
            } else if (mode === DMode.Revise)
            {
                await createDocumentRevision(queryParameters.get("id"), documentFields);
            } else if (mode === DMode.Edit)
            {
                await changeDocument(queryParameters.get("id"), documentFields);
            }

            window.location.href="/dokuman/listesi"
        })();
    };

    const onRevisionResult = (isRejected) => {
        if (isRejected)
            rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
        else
            acceptDocumentRevision(data.revision.documentId, data.revision.id);
        window.location.href="/onay-bekleyen-revizyonlar";

    };

    const [queryParameters] = useSearchParams();
    const [data, setData] = useState(null);

    // MODE: create, edit, revise, viewRevision
    const mode = queryParameters.get("mode") ?? DMode.Create;

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

                setParticipants(JSON.parse(doc.fields["participants"].value));
                setTopics(JSON.parse(doc.fields["topics"].value));
                setDecisions(JSON.parse(doc.fields["decisions"].value));

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
                <h3 className="col-6 large-title">YGG Toplantı Tutanağı</h3>
                <div className="col-6 row justify-content-end" style={{columnGap: '10px'}}>

                    {mode !== "viewRevision" && <button className="col-2 print-btn2" onClick={onSave}>Kaydet</button>}
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
                            Doküman Bilgileri
                        </div>
                        <div className="card-body justify-content-center row">
                            <div className="row mb-3 justify-content-center pb-3 col-12 "
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <label className="col-12 create-doc-p mb-3">Doküman Başlığı</label>
                                <input className="col-12 create-doc-inp" value={title}
                                       onChange={(e) => setTitle(e.target.value)} name="docNum" type="text"/>
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
                            <div className="row mb-3 justify-content-center col-12 py-3">
                                <label className="col-12 create-doc-p mb-3">Sorumlu Birim</label>
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
                        </div>
                    </div>
                </div>

                <div className="col-8">
                    <div className="card">
                        <div className="card-header create-doc-card-header">
                            Toplantı Tutanağı Bilgileri
                        </div>
                        <div className="card-body justify-content-center row ">
                            <div className="justify-content-between row p-5 pb-0 pt-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                            <div className="row mb-3 justify-content-center col-3 pb-3">
                                    <label className="col-12 create-doc-p text-center mb-3">YGG Tarihi</label>
                                    <input className="col-12 create-doc-inp" type="date" field-short-name="date"/>
                                </div>
                                <div className="row mb-3 justify-content-center col-3 pb-3">
                                    <label className="col-12 create-doc-p text-center  mb-3">YGG Yeri</label>
                                    <input className="col-12 create-doc-inp" type="text" field-short-name="place"/>
                                </div>
                                <div className="row mb-3 justify-content-center col-3 pb-3">
                                    <label className="col-12 create-doc-p text-center mb-3">YGG Saati</label>
                                    <input className="col-12 create-doc-inp" type="time" field-short-name="time"/>
                                </div>
                            </div>


                            <div className="row pt-3 pb-3" style={{borderBottom: '1px solid #ccc'}}>
                                <p className="smalltitle col-6">Katılımcılar</p>
                                <h6 className="col-6">Katılımcı Listesi</h6>

                                {/* Add Participant */}
                                <div className="col-lg-3 col-4 row align-items-center">
                                    <select
                                        className="col-12"
                                        value={selectedParticipant}
                                        onChange={(e) => setSelectedParticipant(e.target.value)}
                                    >
                                        <option value="">Seçim Yapın</option>
                                        {userNames.map((name, index) => (
                                            <option key={index} value={name}>{name}</option>))}

                                    </select>
                                    <button className="print-btn2 col-12 mt-3" onClick={addParticipant}>
                                        + Katılımcı Ekle
                                    </button>
                                </div>
                                <div className="col-lg-9 col-4 row text-center justify-content-between"
                                     style={{rowGap: '10px'}}>
                                    {participants.map((participant, index) => (
                                        <div
                                            key={index}
                                            className="col-6 row align-items-center"
                                        >
                                            <span className="col-8">{participant}</span>
                                            <button
                                                className="btn btn-danger col-4"
                                                onClick={() => removeParticipant(participant)}
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="row pt-3 pb-3" style={{borderBottom: '1px solid #ccc'}}>
                                <p className="smalltitle col-6">Gündem Konuları</p>
                                <h6 className="col-6">Konu Listesi</h6>

                                <div className="col-3 row align-items-center">
                                    <input
                                        type="text"
                                        className="form-control col-12"
                                        placeholder="Yeni Konu Girin"
                                        value={newTopic}
                                        onChange={(e) => setNewTopic(e.target.value)}
                                    />
                                    <button className="print-btn2 col-12 mt-3" onClick={addTopic}>
                                        + Konu Ekle
                                    </button>
                                </div>

                                <div
                                    className="col-9 row text-center justify-content-between p-5"
                                    style={{rowGap: "10px"}}
                                >
                                    {topics.map((topic, index) => (
                                        <div key={index} className="col-12 row align-items-center">
                                            <span className="col-8 text-start">{topic}</span>
                                            <button
                                                className="btn btn-danger col-4"
                                                onClick={() => removeTopic(topic)}
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="row pt-3">
                                <p className="smalltitle col-6">Alınan Kararlar</p>
                                <div className="col-6 row justify-content-end">
                                    <button className="print-btn2 col-6" onClick={addDecisionRow}>
                                        + Karar Ekle
                                    </button>

                                </div>

                                {/* Tablo */}
                                <div className="col-12">
                                    <table className="table table-bordered mt-3">
                                        <thead>
                                        <tr>
                                            <th>Kararlar</th>
                                            <th>Sorumlu Birim</th>
                                            <th>Termin Tarihi</th>
                                            <th>İşlem</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {decisions.map((decision, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={decision.decision}
                                                        onChange={(e) =>
                                                            handleInputChange(index, "decision", e.target.value)
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={decision.unit}
                                                        onChange={(e) =>
                                                            handleInputChange(index, "unit", e.target.value)
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={decision.deadline}
                                                        onChange={(e) =>
                                                            handleInputChange(index, "deadline", e.target.value)
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => removeDecisionRow(index)}
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


            </div>
        </div>

    );
};

export default ReviewManagement;
