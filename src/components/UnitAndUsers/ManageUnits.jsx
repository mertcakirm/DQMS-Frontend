import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../../App.jsx";
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import ProcessPopup from "../other/ProcessPopUp.jsx";
import {getAllUnits} from "../../API/Unit.js";

const ManageUnits = () => {
    const user = useContext(UserContext);
    const [units, setUnits] = React.useState([]);
    const [reflesh, setReflesh] = useState(false);
    const [permissionCheck, setPermissionCheck] = useState(false);
    const [isProcessPopupOpen, setProcessIsPopupOpen] = useState(false);
    const [processState, setProcessState] = useState({
        processtype: null,
        text: "",
        id: null,
    });

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
            const result= await getAllUnits();
            console.log(result);
            setUnits(result || []);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);


    useEffect(() => {
        if (checkPermFromRole(user.roleValue, ActionPerm.DocumentModify)) {
            setPermissionCheck(true);
        } else {
            setPermissionCheck(false);
        }
    });

    return (
        <div className="container-fluid p-5">
            <div className="row justify-content-between">
                <h3 className="col-6 large-title">Birim Yönetim Paneli</h3>
                <div className="col-6 row justify-content-end">
                    <button className="col-2 print-btn">
                        Birim Oluştur
                    </button>
                </div>
            </div>

            <table className="table table-bordered table-striped mt-5">
                <thead>
                <tr>
                    <th className="purple-text">Döküman No</th>
                    <th className="purple-text">Döküman Adı</th>
                    <th className="purple-text">Döküman Türü</th>
                    <th className="purple-text">İlk Yayın Tarihi</th>
                    <th className="purple-text">Revizyon No</th>
                    <th className="purple-text">Sorumlu Birim</th>
                    <th className="text-center purple-text">İşlem</th>
                </tr>
                </thead>
                <tbody>
                {units.length > 0 ? (
                    units.map((unit) => (
                        <tr key={unit.id}>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center">
                            Birim bulunamadı
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

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
        </div>
    );
};

export default ManageUnits;