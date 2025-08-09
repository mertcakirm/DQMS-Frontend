import React from "react";
import { optionsList } from "../../Helpers/unitsHelper.js";

const DocumentInfoCard = ({
                              title,
                              setTitle,
                              manuelId,
                              setManuelId,
                              unit,
                              setUnit,
                              filteredValue
                          }) => {
    return (
        <div className="card w-100" style={{ position: "sticky", top: "100px" }}>
            <div className="card-header create-doc-card-header">
                Doküman Bilgileri
            </div>
            <div className="card-body justify-content-center row">
                {/* Doküman Başlığı */}
                <div className="row mb-3 justify-content-center col-12 pb-3" style={{ borderBottom: "1px solid #ccc" }}>
                    <label className="col-12 create-doc-p mb-3">Doküman Başlığı</label>
                    <input
                        className="col-12 create-doc-inp"
                        name="doctitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                    />
                </div>

                {/* Doküman No */}
                <div className="row mb-3 justify-content-center col-12 pb-3" style={{ borderBottom: "1px solid #ccc" }}>
                    <label className="col-12 create-doc-p mb-3">Döküman No</label>
                    <input
                        className="col-12 create-doc-inp"
                        value={manuelId}
                        onChange={(e) => setManuelId(e.target.value)}
                        type="text"
                    />
                </div>

                {/* İlk Yayın Tarihi */}
                <div className="row mb-3 justify-content-center col-12 pb-3" style={{ borderBottom: "1px solid #ccc" }}>
                    <label className="col-12 create-doc-p mb-3">İlk Yayın Tarihi</label>
                    <input
                        className="col-12 create-doc-inp"
                        type="date"
                        field-short-name="p1"
                    />
                </div>

                {/* Yürürlük Tarihi */}
                <div className="row mb-3 justify-content-center col-12 pb-3" style={{ borderBottom: "1px solid #ccc" }}>
                    <label className="col-12 create-doc-p mb-3">Yürürlük Tarihi</label>
                    <input
                        className="col-12 create-doc-inp"
                        type="date"
                        field-short-name="p2"
                    />
                </div>

                {/* Sayfa No */}
                <div className="row mb-3 justify-content-center col-12 pb-3" style={{ borderBottom: "1px solid #ccc" }}>
                    <label className="col-12 create-doc-p mb-3">Sayfa No</label>
                    <input
                        className="col-12 create-doc-inp"
                        type="number"
                        field-short-name="p3"
                    />
                </div>

                {/* Sorumlu Birim */}
                <div className="row mb-3 justify-content-center col-12 pb-3">
                    <label className="col-12 create-doc-p mb-3">Sorumlu Birim</label>
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
    );
};

export default DocumentInfoCard;