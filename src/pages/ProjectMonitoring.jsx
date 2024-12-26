import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import MeetingMinutes from "../components/projectmonitoring/MeetingMinutes.jsx";
import ProcedureMonitoring from "../components/projectmonitoring/ProcedureMonitoring.jsx";
import MonitoringReport from "../components/projectmonitoring/MonitoringReport.jsx";
import MonitoringReport2 from "../components/projectmonitoring/MonitoringReport2.jsx";

const ProjectMonitoring = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/proje-izleme/toplanti-tutanagi", component: <MeetingMinutes /> },
        { id: 2, path: "/proje-izleme/izleme-raporu", component: <MonitoringReport /> },
        { id: 3, path: "/proje-izleme/izleme-raporu-2", component: <MonitoringReport2 /> },
        { id: 4, path: "/proje-izleme/prosedur", component: <ProcedureMonitoring /> },
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

export default ProjectMonitoring;