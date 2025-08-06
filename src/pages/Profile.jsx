import Sidebar from "../components/other/sidebar.jsx";
import "./css/switch.css";
import {useContext, useEffect, useState} from "react";
import {
    changeUser,
    changeUserPassword,
    getUserPfp,
    resetSelfUserPfp,
    uploadUserPfp,
} from "../API/User.js";
import {SidebarDataContext, UserContext} from "../App.jsx";
import {toast} from "react-toastify";

const Profile = () => {
    const [profileImage, setProfileImage] = useState("");
    const [oldpassword, setOldpassword] = useState("");
    const [newpassword, setNewpassword] = useState("");
    const [email, setEmail] = useState("");
    const [user, setUser] = useState(useContext(UserContext));
    const sidebarData = useContext(SidebarDataContext);

    useEffect(() => {
        refreshUserData();
    }, []);

    const refreshUserData = () => {
        (async () => {
            const pfpResult = await getUserPfp();
            setProfileImage(
                `data:image/${pfpResult.FileExtension};base64,${pfpResult.data}`,
            );
            setEmail(user.email);
        })();

        sidebarData.refresher();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            let fileExt = file.name.split(".").pop();
            const reader = new FileReader();

            if (fileExt !== "png" && fileExt !== "jpeg" && fileExt !== "jpg") {
                toast.error("Desteklenmeyen format!")
                return;
            }

            if (fileExt === "jpg") fileExt = "jpeg";

            reader.onload = () => {
                (async () => {
                    const b64File = reader.result.split(",")[1];
                    await uploadUserPfp(b64File, fileExt);
                    setProfileImage(`data:image/${fileExt};base64,${b64File}`);
                    sidebarData.refresher();
                })();
            };
            reader.readAsDataURL(file);
        }
    };

    const SaveChanges = () => {
        try{
            (async () => {
                if (
                    oldpassword != null &&
                    oldpassword.length > 0 &&
                    newpassword != null &&
                    newpassword.length > 0
                )
                    await changeUserPassword(oldpassword, newpassword);
                toast.success("Bilgilerin Güncellendi!")
                if (email != null && email.length > 0) await changeUser({email: email});

                setEmail(email);
                setNewpassword("");
                setOldpassword("");
            })();
        }catch(e){
            console.log(e);
            toast.error("Bilgilerin Güncellenemedi!")
        }
    };

    const onEmailNotfCbChanged = (emailPref, state) => {
        const userPref = user.emailPreference;

        let newPref = state ? userPref | emailPref : userPref ^ emailPref;
        changeUser({
            emailPref: newPref,
        });
        setUser({...user, emailPreference: newPref});
    };

    return (
        <div>
            <Sidebar/>
            <div className="content-container p-5" data-aos="fade-up">
                <div className="row justify-content-between">
                    <h3 className="col-6 large-title">PROFİLİM</h3>
                </div>

                <div className="row mt-5">
                    <div className="col-6">
                        <div className="card" style={{minHeight: "337px"}}>
                            <div className="card-header create-doc-card-header">
                                Profil Bilgilerim
                            </div>
                            <div className="card-body justify-content-between row">
                                <div className="uprof-container">
                                    <div className="profile-photo-container">
                                        <img
                                            className="profile-photo"
                                            src={profileImage}
                                            alt="Profile"
                                        />
                                        <div className="hover-layer">Resim Değiştir</div>
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className="profile-photo-inp"
                                        />
                                    </div>
                                    <div className="resetPwd-container">
                                        <input
                                            className="create-doc-inp"
                                            style={{lineHeight: "30px", height: "30px"}}
                                            placeholder="Yeni Eposta"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="text"
                                        />
                                        <input
                                            className="create-doc-inp"
                                            style={{lineHeight: "30px", height: "30px"}}
                                            placeholder="Eski Parola"
                                            value={oldpassword}
                                            onChange={(e) => setOldpassword(e.target.value)}
                                            type="password"
                                        />
                                        <input
                                            className="create-doc-inp"
                                            style={{lineHeight: "30px", height: "30px"}}
                                            placeholder="Yeni Parola"
                                            value={newpassword}
                                            onChange={(e) => setNewpassword(e.target.value)}
                                            type="password"
                                        />
                                        <button className="print-btn2" onClick={SaveChanges}>
                                            Değişiklikleri Kaydet
                                        </button>

                                        <button
                                            className="print-btn2"
                                            onClick={() => {
                                                resetSelfUserPfp(user.name + " " + user.surname).then(
                                                    () => refreshUserData(),
                                                );
                                                toast.success("Profil Resmi Kaldırıldı!")
                                            }}
                                        >
                                            Profil Resmi Sıfırla
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card">
                            <div className="card-header create-doc-card-header">
                                Bildirim Yönetimi
                            </div>
                            <div
                                className="card-body justify-content-center row"
                                style={{rowGap: "10px"}}
                            >
                                {user &&
                                    [
                                        ["Yeni Revizyon", 1 << 0],
                                        ["Revizyon Red", 1 << 1],
                                        ["Yeni Revizyon Talebi", 1 << 2],
                                        ["Revizyon Talebi Onay", 1 << 3],
                                        ["Revizyon Talebi Red", 1 << 4],
                                        ["Döküman Paylaşımı", 1 << 5],
                                        ["Dış Kaynaklı Döküman Değişimi", 1 << 6],
                                        ["Hedef Performans Hatırlatma", 1 << 7],
                                        ["Dış Kaynaklı Döküman Hatırlatma", 1 << 8],
                                        ["ISG Risk Değerlendirme Hatırlatması", 1 << 9],
                                        ["Satın Alma Durum Değişikliği", 1 << 10],
                                    ].map(([title, value]) => (
                                        <div className="row col-12 align-items-center" key={value}>
                                            <label className="col-10">{title}</label>
                                            <input
                                                type="checkbox"
                                                className="switch"
                                                onChange={(e) =>
                                                    onEmailNotfCbChanged(value, e.target.checked)
                                                }
                                                checked={(user.emailPreference & value) === value}
                                                onClick={()=>toast.success("Bildirim Ayarı Değiştirildi!")}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
