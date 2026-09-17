import axios from "axios";
import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "../MyContext";
import image2 from "../assestss/logo.png";
import imagelogouser from "../assestss/logoasia.png";
import "./homepage/NavbarWeb.css";

// Material UI Icons
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

export default function Topbar() {
  const { text, setText } = useContext(MyContext);
  const [userData, setUserData] = useState({});
  const [data, setData] = useState([]);
  const [countdatat, setCountdatat] = useState({});
  
  // React dropdown state
  const [showNoti, setShowNoti] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notiRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();

  const hanldeclicklogin = () => {
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("data") || "{}");
  const userid = user?.id;

  const handleclicknavi = () => {
    if (!userid) {
      navigate("/login");
    } else {
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
    }
  };

  const handleToggleNoti = (e) => {
    e.stopPropagation();
    setShowNoti((prev) => !prev);
    setShowProfile(false);
    if (!showNoti) {
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
    localStorage.clear();
    navigate("/login");
  };

  const fetchData = () => {
    const user = JSON.parse(localStorage.getItem("data") || "{}");
    if (!user?.id) return;
    axios
      .post(`${process.env.REACT_APP_BASE_URL}client-details`, {
        client_id: user.id,
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
    if (userid) {
      handleclicknavi();
    }

    // Click outside listener to close dropdowns
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

  return (
    <div>
      <section className="topBar">
        <div className="container custom-header-container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-sm-6 col-5">
              <div className="topParentLeft">
                <div className="nav_img1">
                  <Link className="navbar-brand py-0" to={"/"}>
                    <img src={image2} alt="Asia Direct" />
                  </Link>
                </div>
                <div className="topLeftChild d-none d-md-flex">
                  <p>
                    <i className="fi fi-ss-envelope topbarRedIcon" />{" "}
                    <span>sa@asiadirect.africa</span>
                  </p>
                </div>
                <span className="topbarDivider d-none d-md-inline">|</span>
                <div className="topLeftChild d-none d-md-flex">
                  <p>
                    <i className="fi fi-rs-marker topbarRedIcon" />
                    <span>Johannesburg, South Africa</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-sm-6 col-7">
              <div className="topRightParent" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "14px" }}>
                <div className="topRightPhone d-none d-lg-block">
                  <p style={{ color: "#ffffff", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fi fi-rr-phone-call topbarRedIcon" style={{ color: "#e11d48", fontSize: "14px" }} />{" "}
                    <span style={{ color: "#ffffff", fontWeight: 600, fontSize: "13.5px", letterSpacing: "0.03em" }}>
                      +27 10 448 0733
                    </span>
                  </p>
                </div>

                {userid ? (
                  <>
                    <span className="topbarDivider d-none d-lg-inline" style={{ color: "rgba(255, 255, 255, 0.25)" }}>|</span>

                    {/* Notification Dropdown */}
                    <div className="notiDropWrapper" ref={notiRef}>
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

                    {/* Profile Dropdown - Circular Avatar Only */}
                    <div className="profileDropWrapper" ref={profileRef}>
                      <div
                        className="profileTriggerBtn"
                        role="button"
                        onClick={handleToggleProfile}
                        style={{ padding: 0 }}
                      >
                        <img
                          className="userAvatarImg"
                          src={
                            userData?.profile
                              ? `${process.env.REACT_APP_BASE_URL_image}${userData?.profile}`
                              : imagelogouser
                          }
                          alt="profile"
                        />
                      </div>

                      {showProfile && (
                        <div className="customProfileDropdown">
                          {/* User info header inside dropdown */}
                          <div className="customProfileHeader">
                            <h6 className="customProfileHeaderName">
                              {userData?.full_name || userData?.client_name || user?.full_name || user?.client_name || "User Account"}
                            </h6>
                            <p className="customProfileHeaderEmail">
                              {userData?.email || user?.email || ""}
                            </p>
                          </div>

                          {/* List items with icons */}
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
                            onClick={() => setShowProfile(false)}
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
                ) : (
                  <div>
                    <button
                      className="px-4 py-1 rounded"
                      style={{ backgroundColor: "#d01b20", color: "white" }}
                      onClick={hanldeclicklogin}
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
