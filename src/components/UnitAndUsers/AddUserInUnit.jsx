import React, { useEffect, useState } from 'react';
import { getUsers } from "../../API/User.js";
import {AddUserInUnitReq} from "../../API/Unit.js";
import {toast} from "react-toastify";

const AddUserInUnit = ({ onClose,unitId }) => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");

    const GetUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Kullanıcılar alınamadı:", err);
        }
    };

    const HandleSubmit = async () => {
        if (selectedUserId) {
            try {
                await AddUserInUnitReq(selectedUserId,unitId)
                toast.success("Kullanıcı birime başarıyla eklendi!")
            }catch (er){
                console.log(er);
                toast.error("Kullanıcı birime eklenirken bir hata oluştu!")
            }
            onClose(false);
        } else {
            toast.warning("Lütfen bir kullanıcı seçin!")
            onClose(false);
        }
    };

    useEffect(() => {
        GetUsers();
    }, []);

    return (
        <div className="popup-overlay">
            <div className="popup-content2 pb-3" data-aos="zoom-in">
                <button className="popup-close-btn" onClick={() => onClose(false)}>&times;</button>
                <div className="row justify-content-center align-items-center row-gap-3">
                    <div className="titles text-center card-header create-doc-card-header py-3">Birime Kullanıcı Ekle</div>
                    <div className="d-flex col-12 gap-3 flex-column w-100 align-items-center">

                        <select
                            className="form-select w-75"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option value="">Kullanıcı seçin</option>
                            {users.map((user) => (
                                <option key={user.uid} value={user.uid}>
                                    {user.fullName || user.username || user.email}
                                </option>
                            ))}
                        </select>

                        <button onClick={HandleSubmit} className="print-btn">Kaydet</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUserInUnit;