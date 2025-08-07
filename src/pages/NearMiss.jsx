import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/other/Navbar.jsx";
import AccidentIncidentTracking from "../components/nearmiss/AccidentIncidentTracking.jsx";
import AccidentIncidentTrackingForm from "../components/nearmiss/AccidentIncidentTrackingForm.jsx";
import IncidentReportingForm from "../components/nearmiss/IncidentReportingForm.jsx";
import WatchList from "../components/nearmiss/WatchList.jsx";
import ProcedurNearmiss from "../components/nearmiss/ProcedurNearmiss.jsx";

const RiskAnalize = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();
    const steps = [
        { id: 1, path: "/ramak-kala/takip-listesi", component: <WatchList /> },
        { id: 2, path: "/ramak-kala/olay-bildirim-formu", component: <IncidentReportingForm /> },
        { id: 3, path: "/ramak-kala/kaza-olay-takip", component: <AccidentIncidentTracking /> },
        { id: 4, path: "/ramak-kala/kaza-olay-takip-formu", component: <AccidentIncidentTrackingForm /> },
        { id: 5, path: "/ramak-kala/prosedur", component: <ProcedurNearmiss /> },
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
