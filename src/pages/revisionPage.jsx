import Sidebar from "../components/Sidebar";
import { useState ,useEffect } from "react";
import {getUsers} from "../API/User.js";
import {createDocument} from "../API/Documents.js";
import {DocumentType} from "../Helpers/typeMapper.js";
import {sendDocumentRevisionRequest} from "../API/DocumentRevision.js"
import { useSearchParams } from 'react-router-dom';

const RevisionPage = () => {
    const [userNames, setUserNames] = useState([]);
    const[title, setTitle] = useState("");
    const[manuelId,setManuelId]= useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const id=searchParams.get("id");

    useEffect(() => {
        (async () =>{
            const users = await getUsers();
            setUserNames(users.map(user => user.name + " " + user.surname));
        })();
    }, []);

    const onSave = () => {
        (async () => {
            const elements = document.querySelectorAll("[field-short-name]");
            const documentFields = {};

            elements.forEach((element) => {
                documentFields[element.getAttribute("field-short-name")] = element.value;
            });

            await createDocument({
                "type": DocumentType.Revision,
                "shortName": "document",
                "title": title,
                "fields": documentFields,
                "department":null,
                "ManuelId":manuelId

            });
            await sendDocumentRevisionRequest(id, documentFields["field2"]);
            window.location.href="/dokuman/listesi"
        })();
    };
    return (
        <div className="document-parent">
            <Sidebar />
            <div className="content-container">
                <div className="container-fluid p-5">
                    <div className="row justify-content-between">
                        <h3 className="col-6 large-title">Revizyon Talep Formu</h3>

                        <div className="col-6 row justify-content-end" style={{columnGap: '10px'}}>
                            <button className="col-2 print-btn2" onClick={onSave}>Kaydet</button>
                            <button className="col-2 print-btn">
                                <svg width="30" height="30" viewBox="0 0 86 71" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
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
                            <div className="card">
                                <div className="card-header create-doc-card-header">
                                    Talep Bilgileri
                                </div>
                                <div className="card-body justify-content-center row">
                                    <div className="row mb-3 justify-content-center col-12 pb-3"
                                         style={{borderBottom: '1px solid #ccc'}}>
                                        <label className="col-12 create-doc-p mb-3">Doküman Başlığı</label>
                                        <input className="col-12 create-doc-inp" type="text" value={title}
                                               onChange={e => setTitle(e.target.value)}/>
                                    </div>
                                    <div className="row mb-3 justify-content-center col-12 pb-3"
                                         style={{borderBottom: '1px solid #ccc'}}>
                                        <label className="col-12 create-doc-p mb-3">Doküman No</label>
                                        <input className="col-12 create-doc-inp" type="text" value={manuelId}
                                               onChange={e => setManuelId(e.target.value)}/>
                                    </div>
                                    <div className="row mb-3 justify-content-center col-12 pb-3"
                                         style={{borderBottom: '1px solid #ccc'}}>
                                        <label className="col-12 create-doc-p mb-3">Tarih</label>
                                        <input className="col-12 create-doc-inp" type="date" field-short-name="date1"/>
                                    </div>
                                    <div className="row mb-3 justify-content-center col-12 pb-3"
                                         style={{borderBottom: '1px solid #ccc'}}>
                                        <label className="col-12 create-doc-p mb-3">Talep Eden Kişi</label>
                                        <select className="col-12 mt-3" field-short-name="select1">
                                            <option value="">Seçim Yapın</option>

                                            {userNames.map((name, index) => (
                                                <option key={index} value={name}>{name}</option>))}
                                        </select>
                                    </div>
                                    <div className="row mb-3 justify-content-center col-12">
                                        <label className="col-12 create-doc-p mb-3">Talep No</label>
                                        <input className="col-12 create-doc-inp"  field-short-name="field1" type="number"/>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="col-4">
                            <div className="card" style={{position: 'sticky', top: '100px'}}>
                                <div className="card-header create-doc-card-header">
                                    Talep Bilgileri
                                </div>
                                <div className="card-body justify-content-center row">
                                    <div className="row mb-3 justify-content-center col-12 pb-3"
                                         style={{borderBottom: '1px solid #ccc'}}>
                                        <label className="col-12 create-doc-p mb-3">Kontrol Eden Kişi</label>
                                        <select className="col-12 mt-3" field-short-name="select2">
                                            <option value="">Seçim Yapın</option>

                                            {userNames.map((name, index) => (
                                                <option key={index} value={name}>{name}</option>))}
                                        </select>
                                    </div>
                                    <div className="row mb-3 justify-content-center col-12">
                                        <label className="col-12 create-doc-p mb-3">Onaylayan Kişi</label>
                                        <select className="col-12 mt-3" field-short-name="select3">

                                            <option value="">Seçim Yapın</option>
                                            {userNames.map((name, index) => (
                                                <option key={index} value={name}>{name}</option>))}
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="col-4">
                            <div className="card" style={{position: 'sticky', top: '100px'}}>
                                <div className="card-header create-doc-card-header">
                                    Talep Bilgileri
                                </div>
                                <div className="card-body justify-content-center row">

                                    <div className="row mb-3 justify-content-center col-12 pb-3"
                                         style={{borderBottom: '1px solid #ccc'}}>
                                        <label className="col-12 create-doc-p mb-3">Revizyon Gerekçesi</label>
                                        <input className="col-12 create-doc-inp"  field-short-name="field2" type="text"/>
                                    </div>
                                    <div className="row mb-3 justify-content-center col-12 ">
                                        <label className="col-12 create-doc-p mb-3">Önerilen Revizyon</label>
                                        <input className="col-12 create-doc-inp"  field-short-name="field3" type="text"/>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-12 mt-5">
                            <div className="card" style={{position: 'sticky', top: '100px'}}>
                                <div className="card-header create-doc-card-header">
                                    Talep Bilgileri
                                </div>
                                <div className="card-body justify-content-center row">

                                    <div className="row mb-3 justify-content-center col-12 pb-3"
                                         style={{borderBottom: '1px solid #ccc'}}>
                                        <label className="col-12 create-doc-p mb-3">Tarih</label>
                                        <input className="col-12 create-doc-inp"  field-short-name="date2" type="date"/>
                                    </div>
                                    <div className="row mb-3 justify-content-center col-12 pb-3"
                                         style={{borderBottom: '1px solid #ccc'}}>
                                        <label className="col-12 create-doc-p mb-3">Sonuç</label>
                                        <select className="col-12 create-doc-inp"  field-short-name="select4">
                                            <option value="Onaylandı">Onaylandı</option>
                                            <option value="reddedildi">Reddedildi</option>
                                            <option value="Diğer">Diğer</option>
                                        </select>
                                    </div>
                                    <div className="row mb-3 justify-content-center col-12 pb-3"
                                         style={{borderBottom: '1px solid #ccc'}}>
                                        <label className="col-12 create-doc-p mb-3">Açıklama</label>
                                        <input className="col-12 create-doc-inp"  field-short-name="field4" type="text"/>
                                    </div>

                                    <div className="row mb-3 justify-content-center col-12 pb-3"
                                         style={{borderBottom: '1px solid #ccc'}}>
                                        <label className="col-12 create-doc-p mb-3">Kontrol Eden Kişi</label>
                                        <select className="col-12 create-doc-inp mt-3" field-short-name="select5">
                                            <option value="">Seçim Yapın</option>

                                            {userNames.map((name, index) => (
                                                <option key={index} value={name}>{name}</option>))}
                                        </select>
                                    </div>
                                    <div className="row mb-3 justify-content-center col-12 ">
                                        <label className="col-12 create-doc-p mb-3">Onaylayan Kişi</label>
                                        <select className="col-12 create-doc-inp mt-3" field-short-name="select6">
                                            <option value="">Seçim Yapın</option>

                                            {userNames.map((name, index) => (
                                                <option key={index} value={name}>{name}</option>))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                </div>
            </div>
        </div>
    );
};

export default RevisionPage;
