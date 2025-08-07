import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/other/Navbar.jsx";
import SwotComp from "../components/process/Swot.jsx";
import PestleComp from "../components/process/Pestle.jsx";
import NeedsAndExpectations from "../components/process/NeedsAndExpectations.jsx";
import TargetPerformance from "../components/process/TargetPerformance.jsx";
import ProcedurProcess from "../components/process/ProcedurProcess.jsx";

const ProcessParent = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/process/swot", component: <SwotComp /> },
        { id: 2, path: "/process/pestle", component: <PestleComp /> },
        { id: 3, path: "/process/ihtiyac-ve-beklentiler", component: <NeedsAndExpectations /> },
        { id: 4, path: "/process/hedef-performans", component: <TargetPerformance /> },
        { id: 5, path: "/process/prosedur", component: <ProcedurProcess /> },
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
            <div className="content-container" data-aos="fade-up">
                <div className="step-content">{renderCurrentStepComponent()}</div>
            </div>
        </div>
    );
};

export default ProcessParent;