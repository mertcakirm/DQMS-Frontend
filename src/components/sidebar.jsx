import "./css/sidebar.css";
import SidebarGeneral from "./sidebarchild/sidebar-general.jsx";
import SidebarInstitutional from "./sidebarchild/sidebar-institutional.jsx";
import { eraseCookie } from "../API/constants.js";
import { useContext, useEffect, useState } from "react";
import { getUserPfp } from "../API/User.js";
import logo from "../assets/logo1.png";
import {
  ActionPerm,
  checkPerms,
  checkPermsFromRole,
} from "../API/permissions.js";
import { SidebarDataContext, UserContext } from "../App.jsx";

const Sidebar = () => {
  const [profileImage, setProfileImage] = useState("");
  const user = useContext(UserContext);
  const LogOut = () => {
    eraseCookie("token");
    document.location = "/";
  };

  const sidebarData = useContext(SidebarDataContext);
  sidebarData.refresher = () => {
    (async () => {
      const pfpResult = await getUserPfp();
      setProfileImage(
        `data:image/${pfpResult.FileExtension};base64,${pfpResult.data}`,
      );
    })();
  };

  useEffect(() => {
    sidebarData.refresher();
  }, []);

  return (
    <div className="sidebar-container">
      <div style={{ display: "flex", flexDirection: "column", rowGap: "30px" }}>
        <div className="sidebar-header">
          <a className="default-a" href="/anasayfa">
            <img src={logo} alt="logo" className="img-fluid" width="110" />
          </a>
          <div className="sidebar-header-child">
            {checkPermsFromRole(user.roleValue, [
              ActionPerm.UserCreate,
              ActionPerm.RoleManage,
              ActionPerm.UserModify,
            ]) && (
              <a href="/admin-panel">
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 32 32"
                  id="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="url(#paint0_linear_353_1568)"
                >
                  <defs>
                    <linearGradient
                      id="paint0_linear_353_1568"
                      x1="19.0003"
                      y1="5.83331"
                      x2="19.0003"
                      y2="34.1666"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#17199F"></stop>
                      <stop offset="1" stopColor="#D232AF"></stop>
                    </linearGradient>
                  </defs>
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M16,30,9.8242,26.7071A10.9815,10.9815,0,0,1,4,17V4A2.0022,2.0022,0,0,1,6,2H26a2.0022,2.0022,0,0,1,2,2V17a10.9815,10.9815,0,0,1-5.8242,9.7069ZM6,4V17a8.9852,8.9852,0,0,0,4.7656,7.9423L16,27.7333l5.2344-2.791A8.9852,8.9852,0,0,0,26,17V4Z"></path>
                    <path d="M16,25.277V6h8V16.8048a7,7,0,0,1-3.7,6.1731Z"></path>
                    <rect
                      id="_Transparent_Rectangle_"
                      data-name="<Transparent Rectangle>"
                      className="cls-1"
                      width="32"
                      height="32"
                      fill="none"
                    ></rect>
                  </g>
                </svg>
              </a>
            )}
            <a href="/revizyonlarim">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="paint0_linear_353_1568"
                    x1="19.0003"
                    y1="5.83331"
                    x2="19.0003"
                    y2="34.1666"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#17199F"></stop>
                    <stop offset="1" stopColor="#D232AF"></stop>
                  </linearGradient>
                </defs>
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeWidth="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    opacity="1"
                    d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                  ></path>
                  <path
                    d="M10.5 14L17 14"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                  <path
                    d="M7 14H7.5"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                  <path
                    d="M7 10.5H7.5"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                  <path
                    d="M7 17.5H7.5"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                  <path
                    d="M10.5 10.5H17"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                  <path
                    d="M10.5 17.5H17"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                  <path
                    d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                  ></path>
                </g>
              </svg>
            </a>
            <a href="/ajanda">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="paint0_linear_353_1568"
                    x1="19.0003"
                    y1="5.83331"
                    x2="19.0003"
                    y2="34.1666"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#17199F"></stop>
                    <stop offset="1" stopColor="#D232AF"></stop>
                  </linearGradient>
                </defs>
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M7 4V2.5"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M17 4V2.5"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                  <path
                    opacity="0.8"
                    d="M2.5 9H21.5"
                    stroke="url(#paint0_linear_353_1568)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                  <path
                    d="M18 17C18 17.5523 17.5523 18 17 18C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16C17.5523 16 18 16.4477 18 17Z"
                    fill="#17199F"
                  ></path>
                  <path
                    d="M18 13C18 13.5523 17.5523 14 17 14C16.4477 14 16 13.5523 16 13C16 12.4477 16.4477 12 17 12C17.5523 12 18 12.4477 18 13Z"
                    fill="#17199F"
                  ></path>
                  <path
                    d="M13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17Z"
                    fill="#17199F"
                  ></path>
                  <path
                    d="M13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13Z"
                    fill="#17199F"
                  ></path>
                  <path
                    d="M8 17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17C6 16.4477 6.44772 16 7 16C7.55228 16 8 16.4477 8 17Z"
                    fill="#17199F"
                  ></path>
                  <path
                    d="M8 13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13C6 12.4477 6.44772 12 7 12C7.55228 12 8 12.4477 8 13Z"
                    fill="#17199F"
                  ></path>
                </g>
              </svg>
            </a>
            <a className="sidebar-profile-link" href="/profilim">
              <img src={profileImage}></img>
            </a>
          </div>
        </div>
        <div className="sidebar-body">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            <SidebarGeneral />
            <SidebarInstitutional />
          </div>
        </div>
      </div>
      <button className="cikis-yap-btn" onClick={LogOut}>
        <svg
          style={{ marginRight: "5px" }}
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path d="M11 21h8.033v-2l1-1v4h-9.033v2l-10-3v-18l10-3v2h9.033v5l-1-1v-3h-8.033v18zm-1 1.656v-21.312l-8 2.4v16.512l8 2.4zm11.086-10.656l-3.293-3.293.707-.707 4.5 4.5-4.5 4.5-.707-.707 3.293-3.293h-9.053v-1h9.053z" />
        </svg>
        Çıkış Yap
      </button>
    </div>
  );
};

export default Sidebar;
