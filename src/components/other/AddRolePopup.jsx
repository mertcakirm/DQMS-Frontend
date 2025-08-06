import React, {useState} from 'react';
import {ActionPerm, getPermTitle} from "../../API/permissions.js";
import {createRole} from "../../API/Role.js";
import '../css/process.css';

const AddRolePopup = ({onClose}) => {
    const [newRole, setNewRole] = useState({
        name: "",
        perms: 0,
    });
    const addRole = async () => {
        if (newRole.perms === 0) return;
        await createRole(newRole.name, newRole.perms);
        setNewRole({ name: "", perms: 0 });
    };

    const handleRoleCreatePermChange = (perm, isAdd) => {
        if (isAdd) setNewRole({ ...newRole, perms: newRole.perms | perm });
        else setNewRole({ ...newRole, perms: newRole.perms ^ perm });
    };
    return (

        <div className="popup-overlay">
            <div className="popup-content2" data-aos="zoom-in">
                <button className="popup-close-btn" onClick={() => onClose(false)}>&times;</button>
                <div className="row justify-content-center align-items-center row-gap-3">
                    <div className="titles text-center card-header create-doc-card-header py-3">Rol Ekle</div>
                    <div
                        className="col-6 col-sm-4 py-5"
                        style={{
                            rowGap: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Yeni Rol Adı"
                            className="col-12 create-doc-inp"
                            value={newRole.name}
                            onChange={(e) =>
                                setNewRole({ ...newRole, name: e.target.value })
                            }
                        />
                        <button
                            className="print-btn2"
                            style={{ height: "50px" }}
                            onClick={addRole}
                        >
                            Kaydet
                        </button>
                    </div>
                    <div
                        className="row col-6 col-sm-8 align-items-center py-3"
                        style={{ rowGap: "10px",height: "250px" ,overflowY:"scroll" }}
                    >
                        {Object.entries(ActionPerm)
                            .slice(1)
                            .map(([key, value]) => (
                                <div key={value}>
                                    <input
                                        onChange={(e) =>
                                            handleRoleCreatePermChange(
                                                value,
                                                e.target.checked,
                                            )
                                        }
                                        style={{ marginRight: "5px" }}
                                        type="checkbox"
                                    />
                                    <label>{getPermTitle(value)}</label>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRolePopup;