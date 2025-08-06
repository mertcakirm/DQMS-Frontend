import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Sidebar from "../components/other/sidebar.jsx";
import CorrectiveActionForm from "../components/correctiveaction/CorrectiveActionForm.jsx";
import CorrectiveActionTable from "../components/correctiveaction/CorrectiveActionTable.jsx";
import ProcedurCorrective from "../components/correctiveaction/ProcedurCorrective.jsx";


const CorrectiveAction  = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/duzeltici-faaliyet/form", component: <CorrectiveActionForm /> },
        { id: 2, path: "/duzeltici-faaliyet/cizelge", component: <CorrectiveActionTable /> },
        { id: 3, path: "/duzeltici-faaliyet/prosedur", component: <ProcedurCorrective /> },

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
        <div className="document-parent" data-aos="fade-up">
            <Sidebar />
            <div className="content-container">
                <div className="step-content">{renderCurrentStepComponent()}</div>
            </div>
        </div>
    );
};

export default CorrectiveAction ;
