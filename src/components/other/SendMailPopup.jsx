import React, {useContext, useState} from 'react';
import '../css/process.css';
import {ActionPerm, checkPermFromRole} from "../../API/permissions.js";
import UnauthPnl from "./unauthPnl.jsx";
import {localToUTC} from "../../Helpers/dateTimeHelpers.js";
import {sendManuelMail} from "../../API/Admin.js";
import {toast} from "react-toastify";
import {UserContext} from "../../App.jsx";

const getNowLocalDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
};

const SendMailPopup = ({onClose}) => {
    const user = useContext(UserContext);
    const [isMailPlanned, setIsMailPlanned] = useState(false);
    const [manuelMails, setManuelMails] = useState([]);
    const [manuelMailData, setManuelMailData] = useState({
        title: "",
        recipient: "",
        isHtml: false,
        body: "",
        date: getNowLocalDateTime(),
    });
    const sendManuelMailButtonClicked = () => {
        (async () => {
            const obj = { ...manuelMailData };

            if (isMailPlanned) {
                obj.date = localToUTC(new Date(obj.date));
            } else {
                delete obj.date; // sunucuya tarih gönderme
            }

            const id = await sendManuelMail(obj);

            if (isMailPlanned) {
                setManuelMails([...manuelMails, { ...obj, data: "U", id }]);
            }

            toast.success("Mail Gönderildi!");
            onClose(false);
        })();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content2 pt-3" data-aos="zoom-in">
                <button className="popup-close-btn" onClick={() => onClose(false)}>&times;</button>
                <div className="fs-4 text-center">Manuel Mail Gönder</div>
                {!checkPermFromRole(user.roleValue, ActionPerm.SendMail) ? (
                    <UnauthPnl/>
                ) : (
                    <div className="row justify-content-between px-5 row-gap-3">

                        <input

                            type="text"
                            placeholder="Alıcı E-Posta Adresi"
                            className="col-5 create-doc-inp"
                            value={manuelMailData.recipient}
                            onChange={(e) =>
                                setManuelMailData({
                                    ...manuelMailData,
                                    recipient: e.target.value,
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Başlık"
                            className="col-5 create-doc-inp"
                            value={manuelMailData.title}
                            onChange={(e) =>
                                setManuelMailData({
                                    ...manuelMailData,
                                    title: e.target.value,
                                })
                            }
                        />

                        <textarea
                            className="col-12 create-doc-textarea"
                            placeholder="Mesaj Gövdesi"
                            value={manuelMailData.body}
                            style={{minHeight: "100px"}}
                            onChange={(e) =>
                                setManuelMailData({
                                    ...manuelMailData,
                                    body: e.target.value,
                                })
                            }
                        />

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: "5px",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={manuelMailData.isHtml}
                                onChange={(e) =>
                                    setManuelMailData({
                                        ...manuelMailData,
                                        isHtml: e.target.checked,
                                    })
                                }
                            />
                            <label>Html gövde olarak gönder</label>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                columnGap: "5px",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isMailPlanned}
                                onChange={(e) => setIsMailPlanned(e.target.checked)}
                            />
                            <label>İleri tarihli gönderi</label>
                        </div>

                        {isMailPlanned && (
                            <>
                                <input
                                    type="datetime-local"
                                    className="col-2"
                                    placeholder="Gönderileceği Tarih"
                                    value={manuelMailData.date}
                                    onChange={(e) =>
                                        setManuelMailData({
                                            ...manuelMailData,
                                            date: e.target.value,
                                        })
                                    }
                                />
                            </>
                        )}
                        <button
                            className="print-btn2 mb-3 col-12"
                            onClick={sendManuelMailButtonClicked}
                        >
                            Gönder
                        </button>
                    </div>

                )}
            </div>
        </div>
    );
};

export default SendMailPopup;