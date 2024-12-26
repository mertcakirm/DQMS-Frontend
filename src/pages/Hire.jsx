import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import Contract1 from "../components/hire/Contract1.jsx";
import Contract2 from "../components/hire/Contract2.jsx";
import Contract3 from "../components/hire/Contract3.jsx";
import SettlementReport from "../components/hire/SettlementReport.jsx";
import ProcedureHire from "../components/hire/ProcedureHire.jsx";

const Hire = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/kiralama/sozlesme1", component: <Contract1 /> },
        { id: 2, path: "/kiralama/sozlesme2", component: <Contract2 /> },
        { id: 3, path: "/kiralama/sozlesme3", component: <Contract3 /> },
        { id: 4, path: "/kiralama/yerlesim-tutanagi", component: <SettlementReport /> },
        { id: 5, path: "/kiralama/prosedur", component: <ProcedureHire /> },
    ];

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
            <Sidebar/>
            <div className="content-container">
                <div className="step-content">{renderCurrentStepComponent()}</div>
            </div>
        </div>
    );
};

export default Hire;