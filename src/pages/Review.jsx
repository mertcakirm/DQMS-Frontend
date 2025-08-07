import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/other/Navbar.jsx";
import ReviewManagement from "../components/review/ReviewManagement.jsx";
import ReviewProcedur from "../components/review/ReviewProcedur.jsx";



const ReviewParent = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/ygg/toplanti-tutanagi", component: <ReviewManagement /> },
        { id: 2, path: "/ygg/prosedur", component: <ReviewProcedur /> },
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

export default ReviewParent;
