import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import IsgRisk from "../components/risks/isgRisk.jsx";
import PeriodRisk from "../components/risks/periodRisk.jsx";
import Sidebar from "../components/other/Navbar.jsx";
import RisksProcedur from "../components/risks/RisksProcedur.jsx";



const RiskAnalize = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/risk/isg", component: <IsgRisk /> },
        { id: 2, path: "/risk/surec", component: <PeriodRisk /> },
        { id: 3, path: "/risk/prosedur", component: <RisksProcedur /> },

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
