import Sidebar from "../components/other/Sidebar.jsx";
import "./css/Style.css";
import "./css/Dashboard.css";
import { useEffect, useState } from "react";
import { getDashboard } from "../API/Admin.js";
import { ResponsivePie } from "@nivo/pie";
import { getTypeTitle } from "../Helpers/typeMapper.js";
import { getAgendaEvents } from "../API/Agenda.js";
import { formatLocalDate, utcToLocal } from "../Helpers/dateTimeHelpers.js";
import { AgendaColors } from "../components/agenda/Agenda.jsx";

const Home = () => {
    const [data, setData] = useState(null);
    const [time, setTime] = useState("?");

    useEffect(() => {
        (async () => {
            const _data = await getDashboard();

            const todayDate = new Date();
            const agendaData = await getAgendaEvents(
                todayDate.getFullYear(),
                todayDate.getMonth() + 1
            );

            const totalDepartmentDocuments = Object.values(
                _data.m_DepartmentDocumentCounts
            ).reduce((acc, a) => acc + a, 0);

            const dataValue = {
                ..._data,
                dailyEvents: agendaData.filter((event) => {
                    const ld = new Date(event.date); // utcToLocal
                    const additionalAllow = true; // time check

                    return (
                        ld.getDate() === todayDate.getDate() &&
                        ld.getMonth() === todayDate.getMonth() &&
                        ld.getFullYear() === todayDate.getFullYear() &&
                        additionalAllow
                    );
                }),
                chart1: Object.entries(_data.documentCounts).map(([key, value]) => ({
                    id: getTypeTitle(key),
                    label: getTypeTitle(key),
                    value: value,
                })),
                chart2: Object.entries(_data.m_DocumentCounts).map(([key, value]) => ({
                    id: getTypeTitle(key),
                    label: getTypeTitle(key),
                    value: value,
                })),
                departmentDocs: Object.entries(_data.m_DepartmentDocumentCounts).map(
                    ([key, value]) => ({
                        name: key,
                        progress: (value / totalDepartmentDocuments) * 100,
                        count: value,
                    })
                ),
            };

            setData(dataValue);
        })();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const localTime = now.toLocaleTimeString("en-US", {
                hour12: false,
            });

            const split = localTime.split(":");
            setTime(split[0] + ":" + split[1]);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (data == null) return null;

    return (
        <div>
            <Sidebar />
            
            {/* Eski "header-bg p-5 m-0" sınıfları kaldırıldı. Global "content-container" padding/margin kurallarına bırakıldı. */}
            <div className="content-container">
                <div className="row justify-content-center pt-5" data-aos="fade-up">
                    
                    {/* ÜST İSTATİSTİK KARTLARI */}
                    <div className="col-12 row mb-4">
                        <div className="col-3">
                            <div className="dashboard-card">
                                <p className="dashboard-card-title text-center">Kullanıcı Sayısı</p>
                                <div className="dashboard-card-info text-center">
                                    {data.userCount}
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="dashboard-card">
                                <p className="dashboard-card-title text-center">Doküman Sayısı</p>
                                <div className="dashboard-card-info text-center">
                                    Toplam: {Object.values(data.documentCounts).reduce((acc, a) => acc + a, 0)}
                                </div>
                                <div className="dashboard-card-info text-center mt-1" style={{ fontSize: '16px', color: '#6e6e80' }}>
                                    Aylık: {Object.values(data.m_DocumentCounts).reduce((acc, a) => acc + a, 0)}
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="dashboard-card">
                                <p className="dashboard-card-title text-center">Bekleyen Revizyon</p>
                                <div className="dashboard-card-info text-center">
                                    Talep: {data.pendingRevisionRequestsCount}
                                </div>
                                <div className="dashboard-card-info text-center mt-1" style={{ fontSize: '16px', color: '#6e6e80' }}>
                                    Revizyon: {data.pendingRevisionsCount}
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="dashboard-card">
                                <div className="dashboard-card-info-time text-center">
                                    {time}
                                </div>
                                <div className="dashboard-card-info text-center" style={{ fontSize: '16px', color: '#6e6e80' }}>
                                    {formatLocalDate(new Date(), false)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ORTA BÖLÜM: GRAFİKLER VE ETKİNLİKLER */}
                    <div className="row col-12 mb-4 justify-content-center">
                        <div className="col-8">
                            <div className="shadow-card row m-0" style={{ height: "360px" }}>
                                <div className="col-6 d-flex flex-column">
                                    <p className="dashboard-card-title text-center">Tüm Dokümanlar</p>
                                    <div style={{ flex: 1, minHeight: 0 }}>
                                        <MyResponsivePie data={data.chart1} />
                                    </div>
                                </div>
                                <div className="col-6 d-flex flex-column">
                                    <p className="dashboard-card-title text-center">Aylık Dokümanlar</p>
                                    <div style={{ flex: 1, minHeight: 0 }}>
                                        {/* chart1 yerine chart2 kullanılarak hata düzeltildi */}
                                        <MyResponsivePie data={data.chart2} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-4">
                            <div className="shadow-card custom-scrollbar" style={{ height: "360px", overflowY: "auto" }}>
                                <p className="dashboard-card-title text-center">Günlük Etkinlikler</p>
                                <div className="d-flex flex-column gap-2 mt-2">
                                    {data.dailyEvents.length > 0 ? (
                                        data.dailyEvents.map((event) => (
                                            <div
                                                key={event.eventId}
                                                className="dashboard-daily-event-card"
                                                onClick={() => (window.location.href = "/ajanda")}
                                            >
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        left: "0",
                                                        top: "0",
                                                        background: AgendaColors[event.colorIndex],
                                                        height: "100%",
                                                        width: "6px",
                                                        borderTopLeftRadius: "12px",
                                                        borderBottomLeftRadius: "12px",
                                                    }}
                                                />
                                                <div className="w-100 d-flex justify-content-between align-items-center">
                                                    <span style={{ fontSize: "16px", fontWeight: "600", color: "#25252b" }}>
                                                        {event.title}
                                                    </span>
                                                    <span style={{ fontSize: "14px", color: "#6e6e80", fontWeight: "500" }}>
                                                        {event.time ?? ""}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="d-flex justify-content-center align-items-center text-muted" style={{ height: "150px" }}>
                                            Bugün için etkinlik yok.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ALT BÖLÜM: DEPARTMAN VE REVİZYON DETAYLARI */}
                    <div className="row col-12 justify-content-center">
                        <div className="col-4">
                            <div className="shadow-card" style={{ height: "300px" }}>
                                <p className="dashboard-card-title text-center">Departmanlara Göre Dokümanlar</p>
                                <div className="custom-scrollbar mt-2" style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {data.departmentDocs.length > 0 ? (
                                        data.departmentDocs.map((o) => (
                                            <div key={o.name} className="dashboard-department-card">
                                                <span style={{ fontWeight: "600", color: "#494949", minWidth: "80px" }}>
                                                    {o.name}
                                                </span>
                                                <div className="dashboard-card-progress-bar">
                                                    <div
                                                        className="dashboard-card-progress"
                                                        style={{ width: `${o.progress}%` }}
                                                    />
                                                </div>
                                                <span style={{ fontWeight: "700", color: "#25252b" }}>
                                                    {o.count}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="d-flex justify-content-center align-items-center text-muted" style={{ height: "100px" }}>
                                            Departman dokümanı bulunamadı.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-8">
                            <div className="shadow-card row m-0" style={{ height: "300px" }}>
                                <div className="col-6 d-flex flex-column">
                                    <p className="dashboard-card-title text-center">Revizyon Talepleri</p>
                                    <div className="dashboard-revisions">
                                        <span>
                                            {data.m_RejectedRevisionReqCount + data.m_AcceptedRevisionReqCount}
                                        </span>
                                        <div className="dashboard-revisions-stats">
                                            <span className="text-success-modern">
                                                Kabul: <b>{data.m_AcceptedRevisionReqCount}</b>
                                            </span>
                                            <span className="text-danger-modern">
                                                Ret: <b>{data.m_RejectedRevisionReqCount}</b>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 d-flex flex-column">
                                    <p className="dashboard-card-title text-center">Revizyon Sayısı</p>
                                    <div className="dashboard-revisions">
                                        <span>
                                            {data.m_AcceptedRevisionCount + data.m_RejectedRevisionCount}
                                        </span>
                                        <div className="dashboard-revisions-stats">
                                            {/* Değerlerin ters yazıldığı mantık hatası düzeltildi */}
                                            <span className="text-success-modern">
                                                Kabul: <b>{data.m_AcceptedRevisionCount}</b>
                                            </span>
                                            <span className="text-danger-modern">
                                                Ret: <b>{data.m_RejectedRevisionCount}</b>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Home;

const MyResponsivePie = ({ data }) => (
    <ResponsivePie
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.6} /* İçi biraz daha boşaltıldı, modern görünüm */
        padAngle={1.5}
        cornerRadius={4}
        activeOuterRadiusOffset={8}
        borderWidth={0}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#6e6e80"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#ffffff"
        enableArcLinkLabels={false}
        colors={['#5030E5', '#D232AF', '#8c78f0', '#e384ce', '#b9afe3']} /* Marka renkleri palete eklendi */
    />
);
