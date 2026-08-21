import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "../MyContext";
import image2 from "../assestss/logo.png";
import imagelogouser from "../assestss/logoasia.png";
import "./homepage/NavbarWeb.css";
export default function Topbar() {
  const { text, setText } = useContext(MyContext);
  const [userData, setUserData] = useState({});
  const [data, setData] = useState([]);
  const [countdatat, setCountdatat] = useState({});
  const navigate = useNavigate();

  const hanldeclicklogin = () => {
    navigate("/login");
  };

  const handlkecloick = () => {
    navigate("/notification");
  };
  const user = JSON.parse(localStorage.getItem("data"));
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
          console.log(response.data);
          setCountdatat(response.data);
          setData(response.data.data);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };

  const handleclicklogout = () => {
    console.log("a");
    navigate("/login");
    localStorage.clear();
  };

  const fetchData = () => {
    const user = JSON.parse(localStorage.getItem("data"));
    axios
      .post(`${process.env.REACT_APP_BASE_URL}client-details`, {
        client_id: user?.id,
      })
      .then((response) => {
        console.log(  response?.data?.data);
        setUserData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <section className="topBar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-sm-8 col-6 ">
              <div className="topParentLeft">
                <div className="nav_img1">
                  <Link className="navbar-brand py-0" to={"/"}>
                    <img src={image2} alt="hello" />
                  </Link>
                </div>
                <div className="topLeftChild">
                  <p>
                    <i className="fi fi-ss-envelope" />{" "}
                    <span>sa@asiadirect.africa </span>
                  </p>
                </div>
                <div className="topLeftChild">
                  <p>
                    <i className="fi fi-rs-marker" />
                    <span> Johannesburg, South Africa</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-sm-4 col-6 ">
              <div className="topRightParent">
                <div className="topLeftChild d-none   d-lg-block">
                  <p>
                    <i className="fi fi-rr-phone-call" />{" "}
                    <span> +27 10 448 0733 </span>
                  </p>
                </div>
                <div>
                  {userid ? (
                    <li
                      className="nav-item dropdown  notiDrop"
                      onClick={handleclicknavi}
                    >
                      <a
                        className=""
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="bellIcon">
                          <i className="fi fi-ss-bell mx-4"></i>
                          {countdatat.unseenCount ? (
                            <span className="OneNot">
                              <small>{countdatat.unseenCount}</small>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </a>
                      <ul className="dropdown-menu sidebar123 drop_noti notifi_view">
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
                          <button onClick={handlkecloick}>
                            {" "}
                            View all notification
                          </button>
                        </div>
                      </ul>
                    </li>
                  ) : (
                    <p></p>
                  )}
                </div>
                {userid ? (
                  <div>
                    <li className="nav-item dropdown dropImg">
                      <a
                        className=""
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ cursor: "pointer" }}
                      >
                        {/* {userData.profile=="" ? (
                          // <img src={imagelogo} alt="dfsdfsf" />
                            <img
                            src={`${process.env.REACT_APP_BASE_URL_image}${imagelogouser}`}
                            alt="dfsdfsf"
                          />
                        
                        ) : (
                          <img
                            src={`${process.env.REACT_APP_BASE_URL_image}${userData?.profile}`}
                            alt="df"
                          />
                        )} */}
                     
                     {userData?.profile ? (
  <img
    src={`${process.env.REACT_APP_BASE_URL_image}${userData?.profile}`}
    alt="profile"
  />
) : (
  <img
    src={imagelogouser}
    alt="default-profile"
  />
)}
                     
                      </a>
                      <ul className="dropdown-menu menu_item profile_view">
                        <li>
                          <Link
                            className="dropdown-item list_item"
                            to={"/My-profile"}
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
                        {/* <li><Link className="dropdown-item list_item" to={'/invoices'} >Invoices</Link></li> */}
                        {/* <li><Link className="dropdown-item" to={"/Custom-clearence"}>My Clearances</Link></li> */}
                        <li>
                          <Link
                            className="dropdown-item list_item"
                            to={"/Clearence-order"}
                          >
                            Clearance Orders
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
                          <Link
                            className="dropdown-item list_item"
                            to={"/QuotationInFreight"}
                          >
                            Chat
                          </Link>
                        </li>
                        {/* <li><Link className="dropdown-item list_item drop_item1" onClick={handleclicklogout}>Logout</Link></li> */}
                        <li>
                          <span
                            className="dropdown-item list_item"
                            onClick={handleclicklogout}
                          >
                            Logout
                          </span>
                        </li>
                      </ul>
                    </li>
                  </div>
                ) : (
                  <div style={{ width: "50px", height: "30px" }}>
                    <button
                      className="px-4 py-1 rounded"
                      style={{ backgroundColor: "#d01b20", color: "white " }}
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
