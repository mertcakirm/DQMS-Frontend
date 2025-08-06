import '/src/components/css/process.css';
import "aos/dist/aos.css";
import {toast} from 'react-toastify';
import {deleteUser} from "../../API/User.js";
import {deleteRole} from "../../API/Role.js";
import {deleteManuelMail} from "../../API/Admin.js";
import '../css/process.css'
import {deleteDocument} from "../../API/Documents.js";

const ProcessPopup = ({type, text, id, onClose,}) => {

    const HandleSubmit = async () => {
        try {
            switch (type) {
                case "delete_user":
                    await deleteUser(id);
                    toast.success("Kullanıcı başarıyla silindi!");
                    break;
                case "delete_role":
                    await deleteRole(id);
                    toast.success("Rol başarıyla silindi!");
                    break;
                case "delete_mail":
                    await deleteManuelMail(id);
                    toast.success("Mail başarıyla silindi!");
                    break;
                case "delete_archive":
                    await deleteDocument(id);
                    toast.success("Arşiv dokümanı başarıyla silindi!");
                    break;
                case "delete_document":
                    await deleteDocument(id);
                    toast.success("Doküman başarıyla silindi!");
                    break;

                default:
                    toast.error("Bilinmeyen işlem!");
                    console.error("Unknown type");
                    return;
            }
            onClose(false);
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Hata! İşlem Başarısız!");
            onClose(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content2 p-5" style={{width:'450px'}}  data-aos="zoom-in">
                <p className="text-center text-dark border-2 " style={{color: '#fff'}}>{`${text}`}</p>
                <div className="delete-popup-buttons row justify-content-between">
                    <button className="add-btn col-4" style={{background: 'red', border: 'none', height: '50px'}}
                            onClick={() => onClose(false)}>
                        <svg fill="white" width="30" height="30" clipRule="evenodd" fillRule="evenodd"
                             strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"/>
                        </svg>
                    </button>
                    <button className="add-btn col-4" style={{background: 'green', border: 'none', height: '50px'}}
                            onClick={HandleSubmit}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProcessPopup;
