import Home from "./pages/Home.jsx";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile.jsx";
import DocumentParent from "./pages/Documents.jsx";
import AuditParent from "./pages/Audit.jsx";
import Login from "./pages/Login.jsx";
import RiskAnalize from "./pages/RiskAnalize.jsx";
import LegalAndOther from "./pages/LegalAndOther.jsx";
import ProcessParent from "./pages/ProcessParent.jsx";
import Emergency from "./pages/Emergency.jsx";
import Environment from "./pages/Environment.jsx";
import NearMiss from "./pages/NearMiss.jsx";
import Review from "./pages/Review.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import CorrectiveAction from "./pages/CorrectiveAction.jsx";
import { Outlet, Navigate } from "react-router-dom";
import { getSelf } from "./API/User.js";
import { getRole } from "./API/Role.js";
import { createContext, useEffect, useState } from "react";
import Agenda from "./components/agenda/Agenda.jsx";
import RevisionPage from "./pages/revisionPage.jsx";
import MyRevision from "./pages/MyRevision.jsx";
import Purchasing from "./pages/Purchasing.jsx";
import ContractualCommitments from "./pages/ContractualCommitments.jsx";
import Hire from "./pages/Hire.jsx";
import ProjectMonitoring from "./pages/ProjectMonitoring.jsx";
import ApplicationEvaluation from "./pages/ApplicationEvaluation.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import MyDocuments from "./components/documents/myDocuments.jsx";
import OccupationalHealthAndSafety from "./pages/OccupationalHealthAndSafety.jsx";
import CompletedRevision from "./pages/CompletedRevision.jsx";
import {ToastContainer} from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";

export const UserContext = createContext();
export const SidebarDataContext = createContext();

const ProtectedRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await getSelf();

      if (response == null) {
        setUser(null);
        setLoading(false);
      }

      response.roleValue = response.roleId
        ? await getRole(response.roleId)
        : null;

      setUser(response);
      setLoading(false);
    })();
  }, []);

  if (!loading) {
    return user ? (
      <UserContext.Provider value={user}>
        <SidebarDataContext.Provider value={{ refresher: null }}>
          <Outlet />
        </SidebarDataContext.Provider>
      </UserContext.Provider>
    ) : (
      <Navigate to="/" />
    );
  }
};

