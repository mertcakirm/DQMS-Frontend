import React, {useEffect, useState} from 'react';
import {getUsers, getUsersPfp} from "../../API/User.js";
import {getRole} from "../../API/Role.js";
import UpdateUserRolePopup from "./UpdateUserRolePopup.jsx";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [unitName, setUnitName] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const userDetails = await getUsers();

            const usersWithDetails = await Promise.all(
                userDetails.map(async (user) => {
                    const userWithDetails = {...user};

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
        } catch (error) {
            console.error("Kullanıcılar alınamadı:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refresh]);

    return (
        <div className="container-fluid p-5">
            <h3 className="mb-4 w-100 text-center">Kullanıcılar</h3>
            <div className="d-flex flex-wrap gap-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.uid} className="user-card shadow d-flex align-items-center p-3">
                            {user.pfp ? (
                                <img
                                    src={`data:image/png;base64,${user.pfp.data}`}
                                    alt="Profil"
                                    className="rounded-circle me-3 object-fit-cover"
                                    width="64"
                                    height="64"
                                />
                            ) : (
                                <div className="rounded-circle bg-secondary me-3" style={{width: 64, height: 64}}/>
                            )}
                            <div className="user-card-body">
                                <h5>{user.username}</h5>
                                <p>{user.email}</p>
                                <p className="text-muted">{user.roleName}</p>
                            </div>
                            <button
                                className="delete-unit-btn bg-success"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(user.uid)
                                    setPopUp(true);

                                }}
                            >
                                <svg fill="white" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round"
                                     strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m21.897 13.404.008-.057v.002c.024-.178.044-.357.058-.537.024-.302-.189-.811-.749-.811-.391 0-.715.3-.747.69-.018.221-.044.44-.078.656-.645 4.051-4.158 7.153-8.391 7.153-3.037 0-5.704-1.597-7.206-3.995l1.991-.005c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-4.033c-.414 0-.75.336-.75.75v4.049c0 .414.336.75.75.75s.75-.335.75-.75l.003-2.525c1.765 2.836 4.911 4.726 8.495 4.726 5.042 0 9.217-3.741 9.899-8.596zm-19.774-2.974-.009.056v-.002c-.035.233-.063.469-.082.708-.024.302.189.811.749.811.391 0 .715-.3.747-.69.022-.28.058-.556.107-.827.716-3.968 4.189-6.982 8.362-6.982 3.037 0 5.704 1.597 7.206 3.995l-1.991.005c-.414 0-.75.336-.75.75s.336.75.75.75h4.033c.414 0 .75-.336.75-.75v-4.049c0-.414-.336-.75-.75-.75s-.75.335-.75.75l-.003 2.525c-1.765-2.836-4.911-4.726-8.495-4.726-4.984 0-9.12 3.654-9.874 8.426z"
                                        fillRule="nonzero"/>
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Hiç kullanıcı yok.</p>
                )}
            </div>
            {popUp && (
                <UpdateUserRolePopup
                    onClose={(b) => {
                        if (b === false) {
                            setPopUp(false);
                            setRefresh(!refresh);
                        }
                    }}
                    selectedUserId={selectedUser}
                />
            )}

        </div>
    );
};

export default ManageUsers;