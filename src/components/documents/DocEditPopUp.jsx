import {useEffect, useState} from "react";
import {
    deleteRevisionRequest,
    getSelfRevisionRequestsForDocument,
    sendDocumentRevisionRequest
} from "../../API/DocumentRevision.js";
import "./css/DocEditPopup.css";

const DocEditPopUp = ({ id, setPopupState }) => {
    const [note, setNote] = useState(null);
    const [message, setMessage] = useState(null);
    const [revRequests, setRevRequests] = useState([]);

    const refresh = async () => {
            const result = await getSelfRevisionRequestsForDocument(id);

            if (result != null)
                setRevRequests(result.filter(r => r.status === 0));
    };

    useEffect(()=>{
        refresh();
    },[]);

    const formatRelativeTime = (dateString) => {
        const utcDate = new Date(dateString);
        const date = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
        const now = new Date();

        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return "Şimdi";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} dakika önce`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} saat önce`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} gün önce`;
        }
    };

    const deleteRevReq = (id) => {
        (async () =>{
            await deleteRevisionRequest(id);
            refresh();
        })();
    };

    return (
        <div>
            <div className="popup-overlay">
                <div className="popup-content" style={{height: '50%', width: '50%'}}>
                        <h4 className="large-title etitle">Revizyon Talep Et</h4>
                    <div className="requestsContainer">
                        {revRequests.map(data => (
                            <div className="request" key={data.id}>
                                <p>{formatRelativeTime(data.date)}</p>
                                <TrashIcon onClick={() => deleteRevReq(data.id)} width={22} height={22} style={{fill: "red"}} />
                        </div>
                        ))}
                    </div>
                    <form>
                        <div className="row p-5">
                            <div className="col-12 row" style={{padding: '10px 40px '}}>
                                <label className="purple-text">Doküman Kodu</label>
                                <p>{id}</p>
                            </div>
                            <div className="col-12 row" style={{padding: '10px 40px'}}>
                                <label className="purple-text">Not</label>
                                <textarea className="create-doc-textarea" value={note ?? ""}
                                          onChange={e => setNote(e.target.value)}
                                          style={{resize: 'none', height: '100px'}}></textarea>
                            </div>

                            <div className="col-12 row justify-content-between" style={{padding: '10px 40px '}}>
                                <button type="button" onClick={() => setPopupState(false)}
                                        className="btn print-btn2 mt-5 col-2">Kapat
                                </button>
                                <button type="button" onClick={() => {
                                    (async () =>{
                                        await sendDocumentRevisionRequest(id, note);
                                        refresh();
                                    })();
                                }}
                                        className="btn print-btn2 mt-5 col-2">Kaydet
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DocEditPopUp;

const TrashIcon = ({style, width = 800, height = 800, onClick}) => (
    <svg onClick={onClick} style={style} width={width + "px"} height={height + "px"} viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z"
            fill="#1C274C"/>
        <path fillRule="evenodd" clipRule="evenodd"
              d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12404C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001ZM10.2463 12.1886C10.2051 11.7548 9.83753 11.4382 9.42537 11.4816C9.01321 11.525 8.71251 11.9119 8.75372 12.3457L9.25372 17.6089C9.29494 18.0427 9.66247 18.3593 10.0746 18.3159C10.4868 18.2725 10.7875 17.8856 10.7463 17.4518L10.2463 12.1886ZM14.5746 11.4816C14.9868 11.525 15.2875 11.9119 15.2463 12.3457L14.7463 17.6089C14.7051 18.0427 14.3375 18.3593 13.9254 18.3159C13.5132 18.2725 13.2125 17.8856 13.2537 17.4518L13.7537 12.1886C13.7949 11.7548 14.1625 11.4382 14.5746 11.4816Z"
              fill="#1C274C"/>
    </svg>);
