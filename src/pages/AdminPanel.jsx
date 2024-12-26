import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { createRole, deleteRole, getAllRoles } from "../API/Role.js";
import { createNewUser, deleteUser, getUsers } from "../API/User.js";
import {
  ActionPerm,
  checkPermFromRole,
  getPermTitle,
} from "../API/permissions.js";
import UnauthPnl from "../components/unauthPnl.jsx";
import { UserContext } from "../App.jsx";
import {
  deleteManuelMail,
  getManuelMails,
  sendManuelMail,
} from "../API/Admin.js";
import {
  formatLocalDate,
  localToUTC,
  utcToLocal,
} from "../Helpers/dateTimeHelpers.js";

const AdminPanel = () => {
  const user = useContext(UserContext);

  const [newRole, setNewRole] = useState({
    name: "",
    perms: 0,
  });

  const [newUser, setNewUser] = useState({
    name: null,
    surname: null,
    email: null,
    password: null,
    username: null,
    roleId: null,
    emailPref: Array.from({ length: 10 }, (_, i) => 1 + i).reduce(
      (acc, a) => acc | (1 << a),
    ),
  });
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [refleshData, setRefleshData] = useState(false);
  const [manuelMailData, setManuelMailData] = useState({
    title: "",
    recipient: "",
    isHtml: false,
    body: "",
    date: null,
  });
  const [manuelMails, setManuelMails] = useState(null);

  const toggleRefleshData = () => {
    setRefleshData((prev) => !prev);
  };

  const RolesAndUsers = async () => {
    const roles = await getAllRoles();
    setRoles(roles);
    const users = await getUsers();
    setUsers(users);
  };

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
    RolesAndUsers();

    (async () => {
      const mails = await getManuelMails();
      setManuelMails(mails);
    })();
  }, []);

  useEffect(() => {
    RolesAndUsers();
  }, [refleshData]);

  const addUser = async () => {
    await createNewUser(newUser);
    setNewUser("");
    toggleRefleshData();
  };

  const addRole = async () => {
    if (newRole.perms === 0) return;
    await createRole(newRole.name, newRole.perms);
    setNewRole({ name: "", perms: 0 });
    toggleRefleshData();
  };

  const HandleDeleteUser = async (id) => {
    await deleteUser(id);
    toggleRefleshData();
  };

  const HandleDeleteRole = async (id) => {
    await deleteRole(id);
    toggleRefleshData();
  };

  const handleRoleCreatePermChange = (perm, isAdd) => {
    if (isAdd) setNewRole({ ...newRole, perms: newRole.perms | perm });
    else setNewRole({ ...newRole, perms: newRole.perms ^ perm });
  };

  const sendManuelMailButtonClicked = () => {
    (async () => {
      const obj = manuelMailData;

      if (obj.date != null) obj.date = localToUTC(new Date(obj.date));

      const id = await sendManuelMail(obj);

      if (isMailPlanned)
        setManuelMails([...manuelMails, { ...obj, data: "U", id: id }]);

      alert("Mail gönderildi!");
    })();
  };
  const [isMailPlanned, setIsMailPlanned] = useState(false);

  return (
    <div>
      <Sidebar />
      <div className="content-container p-5">
        <div className="row justify-content-between">
          <h3 className="col-6 large-title">ADMİN PANEL</h3>
        </div>

        <div className="row mt-5" style={{ rowGap: "30px" }}>
          <div className="col-6">
            <div className="card">
              <div className="card-header create-doc-card-header">
                Kullanıcı Ekle
              </div>
              <div
                className="card-body py-3 px-4 row justify-content-around"
                style={{ rowGap: "30px" }}
              >
                {!checkPermFromRole(user.roleValue, ActionPerm.UserCreate) ? (
                  <UnauthPnl />
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Kullanıcı Adı"
                      className="col-5 create-doc-inp"
                      value={newUser.username ?? ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Parola"
                      className="col-5 create-doc-inp"
                      value={newUser.password ?? ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Adı"
                      className="col-5 create-doc-inp"
                      value={newUser.name ?? ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Soyadı"
                      className="col-5 create-doc-inp"
                      value={newUser.surname ?? ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, surname: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="E-Posta Adresi"
                      className="col-5 create-doc-inp"
                      value={newUser.email ?? ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                    <select
                      className="create-doc-inp col-5"
                      onChange={(e) =>
                        setNewUser({ ...newUser, roleId: e.target.value })
                      }
                      value={newUser.roleId}
                    >
                      <option value={null}>Rol Seçilmedi</option>
                      {roles.map((role, index) => (
                        <option key={index} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <button className="print-btn2 col-12" onClick={addUser}>
                      Kaydet
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card" style={{ position: "sticky", top: "50px" }}>
              <div className="card-header create-doc-card-header">Rol Ekle</div>
              <div className="card-body py-3 px-4 row">
                {!checkPermFromRole(user.roleValue, ActionPerm.RoleManage) ? (
                  <UnauthPnl />
                ) : (
                  <>
                    <div
                      className="col-6 col-sm-4 py-5"
                      style={{
                        rowGap: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Yeni Rol Adı"
                        className="col-12 create-doc-inp"
                        value={newRole.name}
                        onChange={(e) =>
                          setNewRole({ ...newRole, name: e.target.value })
                        }
                      />
                      <button
                        className="print-btn2"
                        style={{ height: "50px" }}
                        onClick={addRole}
                      >
                        Kaydet
                      </button>
                    </div>
                    <div
                      className="row col-6 col-sm-8 align-items-center"
                      style={{ rowGap: "10px" }}
                    >
                      {Object.entries(ActionPerm)
                        .slice(1)
                        .map(([key, value]) => (
                          <div key={value}>
                            <input
                              onChange={(e) =>
                                handleRoleCreatePermChange(
                                  value,
                                  e.target.checked,
                                )
                              }
                              style={{ marginRight: "5px" }}
                              type="checkbox"
                            />
                            <label>{getPermTitle(value)}</label>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header create-doc-card-header">
                Kullanıcı Listesi
              </div>
              <div className="card-body py-3 px-4 row">
                {!checkPermFromRole(user.roleValue, ActionPerm.UserModify) ? (
                  <UnauthPnl />
                ) : (
                  <>
                    <table className="table table-bordered table-striped mt-5">
                      <thead>
                        <tr>
                          <th className="purple-text">Kullanıcı Adı</th>
                          <th className="purple-text">Ad Soyad</th>
                          <th className="purple-text">Rol</th>
                          <th className="purple-text">E-Posta Adresi</th>
                          <th className="purple-text">Kayıt Tarihi</th>
                          <th className="purple-text">İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((user) => {
                            const role = roles.find(
                              (r) => r.id === user.roleId,
                            );
                            const roleName = role ? role.name : "Bilinmiyor";

                            return (
                              <tr key={user.uid}>
                                <td>{user.username}</td>
                                <td>{user.name + " " + user.surname}</td>
                                <td>{roleName}</td>
                                <td>{user.email}</td>
                                <td>
                                  {new Date(user.regDate).toLocaleDateString()}
                                </td>
                                <td>
                                  <button
                                    onClick={() => HandleDeleteUser(user.uid)}
                                    className="edit-btn"
                                  >
                                    Sil
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              Kullanıcı bulunamadı
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header create-doc-card-header">
                Rol Listesi
              </div>
              <div className="card-body px-5 row">
                {!checkPermFromRole(user.roleValue, ActionPerm.UserCreate) ? (
                  <UnauthPnl />
                ) : (
                  <>
                    <table className="table table-bordered table-striped mt-5">
                      <thead>
                        <tr>
                          <th className="purple-text">Rol Adı</th>
                          <th className="purple-text">Rol Yetkileri</th>
                          <th className="purple-text">İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles.length > 0 ? (
                          roles.map((role) => (
                            <tr key={role.id}>
                              <td>{role.name}</td>
                              <td>{role.name}</td>
                              <td>
                                <button
                                  onClick={() => HandleDeleteRole(role.id)}
                                  className="edit-btn"
                                >
                                  Sil
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              Rol bulunamadı
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header create-doc-card-header">
                Manuel Mail Gönder
              </div>
              <div className="card-body px-5 row">
                {!checkPermFromRole(user.roleValue, ActionPerm.SendMail) ? (
                  <UnauthPnl />
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        alignItems: "start",
                      }}
                    >
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
                        style={{ minHeight: "100px" }}
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
                        className="print-btn2 col-2"
                        onClick={sendManuelMailButtonClicked}
                      >
                        Gönder
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header create-doc-card-header">
                Manuel Mail Listesi
              </div>
              <div className="card-body px-5 row">
                {!checkPermFromRole(user.roleValue, ActionPerm.SendMail) ? (
                  <UnauthPnl />
                ) : (
                  <>
                    <table className="table table-bordered table-striped mt-5">
                      <thead>
                        <tr>
                          <th className="purple-text">Alıcı</th>
                          <th className="purple-text">Başlık</th>
                          <th className="purple-text">Tarih</th>
                        </tr>
                      </thead>
                      <tbody>
                        {manuelMails && manuelMails.length > 0 ? (
                          manuelMails.map((mail, index) => (
                            <tr key={index}>
                              <td>{mail.recipient}</td>
                              <td>{mail.title}</td>
                              <td>
                                {formatLocalDate(
                                  utcToLocal(new Date(mail.date)),
                                )}
                              </td>
                              <td>
                                <button
                                  onClick={() => {
                                    deleteManuelMail(mail.id);
                                    setManuelMails(
                                      manuelMails.filter(
                                        (m) => m.id !== mail.id,
                                      ),
                                    );
                                  }}
                                  className="edit-btn"
                                >
                                  Sil
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              Planlanmış mail bulunamadı
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
