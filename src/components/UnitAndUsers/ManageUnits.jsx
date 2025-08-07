import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../../App.jsx";
import { ActionPerm, checkPermFromRole } from "../../API/permissions.js";
import ProcessPopup from "../other/ProcessPopUp.jsx";
import { getAllUnits } from "../../API/Unit.js";
import { useNavigate } from 'react-router-dom';
import './css/unit.css';
import AddUnitPopup from "./AddUnitPopup.jsx";

const ManageUnits = () => {
    const user = useContext(UserContext);
    const [units, setUnits] = useState([]);
    const [reflesh, setReflesh] = useState(false);
    const [permissionCheck, setPermissionCheck] = useState(false);
    const [AddUnitPopupOpen, setAddUnitPopupOpen] = useState(false);
    const [isProcessPopupOpen, setProcessIsPopupOpen] = useState(false);
    const [processState, setProcessState] = useState({
        processtype: null,
        text: "",
        id: null,
    });

    const navigate = useNavigate();

    const toggleProcessPopup = (type, id, text) => {
        setProcessIsPopupOpen(!isProcessPopupOpen);
        setProcessState(prevState => ({
            ...prevState,
            processtype: type,
            text: text,
            id: id
        }));
    };

    const fetchUnits = async () => {
        try {
            const result = await getAllUnits();
            setUnits(result || []);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, [reflesh]);

    useEffect(() => {
        setPermissionCheck(checkPermFromRole(user.roleValue, ActionPerm.DocumentModify));
    }, [user]);

    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between">
                <h3 className="col-6 large-title">Birim Yönetim Paneli</h3>
                <div className="col-6 row justify-content-end">
                    <button onClick={()=>setAddUnitPopupOpen(true)} className="print-btn2 px-5" style={{ width: 'fit-content' }}>
                        Birim Oluştur
                    </button>
                </div>
            </div>

            <div className="unit-card-container">
                {units.length > 0 ? (
                    units.map((unit) => (
                        <div key={unit.id} className="unit-card position-relative">
                            <a
                                className="unit-card-body default-a"
                                href={`/birim/yonet/${unit.id}`}
                            >
                                <span className="unit-name">{unit.name}</span>
                            </a>
                            {permissionCheck && (
                                <button
                                    className="delete-unit-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleProcessPopup("delete_unit", unit.id, "Birim silinsin mi?");
                                    }}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <h3 className="text-center w-100">Birim yok</h3>
                )}
            </div>

            {isProcessPopupOpen && (
                <ProcessPopup
                    onClose={(b) => {
                        if (b === false) {
                            setProcessIsPopupOpen(b);
                            setReflesh(!reflesh);
                        }
                    }}
                    text={processState.text}
                    type={processState.processtype}
                    id={processState.id}
                />
            )}

            {AddUnitPopupOpen && (
                <AddUnitPopup
                    onClose={(b) => {
                        if (b === false) {
                            setAddUnitPopupOpen(b);
                            setReflesh(!reflesh);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default ManageUnits;