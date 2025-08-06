import Sidebar from "../components/other/sidebar.jsx";
import "./css/Style.css";
import "./css/Dashboard.css";
import {useEffect, useState} from "react";
import {getDashboard} from "../API/Admin.js";
import {ResponsivePie} from "@nivo/pie";
import {getTypeTitle} from "../Helpers/typeMapper.js";
import {getAgendaEvents} from "../API/Agenda.js";
import {formatLocalDate, utcToLocal} from "../Helpers/dateTimeHelpers.js";
import {AgendaColors} from "../components/agenda/Agenda.jsx";

const Home = () => {
    const [data, setData] = useState(null);
    const [time, setTime] = useState("?");

    useEffect(() => {
        (async () => {
            const _data = await getDashboard();

            const todayDate = new Date();
            const agendaData = await getAgendaEvents(
                todayDate.getFullYear(),
                todayDate.getMonth() + 1,
            );

            const totalDepartmentDocuments = Object.values(
                _data.m_DepartmentDocumentCounts,
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
                    }),
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

    if (data == null) return;

    return (
        <div>
            <Sidebar/>
            <div className="content-container header-bg p-5">
                <div className="row justify-content-center column-gap-3" data-aos="fade-up">
                    <div className="col-12 row">
                        <div className="col-3">
                            <div className="dashboard-card  p-3">
                                <p className="dashboard-card-title col-12 text-center">
                                    Kullanıcı Sayısı
                                </p>
                                <div className="dashboard-card-info col-12 text-center">
                                    {data.userCount}
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="dashboard-card  p-3">
                                <p className="dashboard-card-title col-12 text-center">
                                    Doküman Sayısı
                                </p>
                                <div className="dashboard-card-info col-12 text-center">
                                    Toplam :
                                    {" " +
                                        Object.values(data.documentCounts).reduce(
                                            (acc, a) => acc + a,
                                            0,
                                        )}
                                </div>
                                <div className="dashboard-card-info col-12 text-center">
                                    Aylık :
                                    {" " +
                                        Object.values(data.m_DocumentCounts).reduce(
                                            (acc, a) => acc + a,
                                            0,
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="dashboard-card p-2">
                                <p className="dashboard-card-title col-12 text-center">
                                    Bekleyen Revizyon Sayısı
                                </p>
                                <div className="dashboard-card-info col-12 text-center">
                                    Talep : {data.pendingRevisionRequestsCount}
                                </div>
                                <div className="dashboard-card-info col-12 text-center">
                                    Revizyon : {data.pendingRevisionsCount}
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="dashboard-card p-3">
                                <div className="dashboard-card-info-time col-12 text-center">
                                    {time}
                                </div>
                                <div className="dashboard-card-info col-12 text-center">
                                    {formatLocalDate(new Date(), false)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row col-12 mt-5 justify-content-center">
                        <div className="col-8">
                            <div className="shadow-card p-3 row" style={{height: "341px"}}>
                                <div className="col-6">
                                    <p className="dashboard-card-title col-12 text-center">
                                        Tüm Dokümanlar
                                    </p>
                                    <div className="col-12" style={{height: "260px"}}>
                                        {/* Tüm Dokümanlar  */}
                                        <MyResponsivePie data={data.chart1}/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <p className="dashboard-card-title col-12 text-center">
                                        Aylık Dokümanlar
                                    </p>
                                    <div className="col-12" style={{height: "260px"}}>
                                        {/* Aylık Dokümanlar  */}
                                        <MyResponsivePie data={data.chart1}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div
                                className="shadow-card p-3"
                                style={{height: "340px", overflow: "auto"}}
                            >
                                <p className="dashboard-card-title col-12 text-center">
                                    Günlük Etkinlikler
                                </p>
                                <div
                                    className="col-12"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                        alignItems: "center",
                                        overflowY: "auto",
                                    }}
                                >
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
                                                        borderTopLeftRadius: "4px",
                                                        borderBottomLeftRadius: "4px",
                                                    }}
                                                />
                                                <div style={{marginLeft: "20px"}}>
                                                    <span
                                                        style={{
                                                            fontSize: "19px",
                                                            fontWeight: "600",
                                                            color: "rgb(37,37,43)",
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                      {event.title}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: "16px",
                                                            color: "rgb(70,70,81)",
                                                        }}
                                                    >
                                                      {event.time ?? ""}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "100px",
                                            textAlign:"center",
                                            fontSize: "18px",
                                            color: "black"
                                        }}>
                                            Bugün için etkinlik yok.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row col-12 mt-5 justify-content-center">
                        <div className="col-4">
                            <div className="shadow-card p-3" style={{height: "250px"}}>
                                <p className="dashboard-card-title col-12 text-center">
                                    Departmanlara Göre Dokümanlar
                                </p>
                                <div
                                    className="col-12"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                        height: "170px",
                                        overflowY: "auto"
                                    }}
                                >
                                    {data.departmentDocs.length > 0 ? (
                                        data.departmentDocs.map((o) => (
                                            <div key={o.name} className="dashboard-department-card">
                                                <div
                                                    style={{
                                                        marginLeft: "12px",
                                                        fontWeight: "500",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "15px",
                                                    }}
                                                >
                                                    <span>{o.name}</span>
                                                </div>
                                                <div className="dashboard-card-progress-bar">
                                                    <div
                                                        className="dashboard-card-progress"
                                                        style={{ width: `${o.progress}%` }}
                                                    />
                                                </div>
                                                <span style={{ marginRight: "24px", fontWeight: "500" }}>
                                                    {o.count}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                textAlign:"center",
                                                alignItems: "center",
                                                height: "100px",
                                                fontSize: "18px",
                                                color: "black",
                                            }}
                                        >
                                            Departman dokümanı bulunamadı.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="shadow-card p-3 row" style={{height: "250px"}}>
                                <div className="col-6">
                                    <p className="dashboard-card-title col-12 text-center">
                                        Revizyon Talepleri
                                    </p>
                                    <div className="col-12 dashboard-revisions">
                                        <span>
                                          {data.m_RejectedRevisionReqCount +
                                              data.m_AcceptedRevisionReqCount}
                                        </span>
                                        <div>
                                          <span style={{color: "green"}}>
                                            Kabul Edilen: <b>{data.m_AcceptedRevisionReqCount}</b>
                                          </span>
                                            <span style={{color: "red"}}>
                                            Reddedilen: <b>{data.m_RejectedRevisionReqCount}</b>
                                          </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <p className="dashboard-card-title col-12 text-center">
                                        Revizyon Sayısı
                                    </p>
                                    <div className="col-12 dashboard-revisions">
                                        <span>
                                          {data.m_AcceptedRevisionCount +
                                              data.m_RejectedRevisionCount}
                                        </span>
                                        <div>
                                          <span style={{color: "green"}}>
                                            Kabul Edilen: <b>{data.m_RejectedRevisionCount}</b>
                                          </span>
                                            <span style={{color: "red"}}>
                                            Reddedilen: <b>{data.m_AcceptedRevisionCount}</b>
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

const MyResponsivePie = ({data}) => (
    <ResponsivePie
        data={data}
        margin={{top: 20, right: 10, bottom: 30, left: 10}}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{from: "color"}}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
        }}
        enableArcLinkLabels={false}
        colors={{scheme: "paired"}}
    />
);
