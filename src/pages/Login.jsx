import "./css/login.css";
import { useEffect, useState } from "react";
import bg from "../assets/login.png";
import { apiHost, eraseCookie, setCookie } from "../API/constants.js";
import { useNavigate } from "react-router-dom";
import {
  checkCode,
  getSelf,
  resetPwdWithVerification,
  sendPwdResetCode,
} from "../API/User.js";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();
  const [resetPwd, setResetPwd] = useState(null);

  const login = async (e) => {
    e.preventDefault();

    if (resetPwd == null) {
      const loginDTO = {
        username: username,
        password: password,
      };
      try {
        const response = await fetch(apiHost + "/api/users/self/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginDTO),
        });

        if (response.ok) {
          const token = await response.text();
          setCookie("token", token);
          document.location.href = "/anasayfa";
        } else {
          // Handle different error responses and set the error message accordingly
          const errorData = await response.json();
          console.log(errorData.message);
          setErrorMessage(
            "Kullanıcı adı veya parola yanlış. Lütfen tekrar deneyin",
          ); // Set custom error message
        }
      } catch (error) {
        console.error("There was an error!", error);
        setErrorMessage(
          "Kullanıcı adı veya parola yanlış. Lütfen tekrar deneyin",
        ); // General error message
      }
    } else if (resetPwd.state === 0) {
      const codeId = await sendPwdResetCode(resetPwd.userValue);

      if (codeId == null) {
        setErrorMessage("Kullanıcı bulunamadı!");
        return;
      }

      setErrorMessage("");
      setResetPwd((prev) => ({ ...prev, state: 1, codeId: codeId }));
    } else if (resetPwd.state === 1) {
      const codeId = await checkCode(resetPwd.codeId, resetPwd.code);

      if (codeId === false) {
        setErrorMessage("Kod hatalı!");
        return;
      }

      setErrorMessage("");
      setResetPwd((prev) => ({ ...prev, state: 2 }));
    } else if (resetPwd.state === 2) {
      if (resetPwd.pwd.length === 0) return;

      setErrorMessage("");
      await resetPwdWithVerification(
        resetPwd.codeId,
        resetPwd.code,
        resetPwd.pwd,
      );

      setResetPwd(null);
    }
  };

  useEffect(() => {
    eraseCookie("token");
    const checkAuthentication = async () => {
      const user = await getSelf();
      setIsAuthenticated(!!user);
    };
    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    navigate("/anasayfa");
    return null;
  }

  return (
    <div className="container-fluid row justify-content-center align-items-center login-container">
      <img className="login-bg img-fluid w-100" src={bg} alt="background" />
      <form
        className="col-lg-6 col-lg-4 p-5 login-form row text-center justify-content-center"
        onSubmit={login}
        data-aos="fade-up"
      >
        <h4 className="login-form-header">QDMS SİSTEMİNE HOŞGELDİNİZ</h4>
        {errorMessage && (
          <div className="alert login-alert mt-3" role="alert">
            {errorMessage}
          </div>
        )}

        {resetPwd == null && (
          <>
            <div className="input-group mb-3 mt-4 col-8">
              <span
                className="input-group-text login-inp-span"
                id="basic-addon1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  fill="white"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 7.001c0 3.865-3.134 7-7 7s-7-3.135-7-7c0-3.867 3.134-7.001 7-7.001s7 3.134 7 7.001zm-1.598 7.18c-1.506 1.137-3.374 1.82-5.402 1.82-2.03 0-3.899-.685-5.407-1.822-4.072 1.793-6.593 7.376-6.593 9.821h24c0-2.423-2.6-8.006-6.598-9.819z" />
                </svg>
              </span>
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="form-control login-inp"
                placeholder="Kullanıcı Adı"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div>
            <div className="input-group mb-3 col-8">
              <span
                className="input-group-text login-inp-span"
                id="basic-addon2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z" />
                </svg>
              </span>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="form-control login-inp"
                placeholder="Parola"
                aria-label="password"
                aria-describedby="basic-addon2"
              />
            </div>
          </>
        )}
        {resetPwd != null && (
          <>
            <div className="input-group mb-3 mt-4 col-8">
              <span className="input-group-text login-inp-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  fill="white"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 7.001c0 3.865-3.134 7-7 7s-7-3.135-7-7c0-3.867 3.134-7.001 7-7.001s7 3.134 7 7.001zm-1.598 7.18c-1.506 1.137-3.374 1.82-5.402 1.82-2.03 0-3.899-.685-5.407-1.822-4.072 1.793-6.593 7.376-6.593 9.821h24c0-2.423-2.6-8.006-6.598-9.819z" />
                </svg>
              </span>
              <input
                type="text"
                className="form-control login-inp"
                placeholder="Kullanıcı Adı veya E-Posta"
                aria-label="Username or email"
                value={resetPwd.userValue}
                onChange={(e) => {
                  if (resetPwd.state === 0) {
                    setResetPwd((prev) => ({
                      ...prev,
                      userValue: e.target.value,
                    }));
                  }
                }}
              />
            </div>
            {resetPwd?.state >= 1 && (
              <div className="input-group mb-3 col-8">
                <span className="input-group-text login-inp-span">
                  <svg
                    width="24"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 5.5C16 8.53757 13.5376 11 10.5 11H7V13H5V15L4 16H0V12L5.16351 6.83649C5.0567 6.40863 5 5.96094 5 5.5C5 2.46243 7.46243 0 10.5 0C13.5376 0 16 2.46243 16 5.5ZM13 4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4Z"
                        fill="#FFFFFF"
                      ></path>{" "}
                    </g>
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-control login-inp"
                  placeholder="Şifre Sıfırlama Kodu"
                  aria-label="Code"
                  value={resetPwd.code}
                  onChange={(e) => {
                    if (resetPwd.state === 1) {
                      setResetPwd((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }));
                    }
                  }}
                />
              </div>
            )}
            {resetPwd?.state === 2 && (
              <div className="input-group mb-3 col-8">
                <span className="input-group-text login-inp-span">
                  <svg
                    width="24"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 5.5C16 8.53757 13.5376 11 10.5 11H7V13H5V15L4 16H0V12L5.16351 6.83649C5.0567 6.40863 5 5.96094 5 5.5C5 2.46243 7.46243 0 10.5 0C13.5376 0 16 2.46243 16 5.5ZM13 4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4Z"
                        fill="#FFFFFF"
                      ></path>{" "}
                    </g>
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-control login-inp"
                  placeholder="Yeni şifre"
                  aria-label="Code"
                  value={resetPwd.pwd}
                  onChange={(e) =>
                    setResetPwd((prev) => ({
                      ...prev,
                      pwd: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </>
        )}
        <button className="login-btn col-5 mt-3" type="submit">
          {resetPwd == null && "Giriş Yap"}
          {resetPwd && resetPwd.state === 0 && "Kod Gönder"}
          {resetPwd && resetPwd.state === 1 && "Kodu Doğrula"}
          {resetPwd && resetPwd.state === 2 && "Uygula"}
        </button>
        <p
          onClick={() => setResetPwd(resetPwd == null ? { state: 0 } : null)}
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "8px",
            cursor: "pointer",
            color: "rgb(230,230,230)",
          }}
        >
          {resetPwd == null && "Şifremi unuttum"}
          {resetPwd && "Giriş yap"}
        </p>
      </form>
    </div>
  );
};

export default Login;
