import React, {useState} from 'react';
import {createUnitRequest} from "../../API/Unit.js";
import {toast} from "react-toastify";

const AddUnitPopup = ({onClose}) => {
    const [newUnit, setNewUnit] = useState(null);

    const createNewUnit = async () => {
        if (!newUnit) {
            toast.error("Lütfen birim adını giriniz!")
        }else{
            try {
                await createUnitRequest(newUnit);
                setNewUnit(null);
                toast.success("Birim başarıyla oluşturuldu!");
                onClose(false);
            }catch (error) {
                console.error(error);
                toast.error("Birim oluşturulurken bir hata oluştu lütfen daha sonra tekrar deneyiniz")
                onClose(false);
            }
        }
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content2 pb-3" data-aos="zoom-in">
                <button className="popup-close-btn" onClick={() => onClose(false)}>&times;</button>
                <div className="row justify-content-center align-items-center row-gap-3">
                    <div className="titles text-center card-header create-doc-card-header py-3">Birim Oluştur</div>
                    <div className="d-flex col-12 gap-3 flex-column w-100 align-items-center">
                    <input
                        type="text"
                        placeholder="Yeni Birim Adı..."
                        className="col-10 create-doc-inp"
                        value={newUnit}
                        onChange={(e) =>
                            setNewUnit(e.target.value)
                        }
                    />
                    <button onClick={createNewUnit} className="print-btn">Kaydet</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUnitPopup;