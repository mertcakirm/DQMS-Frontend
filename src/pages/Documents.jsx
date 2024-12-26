import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DocumentList from "../components/documents/DocumentList.jsx";
import ArchiveDuration from "../components/documents/ArchiveDuration.jsx";
import ExternalDocuments from "../components/documents/ExternalDocuments.jsx";
import CreateDocuments from "../components/documents/CreateDocuments.jsx";
import Sidebar from "../components/sidebar.jsx";
import ProcedurDoc from "../components/documents/ProcedurDoc.jsx";



const DocumentParent = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/dokuman/listesi", component: <DocumentList /> },
        { id: 2, path: "/dokuman/arsiv-suresi", component: <ArchiveDuration /> },
        { id: 3, path: "/dokuman/dis-kaynakli", component: <ExternalDocuments /> },
        { id: 4, path: "/dokuman/olustur", component: <CreateDocuments /> },
        { id: 5, path: "/dokuman/prosedur", component: <ProcedurDoc /> },

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

export default DocumentParent;
