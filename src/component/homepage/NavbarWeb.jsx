import React, { useEffect, useState, useRef } from "react";
import image1 from "../../assestss/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Flag from "../../assestss/Frame2.png";
import imagelogouser from "../../assestss/logoasia.png";
import axios from "axios";
import "./NavbarWeb.css";

// Material UI Icons
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

export default function Navbar() {
  const location = useLocation();

  // Check if the current path matches the given path
  const isActive = (path) => location.pathname === path;
  const [addFreightVisible, setAddFreightVisible] = useState(true);
  const handleNavigate = () => {
    setAddFreightVisible(false);
    if (localStorage.getItem("data") === null || undefined) {
      navigate("/login");
      toast.error("!!! Please Login !!!");
    } else {
      setAddFreightVisible(false);
      navigate("/addfreight");
    }
  };
  const userId = JSON.parse(localStorage.getItem("data") || "{}")?.id;
  const handleNavigatecleanence = () => {
    navigate("/Clearence-order");
  };
  const [userData, setUserData] = useState({});
  const [data, setData] = useState([]);
  const [countdatat, setCountdatat] = useState({});
  
  // React dropdown state
  const [showNoti, setShowNoti] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notiRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("data") || "{}");
  const userid = user?.id;

  const handleclicknavi = () => {
    if (!userid) return;
    axios
      .post(`${process.env.REACT_APP_BASE_URL}notification-users`, {
        user_id: userid,
      })
      .then((response) => {
        setCountdatat(response.data || {});
        setData(response.data?.data || []);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load notifications");
      });
  };

  const handleToggleNoti = (e) => {
    e.stopPropagation();
    setShowNoti((prev) => !prev);
    setShowProfile(false);
    if (!showNoti) {
      onclicgdgdnotification();
      handleclicknavi();
    }
  };

  const handleToggleProfile = (e) => {
    e.stopPropagation();
    setShowProfile((prev) => !prev);
    setShowNoti(false);
  };

  const handleclicklogout = () => {
    setShowProfile(false);
    navigate("/login");
    localStorage.clear();
  };

  const fetchData = () => {
    if (!userid) return;
    axios
      .post(`${process.env.REACT_APP_BASE_URL}client-details`, {
        client_id: userid,
      })
      .then((response) => {
        setUserData(response?.data?.data || {});
      })
      .catch((error) => {
        console.log(error?.response?.data?.message);
      });
  };

  useEffect(() => {
    fetchData();
    handleclicknavi();

    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShowNoti(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userid]);

  const onclicgdgdnotification = () => {
    if (!userid) return;
    axios
      .post(`${process.env.REACT_APP_BASE_URL}notification-status`, { user_id: userid })
      .then((response) => {
        console.log(response.data?.data);
      })
      .catch((error) => {
        console.log(error?.response?.data);
      });
  };

  const [sidebar, setSidebar] = useState(false);
  const showSide = () => {
    setSidebar(true);
    document.body.classList.add("no-scroll");
  };

  const hideSide = () => {
    setSidebar(false);
    document.body.classList.remove("no-scroll");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary dash_nav orderDetalDrop">
        <div className="container-fluid">
          <Link className="navbar-brand py-0" to={"/"}>
            <img src={image1} alt="Asia Direct" />
          </Link>

          <div className="d-flex align-items-center">
            {userid && (
              <>
                {/* Notification Dropdown */}
                <div className="dropdown me-3 notiDropWrapper" ref={notiRef}>
                  <div
                    className="bellCircleWrapper"
                    role="button"
                    onClick={handleToggleNoti}
                  >
                    <i className="fi fi-ss-bell bellIconWhite" />
                    {countdatat?.unseenCount > 0 ? (
                      <span className="OneNot">
                        <small>{countdatat.unseenCount}</small>
                      </span>
                    ) : null}
                  </div>

                  {showNoti && (
                    <div className="customNotiDropdown">
                      <div className="customNotiHeader">
                        <h5 className="customNotiTitle">Notifications</h5>
                      </div>

                      <div className="customNotiScroll">
                        {data && data.length > 0 ? (
                          data.map((item, index) => (
                            <div
                              className="customNotiItem"
                              key={index}
                              onClick={() => {
                                setShowNoti(false);
                                navigate("/notification");
                              }}
                            >
                              <div className="customNotiIconBadge">
                                <NotificationsNoneOutlinedIcon style={{ fontSize: "1.15rem" }} />
                              </div>
                              <div className="customNotiContent">
                                <h6 className="customNotiItemTitle">{item?.title}</h6>
                                <p className="customNotiItemDesc">{item?.description}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="customNotiEmpty">
                            <p>No new notifications</p>
                          </div>
                        )}
                      </div>

                      <div
                        className="customNotiFooter"
                        onClick={() => {
                          setShowNoti(false);
                          navigate("/notification");
                        }}
                      >
                        <span>View all notifications</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="dropdown me-2 profileDropWrapper" ref={profileRef}>
                  <div
                    className="profileTriggerBtn"
                    role="button"
                    onClick={handleToggleProfile}
                  >
                    <img
                      src={
                        userData?.profile
                          ? `${process.env.REACT_APP_BASE_URL_image}${userData.profile}`
                          : imagelogouser
                      }
                      className="userAvatarImg"
                      alt="Profile"
                    />
                    <div className="profileTriggerText d-none d-md-flex">
                      <span
                        className="profileTriggerName"
                        style={{
                          color: "#0f172a",
                          fontWeight: 700,
                          fontSize: "13.5px",
                          lineHeight: "1.2",
                          display: "block",
                          textTransform: "capitalize",
                        }}
                      >
                        {userData?.full_name ||
                          userData?.client_name ||
                          userData?.name ||
                          userData?.contact_person ||
                          user?.full_name ||
                          user?.client_name ||
                          user?.name ||
                          user?.user_name ||
                          "User"}
                      </span>
                      <span
                        className="profileTriggerEmail"
                        style={{
                          color: "#64748b",
                          fontSize: "11.5px",
                          lineHeight: "1.2",
                          display: "block",
                        }}
                      >
                        {userData?.email || user?.email || ""}
                      </span>
                    </div>
                    <KeyboardArrowDownIcon
                      className="profileTriggerArrow"
                      style={{
                        color: "#64748b",
                        transform: showProfile ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </div>

                  {showProfile && (
                    <div className="customProfileDropdown">
                      <div className="customProfileHeader">
                        <h6 className="customProfileHeaderName">
                          {userData?.full_name ||
                            userData?.client_name ||
                            userData?.name ||
                            userData?.contact_person ||
                            user?.full_name ||
                            user?.client_name ||
                            user?.name ||
                            user?.user_name ||
                            "User Account"}
                        </h6>
                        <p className="customProfileHeaderEmail">
                          {userData?.email || user?.email || ""}
                        </p>
                      </div>

                      <Link
                        className="customProfileItem"
                        to={"/My-profile"}
                        onClick={() => setShowProfile(false)}
                      >
                        <PersonOutlineOutlinedIcon className="customProfileItemIcon" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        className="customProfileItem"
                        to={"/order-details"}
                        onClick={() => setShowProfile(false)}
                      >
                        <LocalShippingOutlinedIcon className="customProfileItemIcon" />
                        <span>Freight Orders</span>
                      </Link>

                      <Link
                        className="customProfileItem"
                        to={"/Clearence-order"}
                        onClick={() => {
                          setShowProfile(false);
                          handleNavigatecleanence();
                        }}
                      >
                        <DescriptionOutlinedIcon className="customProfileItemIcon" />
                        <span>Clearance Orders</span>
                      </Link>

                      <Link
                        className="customProfileItem"
                        to={"/Changepassword"}
                        onClick={() => setShowProfile(false)}
                      >
                        <LockOutlinedIcon className="customProfileItemIcon" />
                        <span>Change Password</span>
                      </Link>

                      <Link
                        className="customProfileItem"
                        to={"/QuotationInFreight"}
                        onClick={() => setShowProfile(false)}
                      >
                        <ChatBubbleOutlineOutlinedIcon className="customProfileItemIcon" />
                        <span>Chat</span>
                      </Link>

                      <div
                        className="customProfileItem logoutItem"
                        onClick={handleclicklogout}
                        role="button"
                      >
                        <LogoutOutlinedIcon className="customProfileItemIcon" />
                        <span>Logout</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="mobileSide" onClick={showSide}>
              <i className="fi fi-br-menu-burger navbar-toggler-icon"></i>
            </div>

            <div className={`openSide ${sidebar ? "active" : ""}`}>
              <div className="opeSideCon">
                <div className="timesSide">
                  <i onClick={hideSide}>&times;</i>
                </div>
                <ul>
                  <li className="sidebar-item">
                    <p
                      className={`sidebar-link sidebar-link link_sidebar ${
                        isActive("/freight-details") ? "active" : ""
                      }`}
                      onClick={() => navigate("/freight-details")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fi fi-rs-truck-moving"></i>
                      <span className="hide-menu">Freight</span>
                    </p>
                  </li>
                  <li className="sidebar-item">
                    <p
                      className={`sidebar-link sidebar-link link_sidebar`}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fi fi-rs-dolly-flatbed-alt"></i>
                      <span
                        className="hide-menu"
                        onClick={() => navigate("/order-details")}
                      >
                        Freight Order
                      </span>
                    </p>
                  </li>
                  <li className="sidebar-item">
                    <p
                      className={`sidebar-link sidebar-link link_sidebar ${
                        isActive("/Custom-clearence") ? "active" : ""
                      }`}
                      onClick={() => navigate("/Custom-clearence")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fi fi-rs-legal"></i>
                      <span className="hide-menu">Customs Clearance</span>
                    </p>
                  </li>
                  <li className="sidebar-item">
                    <p
                      className={`sidebar-link sidebar-link link_sidebar ${
                        isActive("/Clearence-order") ? "active" : ""
                      }`}
                      onClick={() => navigate("/Clearence-order")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fi fi-rs-document-signed"></i>
                      <span className="hide-menu">Customs Order</span>
                    </p>
                  </li>
                  <li className="sidebar-item">
                    <p
                      className={`sidebar-link sidebar-link link_sidebar ${
                        isActive("/Tracking") ? "active" : ""
                      }`}
                      onClick={() => navigate("/Tracking")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fi fi-rs-location-alt"></i>
                      <span className="hide-menu">Tracking</span>
                    </p>
                  </li>
                  <li className="sidebar-item">
                    <p
                      className={`sidebar-link sidebar-link link_sidebar ${
                        isActive("/My-profile") ? "active" : ""
                      }`}
                      onClick={() => navigate("/My-profile")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fi fi-rr-settings"></i>
                      <span className="hide-menu">Settings</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
