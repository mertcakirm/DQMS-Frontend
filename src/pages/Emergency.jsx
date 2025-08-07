import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EmergencyDrill from "../components/emergency/EmergencyDrill.jsx";
import EmergencyDrillEnvi from "../components/emergency/EmergencyDrillEnvi.jsx";
import EmergencyAction from "../components/emergency/EmergencyAction.jsx";
import Sidebar from "../components/other/Navbar.jsx";
import ProcedurEmergency from "../components/emergency/ProcedurEmergency.jsx";



const RiskAnalize = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/acil-durum/eylem", component: <EmergencyAction /> },
        { id: 2, path: "/acil-durum/tatbikat", component: <EmergencyDrill /> },
        { id: 3, path: "/acil-durum/tatbikat-cevre", component: <EmergencyDrillEnvi /> },
        { id: 4, path: "/acil-durum/prosedur", component: <ProcedurEmergency /> },
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
            <Sidebar />
            <div className="content-container" data-aos="fade-up">
                <div className="step-content">{renderCurrentStepComponent()}</div>
            </div>
        </div>
    );
};

export default RiskAnalize;
