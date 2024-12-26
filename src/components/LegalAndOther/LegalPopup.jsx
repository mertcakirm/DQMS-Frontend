import './popup.css'
import React, {useEffect, useState} from "react";
import {changeDocument, createDocument, getDocumentFromId} from "../../API/Documents.js";
import {DocumentType} from "../../Helpers/typeMapper.js";
import {optionsList} from "../../Helpers/units.js";
import {DMode} from "../../Helpers/DMode.js";
import {
    acceptDocumentRevision,
    createDocumentRevision,
    getRevision,
    rejectDocumentRevision
} from "../../API/DocumentRevision.js";

const LegalPopup = ({ mode, id, popupCloser }) => {
    const [unit, setUnit] = useState("");
    const [title, setTitle] = useState("");
    const [data, setData] = useState(null);
    const filteredValue = optionsList.includes(unit) ? unit : "";

    const onSave = () => {
        (async () => {
            const elements = document.querySelectorAll("[field-short-name]");
            const documentFields = {};

            elements.forEach((element) => {
                const fieldName = element.getAttribute("field-short-name");
                let value = element.value;

                documentFields[fieldName] = value;
            });

                if (mode === DMode.Create) {
                    await createDocument({
                        "type": DocumentType.Legal,
                        "shortName": "document",
                        "title": title,
                        "fields": documentFields,
                        "department":unit
                    });
                } else if (mode === DMode.Revise) {
                    await createDocumentRevision(id, documentFields);
                } else if (mode === DMode.Edit) {
                    await changeDocument(id, documentFields);
                }

                popupCloser(false);
        })();
    };

    const onRevisionResult = (isRejected) => {
        if (isRejected)
            rejectDocumentRevision(data.revision.documentId, data.revision.id, null);
        else acceptDocumentRevision(data.revision.documentId, data.revision.id);
        window.location.href="/onay-bekleyen-revizyonlar";

    };
    if (mode !== DMode.Create) {
        if (!!!id) return;

        useEffect(() => {
            (async () => {
                let doc = await (mode === DMode.ViewRevision
                    ? getRevision(id)
                    : getDocumentFromId(id, true));

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
                setUnit(doc.department);
                setTitle(doc.title);

                const elements = document.querySelectorAll("[field-short-name]");
                elements.forEach((element) => {
                    const fieldShortName = element.getAttribute("field-short-name");
                    element.value = doc.fields[fieldShortName].value;
                });
            })();
        }, []);
    }

    return (
        <div>
            <div className="popup-overlay">
                <div className="popup-content">
                    <h4 className="large-title">Yeni Değerlendirme Ekle</h4>
                    <div>
                        <div className="row p-5">
                            <div className="col-6 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">Döküman Adı</label>
                                <input className="create-doc-inp" type="text" value={title}
                                       onChange={e => setTitle(e.target.value)}/>
                            </div>
                            <div className="col-6 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">İzin Türü</label>
                                <input className="create-doc-inp" type="text" field-short-name="field1"/>
                            </div>
                            <div className="col-12 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">Takiple İlgili Faaliyet</label>
                                <input className="create-doc-inp" type="text" field-short-name="field2"/>
                            </div>
                            <div className="col-12 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">İlgili Yasal / Diğer Gereklilik</label>
                                <input className="create-doc-inp" type="text" field-short-name="field4"/>
                            </div>
                            <div className="col-6 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">İzin Referans No</label>
                                <input className="create-doc-inp" type="text" field-short-name="field5"/>
                            </div>
                            <div className="col-6 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">Kontrol Sıklığı</label>
                                <input className="create-doc-inp" type="number" field-short-name="field6"/>
                            </div>
                            <div className="col-6 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">Başlangıç Tarihi</label>
                                <input className="create-doc-inp" type="date" field-short-name="date1"/>
                            </div>
                            <div className="col-6 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">Bitiş Tarihi</label>
                                <input className="create-doc-inp" type="date" field-short-name="date2"/>
                            </div>
                            <div className="col-6 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">Yetkili Kurum</label>
                                <input className="create-doc-inp" type="text" field-short-name="field7"/>
                            </div>
                            <div className="col-6 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">Sorumlu Birim</label>
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
                            <div className="col-12 row" style={{padding: '5px 40px '}}>
                                <label className="purple-text">Açıklama</label>
                                <input className="create-doc-inp" type="text" field-short-name="field8"/>
                            </div>

                            <div
                                className="col-12 row justify-content-between"
                                style={{padding: "10px 40px "}}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        popupCloser(false);
                                    }}
                                    className="btn print-btn2 mt-5 col-2"
                                >
                                    İptal
                                </button>

                                {mode !== DMode.ViewRevision && (
                                    <button
                                        className="btn print-btn2 mt-5 col-2"
                                        onClick={onSave}
                                    >
                                        Kaydet
                                    </button>
                                )}
                                {mode === DMode.ViewRevision && data != null && (
                                    <>
                                        <button
                                            className="cbtn print-btn2 mt-5 col-2 success-btn-1"
                                            onClick={() => onRevisionResult(false)}
                                        >
                                            Onayla
                                        </button>
                                        <button
                                            className="btn print-btn2 mt-5 col-2 danger-btn-1"
                                            onClick={() => onRevisionResult(true)}
                                        >
                                            Reddet
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalPopup;
