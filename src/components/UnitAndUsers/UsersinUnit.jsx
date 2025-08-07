import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './css/unit.css';
import { getUsersByUnitId, getUsersinUnit } from "../../API/User.js";

const UsersinUnit = () => {
    const location = useLocation();
    const [unitId, setUnitId] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const lastSegment = pathParts[pathParts.length - 1];
        setUnitId(lastSegment);
    }, [location.pathname]);

    const fetchUsers = async () => {
        try {
            const userIds = await getUsersByUnitId(unitId);
            if (Array.isArray(userIds) && userIds.length > 0) {
                console.log(userIds);
                const userDetails = await getUsersinUnit(userIds);
                console.log(userDetails);
                setUsers(userDetails || []);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Kullanıcılar alınamadı:", error);
        }
    };

    useEffect(() => {
         fetchUsers();
    }, [unitId]);

    return (
        <div className="container-fluid p-5">
            <h3 className="mb-4">Birim ID: {unitId} - Kullanıcılar</h3>
            <div className="d-flex flex-wrap gap-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.uid} className="user-card shadow">
                            <div className="user-card-body">
                                <h5>{user.username}</h5>
                                <p>{user.email}</p>
                                <p className="text-muted">{user.role}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Bu birimde kullanıcı yok.</p>
                )}
            </div>
        </div>
    );
};

export default UsersinUnit;