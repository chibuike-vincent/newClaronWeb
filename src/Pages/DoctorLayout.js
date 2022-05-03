import React, { useState, useEffect } from "react";

import { useNavigate, Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "../DoctorPages/Dashboard/Dashboard.css";
import * as API from "../Api/DoctorApi";
// PAGES IMPORTS
import docuser from "../images/doc-1.jpg";
import { FaCaretDown} from "react-icons/fa";
import { LOGOUT } from "../features/user";
import { useSelector, useDispatch } from "react-redux";
import Switch from "../DoctorPages/DocComponent/Switch";
function DoctorLayout({ children }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      const response = await API.getNotifications();
      console.log(response.length, "notifications");
      setNotifications(response);
    };

    getNotifications();
  }, []);

  const handleClick = (event) => {
    setOpen(!open);
  };
 
  const logOut = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("access-token");
    localStorage.removeItem("api-key");
    localStorage.removeItem("login-expiry");
    localStorage.removeItem("user");
    dispatch(LOGOUT());
    navigate("/");
  };

  return (
    <>
      <input type="checkbox" id="nav-toggle" />
      <div class="sidebar">
        <div className="profile-container doc-profile-container">
          <img
            src={userData.avatar !== "undefined" ? userData.avatar : docuser}
            alt=""
            className="user doc-picture"
          />
        </div>
        <div className="responsive-title">
          <p className="name">
            {userData ? userData.firstname : ""}{" "}
            {userData ? userData.lastname : null}
          </p>
          <p className="title">{userData.seniority}</p>
        </div>
        <div class="sidebar-menu">
          <ul>
            <li className="service-d">
              <Link to="/doctorDashboard">
                <span class="las la-table"></span>
                <span className="dash-mobile">Dashboard</span>
              </Link>
            </li>
            <li className="service-d">
              <Link to="/LabRequestUser">
                <span class="las la-stethoscope"></span>
                <span>Request Lab Test</span>
              </Link>
            </li>
            <li className="service-d">
              <Link to="/PrescribeDrugsUser">
                <span class="las la-capsules"></span>
                
                <span>Prescribe Drugs</span>
              </Link>
            </li>
            <li className="service-d">
              <Link to="/Consultations">
                <span class="las la-ambulance"></span>
                <span>Consultation</span>
              </Link>
            </li>

            <li className="service-d">
              <Link to="/DocWallet">
              <span class="las la-wallet"></span>
                <span>Wallet</span>
              </Link>
            </li>

            <li className="service-d">
              <a target="_blank" href="https://webapp.clarondoc.com:5501/">
              <span class="las la-info"></span>
                <span>Medical Reports</span>
              </a>
            </li>

          </ul>
        </div>
      </div>

      <div class="main-content">
        <header className="main-content-toggle">
          <div className="nav-okay">
            <label for="nav-toggle">
              <span class="las la-bars"></span>
            </label>
          </div>


            <Link to="/DoctorNotification" class="notification">
              <Badge badgeContent={notifications.length ? notifications.length : (<span>0</span>)} color="info">
                <NotificationsIcon color="action" />
              </Badge>
            </Link>
          

          <div class="user-wrapper">
            <Switch />
            <img
              src={userData.avatar !== "undefined" ? userData.avatar : docuser}
              width="40px"
              height="40px"
              alt="user"
            />
            <div>
              <div className="responsive-mobile-profile">
                <h4 onClick={handleClick}>Profile</h4>
                <FaCaretDown />
              </div>

              {open ? (
                <div className="hover-menu">
                  <Link to="/Settings">Settings</Link>
                  <Link to="/Availability">Availability</Link>
                  <Link to="/Terms">Terms and Condition</Link>
                  <span onClick={logOut}>Logout</span>
                
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </>
  );
}

export default DoctorLayout;
