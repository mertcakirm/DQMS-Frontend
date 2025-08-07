import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/other/Navbar.jsx";
import PurchaseRequestForm from "../components/purchasing/PurchaseRequestForm.jsx";
import ApprovedSupplierList from "../components/purchasing/ApprovedSupplierList.jsx";
import SupplierEvaluationForm from "../components/purchasing/SupplierEvaluationForm.jsx";
import PurchasingProcedure from "../components/purchasing/PurchasingProcedure.jsx";

const Purchasing = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/satin-alma/talep-formu", component: <PurchaseRequestForm /> },
        { id: 2, path: "/satin-alma/onayli-tedarikciler", component: <ApprovedSupplierList /> },
        { id: 3, path: "/satin-alma/tedarikci-degerlendirme", component: <SupplierEvaluationForm /> },
        { id: 4, path: "/satin-alma/prosedur", component: <PurchasingProcedure /> },
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

export default Purchasing;