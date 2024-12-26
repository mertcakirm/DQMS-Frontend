import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import WasteTracking from "../components/environment/WasteTracking.jsx";
import Directive1 from "../components/environment/Directive1.jsx";
import Directive2 from "../components/environment/Directive2.jsx";

import Sidebar from "../components/sidebar.jsx";
import ProcedurEnvi from "../components/environment/ProcedurEnvi.jsx";



const Environment = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/cevre/yonerge1", component: <Directive1 /> },
        { id: 2, path: "/cevre/yonerge2", component: <Directive2 /> },
        { id: 3, path: "/cevre/atik-takip", component: <WasteTracking /> },
        { id: 4, path: "/cevre/prosedur", component: <ProcedurEnvi /> },
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
            <div className="content-container">
                <div className="step-content">{renderCurrentStepComponent()}</div>
            </div>
        </div>
    );
};

export default Environment;
