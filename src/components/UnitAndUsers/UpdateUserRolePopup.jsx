import {changeUser} from "../../API/User.js";
import {useEffect, useState} from "react";
import {getAllRoles} from "../../API/Role.js";
import {changeRoleReq} from "../../API/Admin.js";

const UpdateUserRolePopup = ({onClose, selectedUserId}) => {
    const [roles, setRoles] = useState([]);
    const [newRoleId, setNewRoleId] = useState("");

    useEffect(() => {
        if (selectedUserId) {
            setNewRoleId(selectedUserId.roleId || "");
        }
    }, [selectedUserId]);

    const getRoles = async () => {
        const data = await getAllRoles();
        setRoles(data);
    };

    useEffect(() => {
        getRoles();
    }, []);

    const handleSubmit = async () => {
        try {
            await changeRoleReq(selectedUserId,newRoleId);
            onClose(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content2 pb-3" data-aos="zoom-in">
                <button className="popup-close-btn" onClick={() => onClose(false)}>&times;</button>
                <div className="row justify-content-center align-items-center row-gap-3">
                    <div className="titles text-center card-header create-doc-card-header py-3">
                        Kullanıcı Rolünü Güncelle
                    </div>

                    <div className="d-flex col-12 gap-3 flex-column w-100 align-items-center">
                        <select
                            className="form-select w-50"
                            value={newRoleId}
                            onChange={(e) => setNewRoleId(e.target.value)}
                        >
                            <option value="" disabled>Rol seçiniz</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>

                        <button className="print-btn" onClick={handleSubmit}>
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateUserRolePopup;