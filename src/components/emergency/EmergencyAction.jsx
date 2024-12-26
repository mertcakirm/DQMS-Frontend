import React, {useContext, useEffect, useState} from "react";
import {optionsList} from "../../Helpers/units.js";
import {changeDocument, createDocument, getDocumentFromId} from "../../API/Documents.js";
import {DocumentType} from "../../Helpers/typeMapper.js";
import {convertToUTC} from "../../API/convert.js";
import {
    acceptDocumentRevision,
    createDocumentRevision,
    getRevision,
    rejectDocumentRevision
} from "../../API/DocumentRevision.js";
import {DMode} from "../../Helpers/DMode.js";
import {useSearchParams} from "react-router-dom";
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPage from "../UnauthPage.jsx";

const EmergencyAction = () => {
    const[title, setTitle] = useState('')
    const[unit, setUnit] = useState("")
    const[manuelId, setManuelId] = useState("")
    const [queryParameters] = useSearchParams();
    const [data, setData] = useState(null);
    const handleFileUpload = (event) => {
        const files = event.target.files;
        const updatedFileList = [...fileList, ...Array.from(files)];
        setFileList(updatedFileList);
    };
    const filteredValue = optionsList.includes(unit) ? unit : "";


    const user = useContext(UserContext);
    if (!checkPermFromRole(user.roleValue, ActionPerm.DocumentViewAll))
        return <UnauthPage />;
    const mode = queryParameters.get("mode") ?? "create";

    if (mode !== "create")
    {
        const getId = queryParameters.get("id");

        if (!(!!getId))
            return;

        useEffect(() => {
            (async () => {
                const doc = await (mode === "viewRevision" ? getRevision(getId) : getDocumentFromId(getId, true));

                if (!(!!doc))
                    return;

                setData(doc);
                const dres = (mode !== DMode.ViewRevision ? doc : await getDocumentFromId(doc.revision.documentId)).document;

                setTitle(dres.title);
                setUnit(dres.department);
                setManuelId(dres.manuelId);
                const elements = document.querySelectorAll("[field-short-name]");
                elements.forEach((element) => {
                    const fieldShortName = element.getAttribute("field-short-name");
                    element.value = doc.fields[fieldShortName].value;
                });
            })();
        }, []);
    }

    const onSave = () => {
        (async () => {
            const elements = document.querySelectorAll("[field-short-name]");
            const documentFields = {};

            elements.forEach((element) => {
                documentFields[element.getAttribute("field-short-name")] = element.value;
            });



            if (mode === "create")
            {
                await createDocument({
                    "type": DocumentType.EmergencyAction,
                    "shortName": "document",
                    "title": title,
                    "fields": documentFields,
                    "department": unit,
                    "ManuelId":manuelId

                });
            } else if (mode === "revise")
            {
                await createDocumentRevision(queryParameters.get("id"), documentFields);
            } else if (mode === "edit")
            {
                await changeDocument(queryParameters.get("id"), documentFields);
            }
            window.location.href="/dokuman/listesi";

        })();
    };


    const onRevisionResult = (isRejected) => {
        if (isRejected)
            rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
        else acceptDocumentRevision(data.revision.documentId, data.revision.id);
        window.location.href="/onay-bekleyen-revizyonlar";
        
    };

    return (
        <div className="container-fluid p-5">
            <div className="row justify-content-between" style={{padding: '0px 30px'}}>
                <h3 className="col-6 large-title">ACİL DURUM EYLEM PLANI </h3>
                <div
                    className="col-6 row justify-content-end"
                    style={{columnGap: "10px"}}
                >
                    {mode !== "viewRevision" && (
                        <button className="col-2 print-btn2" onClick={onSave}>
                            Kaydet
                        </button>
                    )}
                    {mode === "viewRevision" && data != null && (
                        <>
                            <button
                                className="col-2 print-btn2 success-btn-1"
                                onClick={() => onRevisionResult(false)}
                            >
                                Onayla
                            </button>
                            <button
                                className="col-2 print-btn2 danger-btn-1"
                                onClick={() => onRevisionResult(true)}
                            >
                                Reddet
                            </button>
                        </>
                    )}
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


            <div className="row mt-5">
                <div className="col-4">
                    <div className="card" style={{position: 'sticky', top: '100px'}}>
                        <div className="card-header create-doc-card-header">
                            Doküman Bilgileri
                        </div>
                        <div className="card-body justify-content-center row">
                            <div className="row mb-3 justify-content-center col-12 pb-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <label className="col-12 create-doc-p mb-3">Doküman Başlığı</label>
                                <input className="col-12 create-doc-inp" value={title}
                                       onChange={e => setTitle(e.target.value)} type="text"/>
                            </div>
                            <div className="row mb-3 justify-content-center col-12 pb-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <label className="col-12 create-doc-p mb-3">Döküman No</label>
                                <input className="col-12 create-doc-inp" type="text" value={manuelId}
                                       onChange={e => setManuelId(e.target.value)}/>
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
                            <div className="row  justify-content-center col-12 pb-3">
                                <label className="col-12 create-doc-p mb-3">Dokümanı Oluşturan Birim</label>
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
                            Değerlendirmeler
                        </div>
                        <div className="card-body justify-content-center row">
                            <div className="row justify-content-center col-12 p-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <p className="create-doc-p">Yayın Tarihi</p>
                                <input className="col-12 create-doc-inp" field-short-name="date1" type="date"/>
                            </div>
                            <div className="row justify-content-center col-12 p-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <p className="create-doc-p">Geçerlilik Tarihi</p>
                                <input className="col-12 create-doc-inp" field-short-name="date2" type="date"/>

                            </div>
                            <div className="row justify-content-center col-12 p-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <p className="create-doc-p">Revizyon Tarihi</p>
                                <input className="col-12 create-doc-inp" field-short-name="date3" type="date"/>

                            </div>
                            <div className="row justify-content-center col-12 p-3"
                                 style={{borderBottom: '1px solid #ccc'}}>
                                <p className="create-doc-p">Revizyon No</p>
                                <input className="col-12 create-doc-inp" field-short-name="field1" type="number"/>

                            </div>
                            <div className="row justify-content-center col-12 p-3">
                                <p className="create-doc-p">SGK Numarası</p>
                                <input className="col-12 create-doc-inp" field-short-name="field2" type="number"/>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 mt-5 row justify-content-between">
                    <div className="col-3 row">
                        <label className="col-12 purple-text text-center">IG UZMANI</label>
                        <input className="col-12 create-doc-inp text-center" field-short-name="bp1" maxLength={30}/>
                    </div>

                    <div className="col-3 row">
                        <label className="col-12 purple-text text-center">İŞYERİ HEKİMİ</label>
                        <input className="col-12 create-doc-inp text-center" field-short-name="bp2" maxLength={30}/>
                    </div>

                    <div className="col-3 row">
                        <label className="col-12 purple-text text-center">Genel Müdür Yardımcısı</label>
                        <input className="col-12 create-doc-inp text-center" field-short-name="bp3" maxLength={30}/>
                    </div>

                    <div className="col-3 row">
                        <label className="col-12 purple-text text-center">Genel Müdür</label>
                        <input className="col-12 create-doc-inp text-center" field-short-name="bp4" maxLength={30}/>
                    </div>

                </div>
            </div>


        </div>
    );
};

export default EmergencyAction;
