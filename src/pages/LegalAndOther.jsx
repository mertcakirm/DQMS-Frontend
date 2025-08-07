import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Sidebar from "../components/other/Navbar.jsx";
import Suitability from "../components/LegalAndOther/suitability.jsx";
import LegalList from "../components/LegalAndOther/LegalList.jsx";
import LegalProcedur from "../components/LegalAndOther/LegalProcedur.jsx";

const LegalAndOther = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/yasal/izinler-ve-diger-sartlar", component: <LegalList /> },
        { id: 2, path: "/yasal/uygunluk", component: <Suitability /> },
        { id: 3, path: "/yasal/prosedur", component: <LegalProcedur /> },

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

export default LegalAndOther;