const App = () => {

  useEffect(() => {
    AOS.init({duration: 700});
  }, []);

  return (
    <>
      <BrowserRouter>
        <ToastContainer theme="light" closeOnClick position="bottom-right" autoClose={3000} />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/anasayfa" element={<Home />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/profilim" element={<Profile />} />
            <Route path="/dokuman/listesi" element={<DocumentParent />} />
            <Route path="/dokuman/arsiv-suresi" element={<DocumentParent />} />
            <Route path="/dokuman/dis-kaynakli" element={<DocumentParent />} />
            <Route path="/dokuman/olustur" element={<DocumentParent />} />
            <Route path="/dokuman/prosedur" element={<DocumentParent />} />
            <Route path="/revizyonlarim" element={<MyRevision />} />
            <Route path="/ic-denetim/cizelge" element={<AuditParent />} />
            <Route path="/ic-denetim/rapor" element={<AuditParent />} />
            <Route path="/ic-denetim/prosedur" element={<AuditParent />} />
            <Route path="/risk/isg" element={<RiskAnalize />} />
            <Route path="/risk/surec" element={<RiskAnalize />} />
            <Route path="/risk/prosedur" element={<RiskAnalize />} />
            <Route
              path="/yasal/izinler-ve-diger-sartlar"
              element={<LegalAndOther />}
            />
            <Route path="/yasal/uygunluk" element={<LegalAndOther />} />
            <Route path="/yasal/prosedur" element={<LegalAndOther />} />
            <Route
              path="/process/hedef-performans"
              element={<ProcessParent />}
            />
            <Route
              path="/process/ihtiyac-ve-beklentiler"
              element={<ProcessParent />}
            />
            <Route path="/process/swot" element={<ProcessParent />} />
            <Route path="/process/pestle" element={<ProcessParent />} />
            <Route path="/process/prosedur" element={<ProcessParent />} />
            <Route path="/acil-durum/eylem" element={<Emergency />} />
            <Route path="/acil-durum/tatbikat" element={<Emergency />} />
            <Route path="/acil-durum/tatbikat-cevre" element={<Emergency />} />
            <Route path="/acil-durum/prosedur" element={<Emergency />} />
            <Route path="/cevre/yonerge1" element={<Environment />} />
            <Route path="/cevre/yonerge2" element={<Environment />} />
            <Route path="/cevre/atik-takip" element={<Environment />} />
            <Route path="/cevre/prosedur" element={<Environment />} />
            <Route path="/ramak-kala/takip-listesi" element={<NearMiss />} />
            <Route
              path="/ramak-kala/olay-bildirim-formu"
              element={<NearMiss />}
            />
            <Route path="/ramak-kala/kaza-olay-takip" element={<NearMiss />} />
            <Route
              path="/ramak-kala/kaza-olay-takip-formu"
              element={<NearMiss />}
            />
            <Route path="/ramak-kala/prosedur" element={<NearMiss />} />
            <Route path="/ygg/toplanti-tutanagi" element={<Review />} />
            <Route path="/ygg/prosedur" element={<Review />} />
            <Route path="/bakim/plani" element={<Maintenance />} />
            <Route path="/bakim/prosedur" element={<Maintenance />} />
            <Route
              path="/duzeltici-faaliyet/cizelge"
              element={<CorrectiveAction />}
            />
            <Route
              path="/duzeltici-faaliyet/form"
              element={<CorrectiveAction />}
            />
            <Route
              path="/duzeltici-faaliyet/prosedur"
              element={<CorrectiveAction />}
            />
            <Route path="/ajanda" element={<Agenda />} />
            <Route path="/revizyon-talebi" element={<RevisionPage />} />
            <Route path="/satin-alma/talep-formu" element={<Purchasing />} />
            <Route
              path="/satin-alma/onayli-tedarikciler"
              element={<Purchasing />}
            />
            <Route
              path="/satin-alma/tedarikci-degerlendirme"
              element={<Purchasing />}
            />
            <Route path="/satin-alma/prosedur" element={<Purchasing />} />
            <Route
              path="/sozlesme/gizlilik"
              element={<ContractualCommitments />}
            />
            <Route
              path="/sozlesme/kisisel-veriler"
              element={<ContractualCommitments />}
            />
            <Route
              path="/sozlesme/takip-cizelge"
              element={<ContractualCommitments />}
            />
            <Route
              path="/sozlesme/prosedur"
              element={<ContractualCommitments />}
            />
            <Route path="/kiralama/sozlesme1" element={<Hire />} />
            <Route path="/kiralama/sozlesme2" element={<Hire />} />
            <Route path="/kiralama/sozlesme3" element={<Hire />} />
            <Route path="/kiralama/yerlesim-tutanagi" element={<Hire />} />
            <Route path="/kiralama/prosedur" element={<Hire />} />
            <Route
              path="/proje-izleme/toplanti-tutanagi"
              element={<ProjectMonitoring />}
            />
            <Route
              path="/proje-izleme/izleme-raporu"
              element={<ProjectMonitoring />}
            />
            <Route
                path="/proje-izleme/izleme-raporu-2"
                element={<ProjectMonitoring />}
            />
            <Route
              path="/proje-izleme/prosedur"
              element={<ProjectMonitoring />}
            />
            <Route
              path="/basvuru/degerlendirme-formu"
              element={<ApplicationEvaluation />}
            />
            <Route
              path="/basvuru/degerlendirme-formu2"
              element={<ApplicationEvaluation />}
            />
            <Route
              path="/basvuru/basvuru-bilgileri"
              element={<ApplicationEvaluation />}
            />
            <Route
              path="/basvuru/dikkat-edilmesi-gerekenler"
              element={<ApplicationEvaluation />}
            />
            <Route path="/basvuru/imza" element={<ApplicationEvaluation />} />
            <Route
              path="/basvuru/kosullar"
              element={<ApplicationEvaluation />}
            />
            <Route
              path="/basvuru/toplanti-tutanak-formu"
              element={<ApplicationEvaluation />}
            />
            <Route
              path="/basvuru/prosedur"
              element={<ApplicationEvaluation />}
            />
            <Route path="/dokuman/dokumanlarim" element={<DocumentParent />} />
            <Route path="/is-sagligi-ve-guvenligi/zimmet" element={<OccupationalHealthAndSafety />} />
            <Route path="/is-sagligi-ve-guvenligi/prosedur" element={<OccupationalHealthAndSafety />} />
            <Route path="/onay-bekleyen-revizyonlar" element={<CompletedRevision />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
