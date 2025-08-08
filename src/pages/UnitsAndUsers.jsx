import React, {useContext, useEffect, useState} from 'react';
import {matchPath, useLocation} from "react-router-dom";
import Sidebar from "../components/other/Navbar.jsx";
import ManageUnits from "../components/UnitAndUsers/ManageUnits.jsx";
import AnalizeUnit from "../components/UnitAndUsers/AnalizeUnit.jsx";
import ManageUsers from "../components/UnitAndUsers/ManageUsers.jsx";
import AnalizeUsers from "../components/UnitAndUsers/AnalizeUsers.jsx";
import UsersinUnit from "../components/UnitAndUsers/UsersinUnit.jsx";
import {ActionPerm, checkPermFromRole} from "../API/permissions.js";
import UnauthPage from "../components/other/UnauthPage.jsx";
import {UserContext} from "../App.jsx";

const UnitsAndUsers = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/birim/yonet", component: <ManageUnits /> },
        { id: 2, path: "/birim/yonet/:id", component: <UsersinUnit /> },
        { id: 3, path: "/birim/analiz", component: <AnalizeUnit /> },
        { id: 4, path: "/kullanici/yonet", component: <ManageUsers /> },
        { id: 5, path: "/kullanici/analiz", component: <AnalizeUsers /> },
    ];

    useEffect(() => {
        const matchedStep = steps.find((step) => matchPath({ path: step.path, end: true }, location.pathname));
        setCurrentStep(matchedStep ? matchedStep.id : 1);
    }, [location.pathname]);

    const renderCurrentStepComponent = () => {
        const matchedStep = steps.find((step) => matchPath({ path: step.path, end: true }, location.pathname));
        return matchedStep ? matchedStep.component : <div>Sayfa bulunamadı!</div>;
    };

    return (
        <div className="document-parent">
            <Sidebar />
            <div className="content-container" data-aos="fade-up">
                <div className="step-content">{renderCurrentStepComponent()}</div>
            </div>
        </div>
    );
};

export default UnitsAndUsers;