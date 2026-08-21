import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarWeb from "../homepage/SidebarwWeb";
import NavbarWeb from "../homepage/NavbarWeb";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FooterWeb from "../homepage/FooterWeb";
import SearchIcon from "@mui/icons-material/Search";
import EastIcon from "@mui/icons-material/East";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./ClearanceOrder.css";

const pageSize = 5;
export default function ClearanceOrder() {
  const [data1, setData1] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [countriesList, setCountriesList] = useState([]);

  useEffect(() => {
    getdata();
    getCountries();
  }, []);

  const getCountries = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}GetCountries`)
      .then((response) => {
        setCountriesList(response.data.data || []);
      })
      .catch((err) => {
        console.log("Error fetching countries:", err);
      });
  };
  useEffect(() => {
    setFilteredData(
      data1.filter(
        (item) =>
          item.goods_desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.clearance_number
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.port_of_entry_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.port_of_exit_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [searchQuery, data1]);

  const gtedatauserid = JSON.parse(localStorage.getItem("data")).id;
  console.log(gtedatauserid);
  const getdata = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}CleranceOrderList`, {
        user_id: gtedatauserid,
      })
      .then((response) => {
        console.log(response.data.data);
        setData1(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <>
      <NavbarWeb />
      <SidebarWeb />
      <section className="manageFrightSec">
        <div className="co-container">
          <div className="row">
            <div className="col-md-12">
              
              {/* Header */}
              <div className="co-header">
                <h4 className="co-title">Order Clearance</h4>
                <div className="co-search-wrapper">
                  <SearchIcon className="co-search-icon" />
                  <input
                    className="co-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clearances..."
                  />
                </div>
              </div>

              {/* Table Card container */}
              <div className="co-card">
                <div className="table-responsive">
                  <table className="co-table">
                    <thead>
                      <tr>
                        <th className="co-th">Client / Order</th>
                        <th className="co-th">Route & Ports</th>
                        <th className="co-th">Status & Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length > 0 ? (
                        currentData.map((item, index) => {
                          const fromCountry = countriesList.find(c => c.country_id == item.loading_country || c.id == item.loading_country);
                          const toCountry = countriesList.find(c => c.country_id == item.discharge_country || c.id == item.discharge_country);
                          const fromFlag = fromCountry?.flag_url || fromCountry?.flag || item.flag_url_f || item.collection_from_country_flag_url;
                          const toFlag = toCountry?.flag_url || toCountry?.flag || item.flag_url_d || item.delivery_to_country_flag_url;
                          return (
                            <tr key={index} className="co-tr">
                              <td className="co-td">
                                <div className="co-client-wrapper">
                                  <div className="co-client-header">
                                    <span className="co-client-name">{item.client_name}</span>
                                    <span className="co-badge">{item.clearance_number}</span>
                                  </div>
                                  <p className="co-desc">{item.goods_desc || "No description provided"}</p>
                                </div>
                              </td>
                              <td className="co-td">
                                <div className="co-route">
                                  {fromFlag && (
                                    <img
                                      src={`${process.env.REACT_APP_FLAGURL}${fromFlag}`}
                                      alt=""
                                      className="co-flag-img"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  )}
                                  <span>{item.port_of_entry_name || "N/A"}</span>
                                  <EastIcon className="co-route-arrow" fontSize="inherit" />
                                  {toFlag && (
                                    <img
                                      src={`${process.env.REACT_APP_FLAGURL}${toFlag}`}
                                      alt=""
                                      className="co-flag-img"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  )}
                                  <span>{item.port_of_exit_name || "N/A"}</span>
                                </div>
                              </td>
                            <td className="co-td">
                              <div className="d-flex flex-column gap-2 align-items-start">
                                <p className="co-date">
                                  {new Date(item.created_at).toLocaleDateString("en-GB")}
                                </p>
                                <div>
                                  {item.clearing_status === "Cleared" ? (
                                    <span className="co-status-badge co-status-cleared">
                                      <FiberManualRecordIcon fontSize="inherit" />
                                      Cleared
                                    </span>
                                  ) : item.clearing_status === "0" ? (
                                    <span className="co-status-badge co-status-pending">
                                      <FiberManualRecordIcon fontSize="inherit" />
                                      Accept
                                    </span>
                                  ) : item.clearing_status === "Still to clear" ? (
                                    <span className="co-status-badge co-status-still-clear">
                                      <FiberManualRecordIcon fontSize="inherit" />
                                      Still to Clear
                                    </span>
                                  ) : item.clearing_status === "In process" ? (
                                    <span className="co-status-badge co-status-in-process">
                                      <FiberManualRecordIcon fontSize="inherit" />
                                      In Process
                                    </span>
                                  ) : (
                                    <span className="co-status-badge co-status-pending">
                                      <FiberManualRecordIcon fontSize="inherit" />
                                      {item.clearing_status || "Pending"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="3" className="co-empty-state">
                            No clearances found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  {/* Pagination Footer */}
                  {totalPages > 1 && (
                    <div className="co-pagination">
                      <button
                        disabled={currentPage === 1}
                        className="co-page-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-label="Previous page"
                      >
                        <ChevronLeftIcon fontSize="small" />
                      </button>
                      <span className="co-page-num">{currentPage}</span>
                      <button
                        disabled={currentPage === totalPages}
                        className="co-page-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-label="Next page"
                      >
                        <ChevronRightIcon fontSize="small" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      <FooterWeb />
    </>
  );
}
