import React, { useEffect, useState } from "react";
import image1 from "../../assestss/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Flag from "../../assestss/Frame2.png";
import imagelogouser from "../../assestss/logoasia.png";
import axios from "axios";
import "./NavbarWeb.css";
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
  const userId = JSON.parse(localStorage.getItem("data"))?.id;
  const handleNavigatecleanence = () => {
    navigate("/Clearence-order");
  };
  const [userData, setUserData] = useState({});
  const [data, setData] = useState([]);
  const [countdatat, setCountdatat] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("data"));
  const userid = user?.id;
  const handleclicknavi = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}notification-users`, {
        user_id: userid,
      })
      .then((response) => {
        console.log(response.data);
        setCountdatat(response.data);
        setData(response.data.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  const handleclicklogout = () => {
    console.log("A");
    navigate("/login");
    localStorage.clear();
  };
  const user1 = JSON.parse(localStorage.getItem("data"));
  const fetchData = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}client-details`, {
        client_id: user1?.id,
      })
      .then((response) => {
        console.log(response.data.data);
        setUserData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  useEffect(() => {
    fetchData();
    handleclicknavi();
  }, []);
  const onclicgdgdnotification = () => {
    const data12 = {
      user_id: user1.id,
    };
    axios
      .post(`${process.env.REACT_APP_BASE_URL}notification-status`, data12)
      .then((response) => {
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  //
  const [sidebar, setSidebar] = useState(false);
const showSide = () => {
  setSidebar(true);
  document.body.classList.add("no-scroll"); // stop page scroll
};

const hideSide = () => {
  setSidebar(false);
  document.body.classList.remove("no-scroll"); // re-enable page scroll
};
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary dash_nav orderDetalDrop">
        <div className="container-fluid">
          <Link className="navbar-brand py-0" to={"/"}>
            <img src={image1} alt="hello" />
          </Link>

          <div className="d-flex">
            <div
              className="bell_icon mx-4 dropdown"
              style={{ cursor: "pointer" }}
            >
              <i
                className="fi fi-ss-bell noti_icon"
                data-bs-toggle="dropdown"
                onClick={onclicgdgdnotification}
                aria-expanded="false"
              ></i>
              {countdatat?.unseencount == 0 ? (
                <span>{countdatat?.unseenCount}</span>
              ) : (
                ""
              )}
              <ul className="dropdown-menu dropdown-menu-end sidebar123  notificationFreight">
                <h5 className="noti_cation">Notification</h5>
                <div className="scrollNoti">
                  {data && data.length > 0 ? (
                    data.map((item, index) => (
                      <div className="notidropparent" key={index}>
                        <div>
                          <h6 className="text-dark text-capitalize">
                            {item?.title}
                          </h6>
                          <p>{item?.description}</p>
                        </div>
                        <div className="dateTopNoti"></div>
                      </div>
                    ))
                  ) : (
                    <div>
                      {data.length === 0 ? (
                        <p
                          className="fw-bold text-center"
                          style={{ marginTop: "100px" }}
                        >
                          No notifications
                        </p>
                      ) : (
                        <p>One notification</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="btnShowAll">
                  <button>View all notification</button>
                </div>
              </ul>
            </div>
            <div className="dropdown me-2" style={{ cursor: "pointer" }}>
              <a
                className="d-flex align-items-center"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={
                    userData?.profile
                      ? `${process.env.REACT_APP_BASE_URL_image}${userData.profile}`
                      : imagelogouser
                  }
                  className="pro_img"
                  alt="Profile"
                />
                <div className="ms-2">
                  <p className="pro_para">{userData?.full_name}</p>
                  <p className="pro_para">{userData?.email}</p>
                </div>
                <div className="ms-2">
                  <i className="fi fi-br-angle-small-down drop_icon"></i>
                </div>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end menu_item"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <Link
                    className="dropdown-item list_item"
                    to={"/My-profile"}
                    onClick={() => {
                      navigate("/My-profile");
                    }}
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item list_item"
                    to={"/order-details"}
                  >
                    Freight Orders
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item list_item"
                    to={"/Clearence-order"}
                    onClick={handleNavigatecleanence}
                  >
                    Clearance Order
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item list_item"
                    to={"/Changepassword"}
                  >
                    Change Password
                  </Link>
                </li>
                <li>
                  <div
                    className="dropdown-item list_item drop_item1"
                    onClick={handleclicklogout}
                  >
                    Logout
                  </div>
                </li>
              </ul>
            </div>
            <div className="mobileSide" onClick={showSide}>
              <i className="fi fi-br-menu-burger navbar-toggler-icon"></i>
            </div>
            {/* {sidebar && ( */}
              <div className={`openSide ${sidebar?"active":""}`}>
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
                        <i class="fi fi-rs-dolly-flatbed-alt"></i>
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
                        <i class="fi fi-rs-legal"></i>
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
                        <i class="fi fi-rs-location-alt"></i>
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
            {/* // )} */}
          </div>
        </div>
      </nav>
    </div>
  );
}
