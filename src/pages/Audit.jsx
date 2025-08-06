import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuditReport from '../components/auditplans/AuditReport.jsx';
import AuditTable from '../components/auditplans/AuditTable.jsx';
import ProcedurAudit from "../components/auditplans/procedurAudit.jsx";
import Sidebar from "../components/other/sidebar.jsx";

const steps = [
    { id: 1, path: "/ic-denetim/cizelge", component: <AuditTable /> },
    { id: 2, path: "/ic-denetim/rapor", component: <AuditReport /> },
    { id: 3, path: "/ic-denetim/prosedur", component: <ProcedurAudit /> },

];

const AuditParent = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    useEffect(() => {
        const matchedStep = steps.find((step) => step.path === location.pathname);
        setCurrentStep(matchedStep ? matchedStep.id : 1);
    }, [location.pathname]);

    const renderCurrentStepComponent = () => {
        const matchedStep = steps.find((step) => step.id === currentStep);
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

export default AuditParent;
