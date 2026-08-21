import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import image1 from "../../assestss/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.css";

export default function Navbar() {
  const [addFreightVisible, setAddFreightVisible] = useState(true);
  const navigate = useNavigate();

  const handleNavigate = () => {
    setAddFreightVisible(false);
    if (localStorage.getItem("data") === null || undefined) {
      navigate("/login");
      toast.error("!!! Please Login !!!");
    } else {
      setAddFreightVisible(false); // Hide the button when navigating to '/addfreight'
      navigate("/addfreight");
    }
  };
  // const handleNavigateTracking = () => {
  //   navigate('/Tracking');
  // };

  const userId = JSON.parse(localStorage.getItem("data"))?.id;

  const handleNavigatecleanence = () => {
    navigate("/Add-Custom-clearence");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <Link className="navbar-brand py-0 nav_img" to={"/"}>
            <img src={image1} alt="hello" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fi fi-br-menu-burger navbar-toggler-icon"></i>
          </button>
          <div
            className="collapse navbar-collapse menu"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav m-auto mb-2 mb-lg-0">
              <li className="nav-item headNav">
                <NavLink activeClassName="active" to={"/"} aria-current="page">
                  Home
                </NavLink>
              </li>
              {userId && (
                <li className="nav-item headNav">
                  <NavLink activeClassName="active" to={"/freight-details"}>
                    Freights
                  </NavLink>
                </li>
              )}

              <li className="nav-item headNav">
                <NavLink activeClassName="active" to={"/Tracking"}>
                  Tracking
                </NavLink>
              </li>
              {/* {userId && (
                <li className="nav-item headNav">
                  <NavLink activeClassName="active" to={'/Shipment'}>
                    Shipment
                  </NavLink>
                </li>
              )} */}

              {userId ? (
                <li className="nav-item headNav">
                  <NavLink activeClassName="active" to={"/Custom-clearence"}>
                    Custom Clearance
                  </NavLink>
                </li>
              ) : (
                <li className="nav-item headNav">
                  <NavLink activeClassName="active" to={"/CustomClearance"}>
                    Custom Clearance
                  </NavLink>
                </li>
              )}
              {userId?(
                <div className="dropdown invoiceDrop">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Billing
                </button>
                <ul className="dropdown-menu" style={{padding:"0px 15px"}}>
                  <li>
                    <Link className="dropdown-item  list_item" to={'/invoices'} >
                        Invoices 
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item list_item" to={'/TransctionDetails'}>
                      Transaction Allocation
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item list_item"to={'/TransctionAllocation'}>
                    Statement 
                    </Link>
                  </li>
                  
                </ul>
              </div>
              ):("")}
               <li className="nav-item headNav">
                <NavLink activeClassName="active" to={"/Contact-us"}>
                  Contact Us
                </NavLink>
              </li>
            </ul>
             
          </div>
           {addFreightVisible === true ? (
              <div className="callNav">
              <button className="btn btn_add_web" onClick={handleNavigate}>
                Add Freight
              </button>
          </div>

            ) : (
              ""
            )}
          
        </div>
      </nav>
    </div>
  );
}
