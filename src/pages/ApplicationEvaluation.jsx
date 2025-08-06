import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/other/sidebar.jsx";
import ApplicationEvaluationForm from "../components/applicationevaluation/ApplicationEvaluationForm.jsx";
import ApplicationEvaluationForm2 from "../components/applicationevaluation/ApplicationEvaluationForm2.jsx";
import ProcedureEvaluation from "../components/applicationevaluation/ProcedureEvaluation.jsx";
import ApplicationInformation from "../components/applicationevaluation/ApplicationInformation.jsx";
import MattersToBeTakenIntoConsideration from "../components/applicationevaluation/MattersToBeTakenIntoConsideration.jsx";
import SignatureForm from "../components/applicationevaluation/SignatureForm.jsx";
import Conditions from "../components/applicationevaluation/Conditions.jsx";
import MeetingMinutesForm from "../components/applicationevaluation/MeetingMinutesForm.jsx";

const ApplicationEvaluation = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const location = useLocation();

    const steps = [
        { id: 1, path: "/basvuru/degerlendirme-formu", component: <ApplicationEvaluationForm /> },
        { id: 2, path: "/basvuru/degerlendirme-formu2", component: <ApplicationEvaluationForm2 /> },
        { id: 3, path: "/basvuru/basvuru-bilgileri", component: <ApplicationInformation /> },
        { id: 4, path: "/basvuru/dikkat-edilmesi-gerekenler", component: <MattersToBeTakenIntoConsideration /> },
        { id: 5, path: "/basvuru/imza", component: <SignatureForm /> },
        { id: 6, path: "/basvuru/kosullar", component: <Conditions /> },
        { id: 7, path: "/basvuru/toplanti-tutanak-formu", component: <MeetingMinutesForm /> },
        { id: 8, path: "/basvuru/prosedur", component: <ProcedureEvaluation /> },
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

export default ApplicationEvaluation;