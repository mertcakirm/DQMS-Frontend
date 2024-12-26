import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import SwotComp from "../components/process/Swot.jsx";
import PestleComp from "../components/process/Pestle.jsx";
import NeedsAndExpectations from "../components/process/NeedsAndExpectations.jsx";
import TargetPerformance from "../components/process/TargetPerformance.jsx";
import ProcedurProcess from "../components/process/ProcedurProcess.jsx";
import Debit from "../components/OccupationalHealthAndSafety/Debit.jsx";
import OccupationalProsedur from "../components/OccupationalHealthAndSafety/OccupationalProsedur.jsx";

const OccupationalHealthAndSafety = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/is-sagligi-ve-guvenligi/zimmet", component: <Debit /> },
        { id: 2, path: "/is-sagligi-ve-guvenligi/prosedur", component: <OccupationalProsedur /> },
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

export default OccupationalHealthAndSafety;