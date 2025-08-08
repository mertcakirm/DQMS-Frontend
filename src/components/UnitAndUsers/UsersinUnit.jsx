import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './css/unit.css';
import {getUsers, getUsersByUnitId, getUsersinUnit, getUsersPfp} from "../../API/User.js";
import {getRole} from "../../API/Role.js";
import {getUnitById} from "../../API/Unit.js";
import ProcessPopup from "../other/ProcessPopUp.jsx";
import AddUserInUnit from "./AddUserInUnit.jsx";

const UsersinUnit = () => {
    const location = useLocation();
    const [unitId, setUnitId] = useState(null);
    const [users, setUsers] = useState([]);
    const [unitName, setUnitName] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [refresh, setRefresh] = useState(false);
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

    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const lastSegment = pathParts[pathParts.length - 1];
        setUnitId(lastSegment);
    }, [location.pathname]);

    const fetchUsers = async () => {
        try {
            const userIds = await getUsersByUnitId(unitId);

            if (Array.isArray(userIds) && userIds.length > 0) {
                const userDetails = await getUsersinUnit(userIds);

                const usersWithDetails = await Promise.all(
                    userDetails.map(async (user) => {
                        const userWithDetails = { ...user };

                        try {
                            const pfpBase64 = await getUsersPfp(user.uid);
                            userWithDetails.pfp = pfpBase64;
                        } catch (err) {
                            console.error(`Profil resmi alınamadı (UID: ${user.uid}):`, err);
                            userWithDetails.pfp = null;
                        }

                        try {
                            const roleData = await getRole(user.roleId);
                            userWithDetails.roleName = roleData?.name || "Bilinmeyen Rol";
                        } catch (err) {
                            console.error(`Rol bilgisi alınamadı (UID: ${user.uid}):`, err);
                            userWithDetails.roleName = "Bilinmeyen Rol";
                        }

                        return userWithDetails;
                    })
                );

                setUsers(usersWithDetails);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Kullanıcılar alınamadı:", error);
        }
    };

    const GetUnitName=async () => {
        const response = await getUnitById(unitId);
        console.log(response)
        setUnitName(response[0].name)
    }

    useEffect(() => {
        if (unitId) {
            fetchUsers();
            GetUnitName();
        }
    }, [unitId,refresh]);

    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-between">
                <h3 className="mb-4">{unitName}</h3>
                <button onClick={()=>setPopUp(true)} className="print-btn2">Kullanıcı Ekle</button>
            </div>
            <div className="d-flex flex-wrap gap-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.uid} className="user-card shadow d-flex align-items-center p-3">
                            {user.pfp ? (
                                <img
                                    src={`data:image/png;base64,${user.pfp.data}`}
                                    alt="Profil"
                                    className="rounded-circle me-3"
                                    width="64"
                                    height="64"
                                />
                            ) : (
                                <div className="rounded-circle bg-secondary me-3" style={{ width: 64, height: 64 }} />
                            )}
                            <div className="user-card-body">
                                <h5>{user.username}</h5>
                                <p>{user.email}</p>
                                <p className="text-muted">{user.roleName}</p>
                            </div>
                            <button
                                className="delete-unit-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleProcessPopup("delete_unit_user", user.uid, "Kullanıcı birimden silinsin mi?");
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Bu birimde kullanıcı yok.</p>
                )}
            </div>
            {popUp && (
                <AddUserInUnit
                    onClose={(b) => {
                        if (b === false) {
                            setPopUp(b);
                            setRefresh(!refresh);
                        }
                    }}
                    unitId={unitId}
                />
            )}

            {isProcessPopupOpen && (
                <ProcessPopup
                    onClose={(b) => {
                        if (b === false) {
                            setProcessIsPopupOpen(b);
                            setRefresh(!refresh);
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

export default UsersinUnit;