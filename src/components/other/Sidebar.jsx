import React, {useContext} from 'react';
import logo from "../../assets/logo1.png";
import SidebarGeneral from "../sidebarchild/sidebar-general.jsx";
import SidebarInstitutional from "../sidebarchild/sidebar-institutional.jsx";
import SidebarUnit from "../sidebarchild/SidebarUnit.jsx";
import {ActionPerm, checkPermsFromRole} from "../../API/permissions.js";
import {UserContext} from "../../App.jsx";

const Sidebar = () => {
    const user = useContext(UserContext);

    return (
    <div className="offcanvas offcanvas-start sidebar-container" data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop"
         aria-labelledby="staticBackdropLabel">
        <div className="offcanvas-header py-0 px-3">
            <a className="default-a offcanvas-header px-0"  href="/anasayfa">
                <img src={logo} alt="logo" width="80" />
            </a>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
            <div className="sidebar-body">
                <div className="accordion accordion-flush" id="accordionFlushExampleParent">
                    <SidebarGeneral />

                    {checkPermsFromRole(user.roleValue, [
                        ActionPerm.DocumentRevisionCreate,
                    ]) && (
                        <SidebarInstitutional />
                    )}


                    {checkPermsFromRole(user.roleValue, [
                        ActionPerm.UserCreate,
                        ActionPerm.RoleManage,
                        ActionPerm.UserModify,
                    ]) && (
                    <SidebarUnit />
                    )}

                </div>
            </div>
        </div>
    </div>
)
    ;
};

export default Sidebar;