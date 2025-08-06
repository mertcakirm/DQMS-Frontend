import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Sidebar from "../components/other/sidebar.jsx";
import MaintenancePlan from "../components/maintenance/MaintenancePlan.jsx";
import MaintenanceProcedur from "../components/maintenance/MaintenanceProcedur.jsx";


const Maintenance = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/bakim/plani", component: <MaintenancePlan /> },
        { id: 2, path: "/bakim/prosedur", component: <MaintenanceProcedur /> },

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

export default Maintenance;
