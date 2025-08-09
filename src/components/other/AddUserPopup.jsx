import React, {useEffect, useState} from 'react';
import {createNewUser} from "../../API/User.js";
import {getAllRoles} from "../../API/Role.js";
import './css/process.css';

const AddUserPopup = ({onClose}) => {
    const [newUser, setNewUser] = useState({
        name: null,
        surname: null,
        email: null,
        password: null,
        username: null,
        roleId: null,
        emailPref: Array.from({ length: 10 }, (_, i) => 1 + i).reduce(
            (acc, a) => acc | (1 << a),
        ),
    });
    const [roles, setRoles] = useState([]);

    const addUser = async () => {
        await createNewUser(newUser);
        setNewUser("");
        onClose(false);
    };

    const GetRoles = async () => {
        const roles= await getAllRoles();
        setRoles(roles);

    }
    useEffect(() => {
        GetRoles();
    }, []);
    return (
        <div className="popup-overlay">
            <div className="popup-content2 pt-3" data-aos="zoom-in">
                <button className="popup-close-btn" onClick={() => onClose(false)}>&times;</button>
                <div className="row justify-content-center align-items-center row-gap-3">
                    <div className="fs-4 text-center">Kullanıcı Ekle</div>
                    <input
                        type="text"
                        placeholder="Kullanıcı Adı"
                        className="col-5 create-doc-inp"
                        value={newUser.username ?? ""}
                        onChange={(e) =>
                            setNewUser({ ...newUser, username: e.target.value })
                        }
                    />
                    <input
                        type="password"
                        placeholder="Parola"
                        className="col-5 create-doc-inp"
                        value={newUser.password ?? ""}
                        onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Adı"
                        className="col-5 create-doc-inp"
                        value={newUser.name ?? ""}
                        onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Soyadı"
                        className="col-5 create-doc-inp"
                        value={newUser.surname ?? ""}
                        onChange={(e) =>
                            setNewUser({ ...newUser, surname: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="E-Posta Adresi"
                        className="col-5 create-doc-inp"
                        value={newUser.email ?? ""}
                        onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                        }
                    />
                    <select
                        className="create-doc-inp col-5 "
                        onChange={(e) =>
                            setNewUser({ ...newUser, roleId: e.target.value })
                        }
                        value={newUser.roleId}
                    >
                        <option value={null}>Rol Seçilmedi</option>
                        {roles.map((role, index) => (
                            <option key={index} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    <button className="print-btn2 col-12" onClick={addUser}>
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserPopup;