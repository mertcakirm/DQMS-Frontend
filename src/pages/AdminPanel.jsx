import {useContext, useEffect, useState} from "react";
import Sidebar from "../components/other/sidebar.jsx";
import {getAllRoles} from "../API/Role.js";
import {getUsers} from "../API/User.js";
import {
    ActionPerm,
    checkPermFromRole,
} from "../API/permissions.js";
import UnauthPnl from "../components/other/unauthPnl.jsx";
import {UserContext} from "../App.jsx";
import {
    deleteManuelMail,
    getManuelMails,
} from "../API/Admin.js";
import {
    formatLocalDate,

    utcToLocal,
} from "../Helpers/dateTimeHelpers.js";
import AddRolePopup from "../components/other/AddRolePopup.jsx";
import AddUserPopup from "../components/other/AddUserPopup.jsx";
import SendMailPopup from "../components/other/SendMailPopup.jsx";
import ProcessPopup from "../components/other/ProcessPopUp.jsx";

const AdminPanel = () => {
    const user = useContext(UserContext);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [manuelMails, setManuelMails] = useState(null);
    const [refleshData, setRefleshData] = useState(false);
    const [addUserPopupOpen, setAddUserPopupOpen] = useState(false);
    const [addRolePopupOpen, setAddRolePopupOpen] = useState(false);
    const [SendMailPopupOpen, setdSendMailPopupOpen] = useState(false);
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

    const RolesAndUsers = async () => {
        const roles = await getAllRoles();
        setRoles(roles);
        const users = await getUsers();
        setUsers(users);
        const mails = await getManuelMails();
        setManuelMails(mails);
    };

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll(
            '[data-bs-toggle="tooltip"]',
        );
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
        RolesAndUsers();

    }, []);

    useEffect(() => {
        RolesAndUsers();
    }, [refleshData]);

    return (
        <div>
            <Sidebar/>
            <div className="content-container p-5">
                <div className="row justify-content-between" data-aos="fade-up">
                    <h3 className="col-6 large-title">ADMİN PANEL</h3>
                </div>
                <div className="row mt-5" data-aos="fade-up" style={{rowGap: "30px"}}>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header create-doc-card-header">
                                Kullanıcı Listesi
                            </div>
                            <div className="card-body justify-content-end py-3 px-4 row">
                                <div className="col-12 row justify-content-end">
                                    <div className="card border-0 col-3">
                                        <button onClick={() => setAddUserPopupOpen(true)}
                                                className="card-header border-0 rounded-2 create-doc-card-header">
                                            Kullanıcı Ekle
                                        </button>
                                    </div>
                                </div>
                                {!checkPermFromRole(user.roleValue, ActionPerm.UserModify) ? (
                                    <UnauthPnl/>
                                ) : (
                                    <>
                                        <table className="table table-bordered table-striped mt-2">
                                            <thead>
                                            <tr>
                                                <th className="purple-text">Kullanıcı Adı</th>
                                                <th className="purple-text">Ad Soyad</th>
                                                <th className="purple-text">Rol</th>
                                                <th className="purple-text">E-Posta Adresi</th>
                                                <th className="purple-text">Kayıt Tarihi</th>
                                                <th className="purple-text">İşlem</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {users.length > 0 ? (
                                                users.map((user) => {
                                                    const role = roles.find(
                                                        (r) => r.id === user.roleId,
                                                    );
                                                    const roleName = role ? role.name : "Bilinmiyor";

                                                    return (
                                                        <tr key={user.uid}>
                                                            <td>{user.username}</td>
                                                            <td>{user.name + " " + user.surname}</td>
                                                            <td>{roleName}</td>
                                                            <td>{user.email}</td>
                                                            <td>
                                                                {new Date(user.regDate).toLocaleDateString()}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() => toggleProcessPopup("delete_user", user.uid,"Kullanıcı silinsin mi?")}
                                                                    className="edit-btn"
                                                                >
                                                                    Sil
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center">
                                                        Kullanıcı bulunamadı
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card">
                            <div className="card-header create-doc-card-header">
                                Rol Listesi
                            </div>
                            <div className="card-body justify-content-end py-3 px-4 row">
                                <div className="col-12 row justify-content-end">
                                    <div className="card border-0 col-3">
                                        <button onClick={() => setAddRolePopupOpen(true)}
                                                className="card-header border-0 rounded-2 create-doc-card-header">Rol
                                            Ekle
                                        </button>
                                    </div>
                                </div>
                                {!checkPermFromRole(user.roleValue, ActionPerm.UserCreate) ? (
                                    <UnauthPnl/>
                                ) : (
                                    <>
                                        <table className="table table-bordered table-striped mt-2">
                                            <thead>
                                            <tr>
                                                <th className="purple-text">Rol Adı</th>
                                                <th className="purple-text">Rol Yetkileri</th>
                                                <th className="purple-text">İşlem</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {roles.length > 0 ? (
                                                roles.map((role) => (
                                                    <tr key={role.id}>
                                                        <td>{role.name}</td>
                                                        <td>{role.name}</td>
                                                        <td>
                                                            <button
                                                                onClick={() => toggleProcessPopup("delete_role", role.id,"Rol silinsin mi?")}

                                                                className="edit-btn"
                                                            >
                                                                Sil
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center">
                                                        Rol bulunamadı
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="col-12">
                        <div className="card">
                            <div className="card-header create-doc-card-header">
                                Manuel Mail Listesi
                            </div>
                            <div className="card-body justify-content-end py-3 px-4 row">
                                <div className="col-12 row justify-content-end">
                                    <div className="card border-0 col-3">
                                        <button onClick={() => setdSendMailPopupOpen(true)}
                                                className="card-header border-0 rounded-2 create-doc-card-header">Manuel
                                            Mail Gönder
                                        </button>
                                    </div>
                                </div>
                                {!checkPermFromRole(user.roleValue, ActionPerm.SendMail) ? (
                                    <UnauthPnl/>
                                ) : (
                                    <>
                                        <table className="table table-bordered table-striped mt-5">
                                            <thead>
                                            <tr>
                                                <th className="purple-text">Alıcı</th>
                                                <th className="purple-text">Başlık</th>
                                                <th className="purple-text">Tarih</th>
                                                <th className="purple-text">İşlem</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {manuelMails && manuelMails.length > 0 ? (
                                                manuelMails.map((mail, index) => (
                                                    <tr key={index}>
                                                        <td>{mail.recipient}</td>
                                                        <td>{mail.title}</td>
                                                        <td>
                                                            {formatLocalDate(
                                                                utcToLocal(new Date(mail.date)),
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => {
                                                                    toggleProcessPopup("delete_mail", mail.id,"Mail silinsin mi?")

                                                                }}
                                                                className="edit-btn"
                                                            >
                                                                Sil
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center">
                                                        Planlanmış mail bulunamadı
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {addRolePopupOpen && (
                <AddRolePopup
                    onClose={(b) => {
                        if (b === false) setAddRolePopupOpen(b);
                        setRefleshData(!refleshData);
                    }}
                />
            )}
            {addUserPopupOpen && (
                <AddUserPopup
                    onClose={(b) => {
                        if (b === false) setAddUserPopupOpen(b);
                        setRefleshData(!refleshData);
                    }}
                />
            )}
            {SendMailPopupOpen && (
                <SendMailPopup
                    onClose={(b) => {
                        if (b === false) setdSendMailPopupOpen(b);
                        setRefleshData(!refleshData);
                    }}
                />
            )}

            {isProcessPopupOpen && (
                <ProcessPopup
                    onClose={(b) => {
                        if (b === false) {
                            setProcessIsPopupOpen(b);
                            setRefleshData(!refleshData);
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

export default AdminPanel;
