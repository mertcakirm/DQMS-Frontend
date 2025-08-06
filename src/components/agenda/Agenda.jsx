import React, { useEffect, useState } from "react";
import "./agenda.css";
import Sidebar from "../other/sidebar.jsx";
import {
  createNewAgendaEvent,
  deleteAgendaEvent,
  getAgendaEvents,
  updateAgendaEvent,
} from "../../API/Agenda.js";
import {
  getLocalISOString,
  getTimeString,
  localToUTC,
  utcToLocal,
} from "../../Helpers/dateTimeHelpers.js";

export const AgendaColors = [
  "rgba(51, 87, 255, 1)",
  "rgba(30, 151, 216, 0.8)",
  "rgba(216, 42, 42, 0.8)",
  "rgba(221, 39, 168, 0.8)",
  "rgba(26, 197, 50, 0.8)",
  "rgb(230, 190, 28)",
  "rgba(211, 78, 19, 0.8)",
];

function Agenda() {
  const [events, setEvents] = useState([]);
  const [currentObj, setCurrentObj] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await getAgendaEvents(
        currentObj.year,
        currentObj.month + 1,
      );

      setEvents(
        result.map((r) => {
          const utcDateTime = new Date(r.date);

          if (r.time != null) {
            const [utcHours, utcMinutes] = r.time.split(":").map(Number);
            utcDateTime.setHours(utcHours, utcMinutes, 0, 0);
          }

          const localDateTime = utcDateTime; //utcToLocal(utcDateTime);

          return {
            id: r.eventId,
            title: r.title,
            date: localDateTime,
            time: r.time == null ? "" : getTimeString(localDateTime),
            description: r.description,
            reminders: r.reminders,
            colorIndex: r.colorIndex,
          };
        }),
      );
    })();
  }, [currentObj]);

  const openPopup = (day, event = null) => {
    setPopupData({
      day: day,
      event: event,
    });
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupData(null);
  };

  const renderCalendar = () => {
    const currentYear = currentObj.year;
    const currentMonth = currentObj.month;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth =
      (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<td key={`empty-${i}`}></td>);
    }

    const today = new Date();
    const isToday = (day) => {
      return (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      );
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events
        .filter((event) => {
          const targetDate = new Date(currentYear, currentMonth, day);
          return event.date.toDateString() === targetDate.toDateString();
        })
        .sort((a, b) => {
          if (!a.time && b.time) return -1;
          if (a.time && !b.time) return 1;
          if (a.time && b.time) {
            const timeA = new Date(`1970-01-01T${a.time}:00`);
            const timeB = new Date(`1970-01-01T${b.time}:00`);
            return timeA - timeB;
          }
          return 0;
        });

      calendarDays.push(
        <td key={day}>
          <div className="calendar-day" onClick={() => openPopup(day)}>
            <span style={{ color: isToday(day) ? "blue" : "black" }}>
              {day}
            </span>
            <ul>
              {dayEvents.map((event, index) => (
                <li
                  key={index}
                  className="event-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup(day, event);
                  }}
                  style={{
                    backgroundColor: AgendaColors[event.colorIndex],
                  }}
                >
                  {event.time ? `${event.time} - ` : ""}
                  {event.title}
                </li>
              ))}
            </ul>
          </div>
        </td>,
      );
    }

    const rows = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      rows.push(<tr key={i}>{calendarDays.slice(i, i + 7)}</tr>);
    }

    return rows;
  };

  return (
    <div className="document-parent">
      <Sidebar />
      <div className="content-container px-5" data-aos="fade-up">
        <div
          className="row justify-content-between align-items-center"
          style={{ height: "100vh" }}
        >
          <h3 className="col-12 large-title">AJANDA</h3>
          <div className="agenda-container">
            <div className="selectors">
              <div className="year-selector">
                <select
                  value={currentObj.year}
                  onChange={(e) =>
                    setCurrentObj({
                      year: parseInt(e.target.value),
                      month: currentObj.month,
                    })
                  }
                >
                  {Array.from(
                    { length: 21 },
                    (_, i) => new Date().getFullYear() - 10 + i,
                  ).map((year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="month-selector">
                <select
                  value={currentObj.month}
                  onChange={(e) =>
                    setCurrentObj({
                      year: currentObj.year,
                      month: parseInt(e.target.value),
                    })
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option value={i} key={i}>
                      {new Date(0, i).toLocaleString("tr", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <table className="calendar-table">
              <thead>
                <tr>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Pzt
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Sal
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Çar
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Per
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Cum
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Cmt
                  </th>
                  <th
                    style={{
                      background:
                        "linear-gradient(130deg, rgba(134,72,209,0.2) 0%, rgba(98,31,180,0.3) 87%)",
                    }}
                  >
                    Paz
                  </th>
                </tr>
              </thead>
              <tbody>{renderCalendar()}</tbody>
            </table>
            {isPopupOpen && (
              <Popup
                popupCloser={closePopup}
                eventSetter={setEvents}
                popupData={popupData}
                eventArray={events}
                month={currentObj}
              />
            )}
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}

export default Agenda;

function Popup({ popupCloser, eventSetter, popupData, eventArray, month }) {
  const [event, setEvent] = useState(
    popupData?.event ?? {
      date: new Date(month.year, month.month, popupData.day),
      time: "",
      title: "",
      description: "",
      colorIndex: 0,
      reminders: 0,
      id: null,
    },
  );
  const [discard, setDiscard] = useState(false);

  const handleColorChange = (index) => {
    setEvent({ ...event, colorIndex: index });
  };

  const handleMailPrefChange = () => {
    if (discard) return;

    const elements = document.querySelectorAll(
      ".email-checkbox-list input[mail-flag]",
    );
    let flags = 0;

    elements.forEach((element) => {
      if (element.checked === true)
        flags |= parseInt(element.getAttribute("mail-flag"));
    });

    setEvent({ ...event, reminders: flags });
  };

  const updateReminders = () => {
    const elements = document.querySelectorAll(
      ".email-checkbox-list input[mail-flag]",
    );

    setDiscard(true);
    elements.forEach((element) => {
      const atrb = parseInt(element.getAttribute("mail-flag"));
      const flag = parseInt(event.reminders);
      element.checked = (flag & atrb) === atrb;
    });

    setDiscard(false);
    handleMailPrefChange();
  };

  const onSave = () => {
    if (event.title == null || event.title === "") return;

    (async () => {
      const localDateTime = event.date;

      if (event.time != null && event.time.length > 0) {
        const [hours, minutes] = event.time.split(":").map(Number);
        localDateTime.setHours(hours, minutes, 0, 0);
      } else {
        localDateTime.setHours(0, 0, 1, 0);
      }
      const utcEventDateTime = localDateTime; //localToUTC(localDateTime);

      const eventId = await createNewAgendaEvent({
        date: getLocalISOString(utcEventDateTime),
        time:
          event.time == null || event.time.length === 0
            ? null
            : getTimeString(utcEventDateTime) + ":00",
        title: event.title,
        description:
          event.description == null || event.description.length === 0
            ? null
            : event.description,
        colorIndex: event.colorIndex,
        reminders: event.reminders,
      });

      eventSetter([...eventArray, { ...event, id: eventId }]);
      popupCloser();
    })();
  };

  const onUpdate = () => {
    eventSetter(
      eventArray.map((ee) => (ee.id === popupData.event.id ? event : ee)),
    );

    (async () => {
      await updateAgendaEvent(popupData.event.id, {
        time:
          event.time == null || event.time.length === 0
            ? null
            : event.time + ":00",
        title: event.title,
        description:
          event.description == null || event.description.length === 0
            ? null
            : event.description,
        colorIndex: event.colorIndex,
        reminders: event.reminders,
      });

      popupCloser();
    })();
  };

  const onDelete = () => {
    eventSetter(eventArray.filter((ee) => ee.id !== popupData.event.id));

    (async () => {
      // API Delete
      await deleteAgendaEvent(popupData.event.id);
      popupCloser();
    })();
  };

  const colors = AgendaColors;

  useEffect(() => {
    updateReminders();
  }, []);

  return (
    <div className="popup-overlay" onClick={() => popupCloser()}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h2>{popupData?.event ? "Etkinlik Detayları" : "Yeni Etkinlik"}</h2>
        <div className="divider" />
        <div className="color-selector">
          {colors.map((color, index) => (
            <label
              key={index}
              className={`color-label ${event.colorIndex === index ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="color"
                value={color}
                checked={event.colorIndex === index}
                onChange={() => handleColorChange(index)}
                style={{ display: "none" }}
              />
              <div
                className="color-box"
                style={{
                  backgroundColor: color,
                }}
              >
                {event.colorIndex === index && (
                  <svg
                    width="20px"
                    height="14px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12.6111L8.92308 17.5L20 6.5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </label>
          ))}
        </div>

        <input
          type="text"
          placeholder="Başlık"
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
        />
        <input
          type="time"
          value={event.time}
          onChange={(e) => setEvent({ ...event, time: e.target.value })}
        />
        <textarea
          placeholder="Açıklama"
          maxLength="1000"
          value={event.description ?? ""}
          style={{ height: "100px", resize: "none" }}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
        ></textarea>

        <div className="emailContainer">
          <label style={{ marginBottom: "10px" }}>E-posta ile hatırlat</label>
          <div className="email-checkbox-list">
            <label>
              <input
                type="checkbox"
                mail-flag="1"
                onChange={handleMailPrefChange}
              />
              Etkinlik zamanında
            </label>
            <label>
              <input
                type="checkbox"
                mail-flag="2"
                onChange={handleMailPrefChange}
              />
              10 dakika önce
            </label>
            <label>
              <input
                type="checkbox"
                mail-flag="4"
                onChange={handleMailPrefChange}
              />
              30 dakika önce
            </label>
            <label>
              <input
                type="checkbox"
                mail-flag="8"
                onChange={handleMailPrefChange}
              />
              1 saat önce
            </label>
            <label>
              <input
                type="checkbox"
                mail-flag="16"
                onChange={handleMailPrefChange}
              />
              1 gün önce
            </label>
            <label>
              <input
                type="checkbox"
                mail-flag="32"
                onChange={handleMailPrefChange}
              />
              3 gün önce
            </label>
          </div>
        </div>

        <div className="button-group">
          {popupData.event != null && (
            <button className="deleteBtn" onClick={onDelete}>
              Sil
            </button>
          )}
          <button className="cancelBtn" onClick={() => popupCloser()}>
            İptal
          </button>
          <button
            onClick={() => (popupData.event != null ? onUpdate() : onSave())}
          >
            {popupData.event ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
