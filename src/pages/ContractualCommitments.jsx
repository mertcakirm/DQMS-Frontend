import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import Procedurcontract from "../components/contractualCommitments/Procedurcontract.jsx";
import PersonalDataSecurityCommitment from "../components/contractualCommitments/PersonalDataSecurityCommitment.jsx";
import TrackingChart from "../components/contractualCommitments/TrackingChart.jsx";
import PrivacyCommitment from "../components/contractualCommitments/PrivacyCommitment.jsx";

const ContractualCommitments = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/sozlesme/gizlilik", component: <PrivacyCommitment /> },
        { id: 2, path: "/sozlesme/kisisel-veriler", component: <PersonalDataSecurityCommitment /> },
        { id: 3, path: "/sozlesme/takip-cizelge", component: <TrackingChart /> },
        { id: 4, path: "/sozlesme/prosedur", component: <Procedurcontract /> },
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

export default ContractualCommitments;