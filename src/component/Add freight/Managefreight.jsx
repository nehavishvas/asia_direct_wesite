import React, { useEffect, useState } from "react";
import Arrow from "../../assestss/Group 2.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Managefreight.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmsIcon from '@mui/icons-material/Sms';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SidebarWeb from "../homepage/SidebarwWeb";
import NavbarWeb from "../homepage/NavbarWeb";
import FooterWeb from "../homepage/FooterWeb";
import CloseIcon from "@mui/icons-material/Close";
import EastIcon from "@mui/icons-material/East";
import SearchIcon from "@mui/icons-material/Search";
const pageSize = 5;
export default function Managefreight() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [consigneeId, setConsigneeId] = useState("");
  const [quoterecieved, setQuoterecieved] = useState({});
  const [clientquoted, setClientquoted] = useState({});
  const [warehousew, setWarehousew] = useState({});
  const [clearings, setClearings] = useState({});
  const [radioButton, setRadioButton] = useState("");
  const [insurance, setInsurance] = useState("");
  const currentuser = JSON.parse(localStorage.getItem("data"));
  const [inputData, setInputData] = useState({});
  const [secondRadio, setSecondRadio] = useState({});
  const [thirdRadio, setThirdadio] = useState({});
  const [estimate, setEstimate] = useState();
  const [apidata, setApidata] = useState([]);
  const [inputvali, setInputvali] = useState({
    user_id: "",
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    freightType: "",
    freightSpeed: "",
  });
  const [quantdata, setQuantdata] = useState({});
  const [files, setFiles] = useState(null);
  const [country, setCountry] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData2, setFormData2] = useState(null);
  const [formData5, setFormData5] = useState(false);
  const navigate = useNavigate();
  const [show1, setShow1] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const docOptions = [
    { id: "Customs Documents", label: "Customs docs" },
    { id: "Supporting Documents", label: "Supporting docs" },
    { id: "Invoice, Packing List", label: "Invoice / Packing " },
    { id: "Product Literature", label: "Product Literature" },
    { id: "Letters of authority", label: "Letters of authority" },
    { id: "Waybills", label: "Freight Docs" },
    { id: "Waybills", label: "Shipping instruction" },
    { id: "AD_Quotations", label: "Attach Quote" },
    { id: "Supplier Invoices", label: "Supplier Invoices" },
  ];
  const handleShow = () => setShow1(true);
  const handleClose = () => setShow1(false);
  const handleSelect = (e) => {
    const selected = e.target.value;
    if (selected && !selectedDocs.find((doc) => doc.name === selected)) {
      setSelectedDocs([...selectedDocs, { name: selected, files: [] }]);
    }
  };
  const handleFileChangefil = (e, docName) => {
    const files = Array.from(e.target.files);
    setSelectedDocs((prev) =>
      prev.map((doc) => (doc.name === docName ? { ...doc, files } : doc))
    );
  };
  const handleSave = () => {
    console.log("Uploaded Documents:", selectedDocs);
    selectedDocs.forEach((doc) => {
      console.log("Doc Type:", doc);
      doc.files.forEach((file) => {
        console.log("File:", file.name, "| Size:", file.size, "bytes");
      });
    });

    handleClose();
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getdata();
  }, []);
  useEffect(() => {
    getdataap();
  }, []);
  const getdataap = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}getCommodities`)
      .then((response) => {
        console.log(response.data.data);
        setApidata(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  const handleUpdateClose = () => setShowModal(false);
  const handleUpdateClose5 = () => setFormData5(false);
  const openmodal = () => setFormData5(true);
  const getdata = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}client-freights`, {
        user_id: currentuser?.id,
      })
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };
  const handledelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${process.env.REACT_APP_BASE_URL}delete-freight`, {
            freight_id: id,
          })
          .then((response) => {
            getdata();
            console.log(response.data.message);
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };
  ////////////////////////////////////update////////////////////////////////////
  const updatefunction = (id) => {
    const userdata = data.filter((item) => {
      return item.id === id;
    });
    const reguser = userdata[0];
    console.log(reguser);
    setInputData((prevData) => ({
      ...prevData,
      shipment_ref: reguser.shipment_ref,
      freight_id: id,
      status: reguser.status,
      shipment_origin: secondRadio,
      sea_freight_option: reguser.sea_freight_option,
      road_freight_option: reguser.road_freight_option,
      add_attachments: reguser.add_attachments,
      ready_for_collection: reguser.ready_for_collection,
      product_desc: reguser.product_desc,
      post_of_discharge: reguser.post_of_discharge,
      port_of_loading: reguser.port_of_loading,
      package_type: reguser.package_type,
      no_of_packages: reguser.no_of_packages,
      nature_of_goods: reguser.nature_of_goods,
      freight_type: reguser.freight_type,
      freight: reguser.freight,
      auto_calculate: reguser.auto_calculate,
      commodity: reguser.commodity,
      fcl_lcl: reguser.fcl_lcl,
      dimension: reguser.dimension,
      weight: reguser.weight,
      delivery_to: reguser.delivery_to,
      delivery_address: reguser.delivery_address,
      shipment_des: reguser.shipment_des,
      comment: reguser.comment,
      collection_from: reguser.collection_from,
      collection_address: reguser.collection_address,
      client_name: reguser.client_name,
      delivery_to_country: reguser.delivery_to_country,
      assign_to_transporter: reguser.assign_to_transporter,
      assign_for_estimate: estimate,
      insurance: insurance,
      assign_for_estimate: estimate,
      quote_received: quoterecieved,
      client_quoted: clientquoted,
      send_to_warehouse: warehousew,
      assign_to_clearing: clearings,
    }));
    setRadioButton(reguser.user_type);
    setSecondRadio(reguser.shipment_origin);
    setThirdadio(reguser.shipment_des);
    setEstimate(reguser.assign_for_estimate);
    setInsurance(reguser.insurance);
    setEstimate(reguser.assign_for_estimate);
    setWarehousew(reguser.send_to_warehouse);
    setClearings(reguser.assign_to_clearing);
    setShowModal(true);
  };
  const dddd = (e) => {
    setRadioButton(e.target.value);
  };
  const insurance1 = (e) => {
    setInsurance(e.target.value);
  };
  const warehouse2 = (e) => {
    setWarehousew(e.target.value);
  };
  const clearing2 = (e) => {
    setClearings(e.target.value);
  };
  const recievedquote = (e) => {
    setQuoterecieved(e.target.value);
  };
  const clientquoted1 = (e) => {
    setClientquoted(e.target.value);
  };
  const handlethird = (e) => {
    setThirdadio(e.target.value);
  };
  const handleestimate = (e) => {
    setEstimate(e.target.value);
  };
  const secondradi = (e) => {
    setSecondRadio(e.target.value);
  };
  const handklechangeas = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  const handleInsuranceChange = (e) => {
    setInsurance(e.target.value);
  };
  const clienduidi = JSON.parse(localStorage.getItem("data"));
  const handleclicknavi = () => {
    const formdata = new FormData();
    formdata.append("freight_id", inputData.freight_id);
    formdata.append("client_id", clienduidi.id);
    formdata.append("shipment_ref", inputData.shipment_ref);
    formdata.append("user_type", radioButton);
    formdata.append("status", inputData.status);
    formdata.append("shipment_origin", secondRadio);
    formdata.append("sea_freight_option", inputData.sea_freight_option);
    formdata.append("shipment_des", thirdRadio);
    formdata.append("road_freight_option", inputData.road_freight_option);
    formdata.append("ready_for_collection", inputData.ready_for_collection);
    formdata.append("product_desc", inputData.product_desc);
    formdata.append("post_of_discharge", inputData.post_of_discharge);
    formdata.append("port_of_loading", inputData.port_of_loading);
    formdata.append("add_attachments", inputData.add_attachments);
    formdata.append("package_type", inputData.package_type);
    formdata.append("fcl_lcl", inputData.fcl_lcl);
    formdata.append("no_of_packages", inputData.no_of_packages);
    formdata.append("nature_of_goods", inputData.nature_of_goods);
    formdata.append(
      "auto_calculate",
      totaldimension ? totaldimension : inputData.auto_calculate
    );
    formdata.append("freight_type", inputData.freight_type);
    formdata.append("freight", inputData.freight);
    formdata.append("dimension", inputData.dimension);
    formdata.append("weight", inputData.weight);
    formdata.append("delivery_to", inputData.delivery_to);
    formdata.append("commodity", inputData.commodity);
    formdata.append("comment", inputData.comment);
    formdata.append("collection_from", inputData.collection_from);
    formdata.append("documentName", inputData.documentName);
    formdata.append("delivery_address", inputData.delivery_address);
    formdata.append("collection_address", inputData.collection_address);
    formdata.append("client_name", inputData.client_name);
    formdata.append("delivery_to_country", inputData.delivery_to_country);
    formdata.append("assign_for_estimate", inputData.assign_for_estimate);
    formdata.append("insurance", insurance);
    formdata.append("send_to_warehouse", warehousew);
    formdata.append("assign_to_clearing", clearings);
    selectedDocs.forEach((doc) => {
      console.log("Doc Type:", doc.name);
      doc.files.forEach((file) => {
        formdata.append(doc.name, file); // 👈 each file append
        console.log("File:", file.name, "| Size:", file.size, "bytes");
      });
    });
    if (formData2) {
      for (let i = 0; i < formData2.licenses.length; i++) {
        formdata.append("document", formData2.licenses[i]);
      }
    }
    console.log(formdata);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}update-freights`, formdata)
      .then((response) => {
        console.log(response.data.message);
        toast.success(response.data.message);
        handleUpdateClose();
        getdata();
      })
      .catch((error) => {
        toast.error(error.response.data.data.message);
      });
  };
  const handleclicknavigfh = (id) => {
    const allRowdata = data.filter((item) => {
      return item.id === id;
    });
    navigate("/freight-full-details", { state: { printdata: allRowdata } });
  };
  const hanldedhgjdh = (id) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}get-shipping-estimate`, {
        freight_id: id,
      })
      .then((response) => {
        navigate("/Download-pdf", { state: response.data.data });
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const filteredData = data.filter((item) => {
    return (
      item?.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.freight.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.place_of_delivery
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item?.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item?.delivery_to_country)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(item?.collection_from_country)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item?.shipment_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item?.no_of_packages)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(item?.freight_number)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(item?.weight).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const startindex = (currentPage - 1) * pageSize;
  const endIndex = startindex + pageSize;
  const currentdata = filteredData.slice(startindex, endIndex);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  //////////////////////////////////////////// calculation//////////////////////////////////////////////////
  const dimensiion1 = isNaN(
    parseInt(quantdata?.length) *
      parseInt(quantdata?.width) *
      parseInt(quantdata?.height)
  )
    ? 0
    : parseInt(quantdata?.length) *
      parseInt(quantdata?.width) *
      parseInt(quantdata?.height);
  const weight12 = isNaN(
    parseInt(quantdata?.Quantity) * parseInt(quantdata?.weight)
  )
    ? 0
    : parseInt(quantdata?.Quantity) * parseInt(quantdata?.weight);
  const [age, setAge] = React.useState("");
  const datauserval = JSON.parse(localStorage.getItem("data"));
  const handleChange = (event) => {
    setAge(event.target.value);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}client-freights`, {
        user_id: datauserval.id,
        status: event.target.value,
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  const datadjgfhjk = dimensiion1 === "NaN" ? 0 : dimensiion1;
  //////////////////////////////////////////////////////get contries////////////////////////////////////////////////////
  const getdata12 = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}GetCountries`)
      .then((response) => {
        console.log(response.data.data);
        setCountry(response.data.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  useEffect(() => {
    getdata12();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  const totaldimension = 167 * inputData.weight;
  const handleNavigate = () => {
    navigate("/addfreight");
  };
  const handleInputChangfilee = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(file);
    }
  };
  const handleFileChange2 = (event) => {
    const files = event.target.files;
    setFormData2({ ...formData2, licenses: files });
  };
  const handechangefilter = (e) => {
    const { name, value } = e.target;
    setInputvali({ ...inputvali, [name]: value });
  };
  const handleResetFilter = () => {
    setInputvali({
      user_id: "",
      origin: "",
      destination: "",
      startDate: "",
      endDate: "",
      freight: "",
      type: "",
    });
    getdata();
    handleUpdateClose5();
  };
  const postapi = () => {
    if (inputvali.startDate && inputvali.endDate) {
      const start = new Date(inputvali.startDate);
      const end = new Date(inputvali.endDate);
      if (start > end) {
        toast.error("Start Date must be earlier than End Date.");
        return;
      }
    } else if (inputvali.startDate && !inputvali.endDate) {
      toast.error("Please select an End Date as well.");
      return;
    } else if (!inputvali.startDate && inputvali.endDate) {
      toast.error("Please select a Start Date as well.");
      return;
    }

    const datapost = {
      user_id: clienduidi.id,
      origin: inputvali.origin,
      destination: inputvali.destination,
      startDate: inputvali.startDate,
      endDate: inputvali.endDate,
      freightType: inputvali.freight,
      freightSpeed: inputvali.type,
    };
    console.log(datapost);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}client-freights`, datapost)
      .then((response) => {
        if (response.data.success === true) {
          setData(response.data.data);
          handleUpdateClose5();
          console.log(response.data.data);
        }
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error.response?.data || error.message);
      });
  };
  const handleChat = (item) => {
    console.log(item);
    console.log("item", item);
    navigate("/QuotationInFreight", { state: { data: item } });
  };
  return (
    <div>
      <>
        <NavbarWeb />
        <SidebarWeb />
        {currentuser !== null || undefined ? (
          <>
            <section className="manageFrightSec">
              <div className="mf-container">
              <div className="mf-header">
                <h4 className="mf-title">All Freight Details</h4>
                <div className="mf-controls">
                  <div className="mf-search-wrapper">
                    <SearchIcon className="mf-search-icon" />
                    <input
                      className="mf-search-input"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Search..."
                    />
                  </div>
                  <button
                    className="mf-btn-filter"
                    onClick={openmodal}
                  >
                    Filter
                  </button>
                  <select
                    className="mf-select"
                    value={age}
                    onChange={handleChange}
                  >
                    <option value="Status">Status</option>
                    <option value="0">Pending</option>
                    <option value="1">Accepted</option>
                    <option value="2">Declined</option>
                    <option value="4">Estimate</option>
                  </select>
                  <button
                    className="mf-btn-add"
                    onClick={handleNavigate}
                  >
                    + Add Freight
                  </button>
                </div>
              </div>

              <div className="mf-card">
                <div className="table-responsive">
                  <table className="mf-table">
                    <thead>
                      <tr>
                        <th className="mf-th" style={{ width: "35%" }}>Shipment & Cargo</th>
                        <th className="mf-th" style={{ width: "35%" }}>Route</th>
                        <th className="mf-th" style={{ width: "15%" }}>Nature</th>
                        <th className="mf-th" style={{ width: "15%", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentdata && currentdata.length > 0 ? (
                        currentdata.map((item, index) => {
                          const date = new Date(item.date);
                          const formatteddate = date.toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            }
                          );
                          return (
                            <tr key={index} className="mf-tr">
                              <td className="mf-td">
                                <div className="mf-client-wrapper">
                                  <div className="mf-client-header mb-1">
                                    <span 
                                      className="mf-client-name"
                                      onClick={() => handleclicknavigfh(item.id)}
                                    >
                                      {item.client_name}
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                                    <span 
                                      className="mf-badge"
                                      onClick={() => handleclicknavigfh(item.id)}
                                    >
                                      {item.freight_number}
                                    </span>
                                    <div>
                                      {item.status == 0 ? (
                                        <span className="mf-status-badge mf-status-pending">
                                          Pending
                                        </span>
                                      ) : item.status == 2 ? (
                                        <span className="mf-status-badge mf-status-decline">
                                          Decline
                                        </span>
                                      ) : item.status == 3 ? (
                                        <span className="mf-status-badge mf-status-decline">
                                          Rejected
                                        </span>
                                      ) : item.status == 4 ? (
                                        <span className="mf-status-badge mf-status-estimate">
                                          Estimated
                                        </span>
                                      ) : item.status == 1 ? (
                                        <span className="mf-status-badge mf-status-accepted">
                                          Accepted
                                        </span>
                                      ) : item.status == 6 ? (
                                        <span className="mf-status-badge mf-status-decline">
                                          Quotation Rejected
                                        </span>
                                      ) : item.status == 5 ? (
                                        <span className="mf-status-badge mf-status-accepted">
                                          Quotation Accepted
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <p 
                                    className="mf-desc"
                                    onClick={() => handleclicknavigfh(item.id)}
                                  >
                                    Description: {item.product_desc || "No Description"}
                                  </p>
                                </div>
                              </td>
                              
                              <td className="mf-td">
                                <div 
                                  className="mf-route"
                                  onClick={() => handleclicknavigfh(item.id)}
                                >
                                  <img
                                    src={`${process.env.REACT_APP_FLAGURL}${item.flag_url_f}`}
                                    className="mf-flag-img"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                    alt=""
                                  />
                                  <span className="ms-1">{item?.collection_from_country}</span>
                                  <span className="mf-route-arrow mx-2">
                                    <EastIcon fontSize="inherit" />
                                  </span>
                                  <img
                                    src={`${process.env.REACT_APP_FLAGURL}${item.flag_url_d}`}
                                    className="mf-flag-img"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                    alt=""
                                  />
                                  <span className="ms-1">{item?.delivery_to_country}</span>
                                  <span className="text-muted ms-1" style={{ fontSize: "0.75rem" }}>
                                    ({item?.freight})
                                  </span>
                                </div>
                              </td>
                              
                              <td className="mf-td">
                                <p 
                                  className="mf-nature"
                                  onClick={() => handleclicknavigfh(item.id)}
                                >
                                  {item.nature_of_goods}
                                </p>
                              </td>
                              
                              <td className="mf-td">
                                <div className="d-flex flex-column align-items-end">
                                  <p className="mf-date">
                                    {new Date(item.created_at).toLocaleDateString("en-GB")}
                                  </p>
                                  
                                  <div className="dropdown">
                                    <a
                                      href="/"
                                      type="button"
                                      className="mf-action-btn dropdown-toggle"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      Action
                                    </a>
                                    <div
                                      className="dropdown-menu drop_down"
                                      aria-labelledby="dropdownMenuButton1"
                                    >
                                      <div className="btnManageFreight">
                                        <div className="drpIcons dropdown-item item_drop">
                                          {item?.status == 4 ? (
                                            <Link
                                              className="text-primary text-dark"
                                              onClick={() => {
                                                hanldedhgjdh(item.id);
                                              }}
                                            >
                                              <i className="fi fi-br-download dr"></i>
                                              Download PDF
                                            </Link>
                                          ) : (
                                            <Link className="text-danger"></Link>
                                          )}
                                        </div>
                                        <div className="drpIcons dropdown-item item_drop">
                                          {item.status === "2" ? (
                                            <p></p>
                                          ) : (
                                            <a
                                              className="link_bdy"
                                              href="https://chat.whatsapp.com/C1SiwQek53B434FSz4BjQo"
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              <WhatsAppIcon className="text-success" />
                                              Whatsapp
                                            </a>
                                          )}
                                        </div>
                                        <div className="drpIcons dropdown-item item_drop">
                                          <p
                                            className="link_bdy mb-0"
                                            onClick={() => {
                                              handledelete(item.id);
                                            }}
                                            style={{ cursor: "pointer" }}
                                          >
                                            <i className="fa fa-trash icon_align" />
                                            Delete
                                          </p>
                                        </div>
                                        {item.staff_name ? (
                                          <div className="drpIcons dropdown-item item_drop">
                                            <p
                                              className="link_bdy mb-0"
                                              onClick={() => {
                                                handleChat(item);
                                              }}
                                              style={{ cursor: "pointer" }}
                                            >
                                              <SmsIcon className="text-primary icon_align" style={{ fontSize: "18px", paddingRight:"5px" }}/>{" "}
                                              Chat
                                            </p>
                                          </div>
                                        ) : (
                                          <p></p>
                                        )}

                                        {item.status === "2" ? (
                                          <p></p>
                                        ) : (
                                          <div
                                            className="drpIcons dropdown-item item_drop drop_item1"
                                            onClick={() => {
                                              updatefunction(item.id);
                                            }}
                                            style={{ cursor: "pointer" }}
                                          >
                                            <i className="fa fa-edit icon_align" />
                                            Edit
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {item?.assigned_supplier_name && (
                                    <span className="text-xs text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                                      {item?.assigned_supplier_name}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center mf-empty-state">
                            No Freight Details Found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  {/* Pagination */}
                  <div className="mf-pagination">
                    <button
                      disabled={currentPage === 1}
                      className="mf-page-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <i className="fi fi-rr-angle-small-left page_icon"></i>
                    </button>
                    <span className="mf-page-num">{currentPage}</span>
                    <button
                      disabled={currentPage === totalPage}
                      className="mf-page-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <i className="fi fi-rr-angle-small-right page_icon"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </>
        ) : (
          <>
            <p className="text-center fw-bold fs-1 my-5">
              !!! Please Login !!!
            </p>
            <div className="text-center">
              <button
                className="btn btn-secondary  px-5 py-2"
                onClick={() => {
                  navigate("/login");
                }}
              >
                login
              </button>
            </div>
          </>
        )}
      </>
      <ToastContainer />
      <div
        className="modal fade "
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5 fw-bold text-dark"
                id="exampleModalLabel"
              >
                Update freight
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <section className="frightFormSec manageModal">
                <div className="frightFormSec my-3">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="borderShip">
                          <h3 className="mb-4">Freight details</h3>
                          <div className="row">
                            <div className="col-lg-6">
                              <h5 className="labelTitle">Freight Option</h5>
                              <select
                                name="freight"
                                onChange={handklechangeas}
                                id="freightOption"
                                value={inputData.freight}
                              >
                                <option value="">Select...</option>
                                <option value="Sea">Sea</option>
                                <option value="Air">Air</option>
                                <option value="Road">Road</option>
                                <option value="Rail">Rail</option>
                              </select>
                              <p className="text-danger mb-0"></p>
                            </div>
                            <div className="col-lg-6">
                              <h5 className="labelTitle">Freight Type</h5>
                              <select
                                name="freight_type"
                                onChange={handklechangeas}
                                value={inputData.freight_type}
                              >
                                <option value="">Select...</option>
                                <option value="express">Express</option>
                                <option value="normal">Normal</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="borderShip">
                        <h3 className="mb-4">Shipment details</h3>
                        <div className="row">
                          <div className="col-lg-6">
                            <h5 className="labelTitle">Origin</h5>
                            <div className="parentShipper">
                              <div className="childshipper">
                                <div className="row">
                                  <div className="col-md-2 pe-0">
                                    <input
                                      type="radio"
                                      id="origin1"
                                      name="origin"
                                      onChange={secondradi}
                                      checked={
                                        secondRadio ===
                                        "Shipper will deliver at Asia Direct - Africa warehouse"
                                      }
                                      value="Shipper will deliver at Asia Direct - Africa warehouse"
                                    />
                                  </div>
                                  <div className="col-md-10 ps-0">
                                    <label for="origin1" className="my-0">
                                      Shipper will deliver at Asia Direct -
                                      Africa warehouse
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="parentShipper">
                              <div className="childshipper">
                                <div className="row">
                                  <div className="col-md-2 pe-0">
                                    <input
                                      type="radio"
                                      id="origin2"
                                      name="origin"
                                      onChange={secondradi}
                                      value="Asia Direct will collect from shipper address"
                                      checked={
                                        secondRadio ===
                                        "Asia Direct will collect from shipper address"
                                      }
                                    />
                                  </div>
                                  <div className="col-md-10 ps-0">
                                    <label for="origin2" className="my-0">
                                      Asia Direct will collect from shipper
                                      address
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="parentShipper">
                              <div className="childshipper">
                                <div className="row">
                                  <div className="col-md-2 pe-0">
                                    <input
                                      type="radio"
                                      id="origin3"
                                      name="origin"
                                      onChange={secondradi}
                                      value="Shipper will deliver to the port of loading"
                                      checked={
                                        secondRadio ===
                                        "Shipper will deliver to the port of loading"
                                      }
                                    />
                                  </div>
                                  <div className="col-md-10 ps-0">
                                    <label for="origin3" className="my-0">
                                      Shipper will deliver to the port of
                                      loading,
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="parentShipper">
                              <div className="childshipper">
                                <div className="row">
                                  <div className="col-md-2 pe-0">
                                    <input
                                      type="radio"
                                      id="origin4"
                                      name="origin"
                                      onChange={secondradi}
                                      value="Shipper will deliver and facilitate export at the Port of loading"
                                      checked={
                                        secondRadio ===
                                        "Shipper will deliver and facilitate export at the Port of loading"
                                      }
                                    />
                                  </div>
                                  <div className="col-md-10 ps-0">
                                    <label for="origin4" className="my-0">
                                      Shipper will deliver and facilitate export
                                      at the Port of loading
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-danger mb-0"></p>
                          </div>
                          <div className="col-lg-6">
                            <h5 className="labelTitle">Destination</h5>
                            <div className="parentShipper">
                              <div className="childshipper">
                                <div className="row">
                                  <div className="col-md-2 pe-0">
                                    <input
                                      type="radio"
                                      id="Destination1"
                                      name="Destination"
                                      onChange={handlethird}
                                      checked={
                                        thirdRadio ===
                                        "Asia Direct will deliver to the Address"
                                      }
                                      value="Asia Direct will deliver to the Address"
                                    />
                                  </div>
                                  <div className="col-md-10 ps-0">
                                    <label for="Destination1" className="my-0">
                                      Asia Direct will deliver to the Address.
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="parentShipper">
                              <div className="childshipper">
                                <div className="row">
                                  <div className="col-md-2 pe-0">
                                    <input
                                      type="radio"
                                      id="Destination2"
                                      name="Destination"
                                      onChange={handlethird}
                                      checked={
                                        thirdRadio ===
                                        "Consignee will collect at Asia Direct - Africa warehouse"
                                      }
                                      value="Consignee will collect at Asia Direct - Africa warehouse"
                                    />
                                  </div>
                                  <div className="col-md-10 ps-0">
                                    <label for="Destination2" className="my-0">
                                      Consignee will collect at Asia Direct -
                                      Africa warehouse
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="parentShipper">
                              <div className="childshipper">
                                <div className="row">
                                  <div className="col-md-2 pe-0">
                                    <input
                                      type="radio"
                                      id="Destination3"
                                      name="Destination"
                                      onChange={handlethird}
                                      value="Consignee will collect at the nearest port"
                                      checked={
                                        thirdRadio ===
                                        "Consignee will collect at the nearest port"
                                      }
                                    />
                                  </div>
                                  <div className="col-md-10 ps-0">
                                    <label for="Destination3" className="my-0">
                                      Consignee will collect at the nearest port
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="parentShipper">
                              <div className="childshipper">
                                <div className="row">
                                  <div className="col-md-2 pe-0">
                                    <input
                                      type="radio"
                                      id="Destination4"
                                      name="Destination"
                                      onChange={handlethird}
                                      checked={
                                        thirdRadio ===
                                        "Consignee will collect and facilitate import at destination port"
                                      }
                                      value="Consignee will collect and facilitate import at destination port"
                                    />
                                  </div>
                                  <div className="col-md-10 ps-0">
                                    <label for="Destination4" className="my-0">
                                      Consignee will collect and facilitate
                                      import at destination port
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-danger mb-0"></p>
                          </div>
                        </div>
                      </div>
                      <div className="borderShip">
                        <h3 className="mb-4">Your Shipment reference</h3>
                        <div className="row">
                          <div className="col-lg-6 shipRefer">
                            <h5 className="labelTitle">Are you the</h5>
                            <div className="mt-3">
                              <input
                                type="radio"
                                id="shipper"
                                name="shipper"
                                value="shipper"
                                checked={radioButton === "shipper"}
                                onChange={dddd}
                              />
                              <label htmlFor="shipper">Shipper</label>
                              <input
                                type="radio"
                                id="consignee"
                                name="shipperOrConsignee"
                                value="consignee"
                                checked={radioButton === "consignee"}
                                onChange={dddd}
                              />
                              <label htmlFor="consignee">Consignee</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="borderShip updateLoading">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row align-items-center">
                                <div className="col-md-5">
                                  <label>Assign for estimate</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="shipRefer">
                                    <input
                                      type="radio"
                                      onChange={handleestimate}
                                      id="estYes"
                                      name="assign_for_estimate"
                                      checked={estimate === "Yes"}
                                      value="Yes"
                                    />
                                    <label htmlFor="estYes">Yes1</label>
                                    <input
                                      type="radio"
                                      onChange={handleestimate}
                                      id="estNo"
                                      name="assign_for_estimate"
                                      checked={estimate === "No"}
                                      value="No"
                                    />
                                    <label htmlFor="estNo">No2</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="row align-items-center">
                                <div className="col-md-5">
                                  <label>Insurance</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="shipRefer">
                                    <input
                                      type="radio"
                                      onChange={insurance1}
                                      id="estYes1"
                                      name="insurance"
                                      checked={insurance === "Yes"}
                                      value="Yes"
                                    />
                                    <label htmlFor="estYes1">Yes</label>
                                    <input
                                      type="radio"
                                      onChange={insurance1}
                                      id="estNo1"
                                      checked={insurance === "No"}
                                      name="insurance"
                                      value="No"
                                    />
                                    <label htmlFor="estNo1">No</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="row align-items-center">
                                <div className="col-md-5">
                                  <label>Quote Received</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="shipRefer">
                                    <input
                                      type="radio"
                                      id="quoteOne"
                                      name="quote_received"
                                      defaultValue="yes"
                                      onChange={handleInputChange}
                                    />
                                    <label htmlFor="quoteOne">Yes</label>
                                    <input
                                      type="radio"
                                      id="QuoteTwo"
                                      name="quote_received"
                                      defaultValue="no"
                                      onChange={handleInputChange}
                                    />
                                    <label htmlFor="QuoteTwo">No</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="row align-items-center">
                                <div className="col-md-5">
                                  <label>Client Quoted</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="shipRefer">
                                    <input
                                      type="radio"
                                      id="clientQuOne"
                                      name="client_quoted"
                                      defaultValue="Yes"
                                      checked={clientquoted === "Yes"}
                                      onChange={clientquoted1}
                                    />
                                    <label htmlFor="clientQuOne">Yes</label>
                                    <input
                                      type="radio"
                                      id="clientQuTwo"
                                      name="client_quoted"
                                      checked={clientquoted === "No"}
                                      defaultValue="No"
                                      onChange={clientquoted1}
                                    />
                                    <label htmlFor="clientQuTwo">No</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="">
                          <div className="row">
                            <div className="col-6">
                              <label> Assign to Transporter</label>
                              <select
                                name="assign_to_transporter"
                                onChange={handleInputChange}
                                className="form-control"
                                value={inputData.assign_to_transporter}
                              >
                                <option value="">Select</option>
                                <option value="Asia Direct - Africa">
                                  Asia Direct - Africa
                                </option>
                                <option value="OBD Logistics">
                                  OBD Logistics
                                </option>
                                <option value="SACO CFR">SACO CFR</option>
                                <option value="Shenzhen Nimbus">
                                  Shenzhen Nimbus
                                </option>
                              </select>
                            </div>
                            <div className="col-6">
                              <label>Send to Warehouse</label>
                              <div className="shipRefer">
                                <input
                                  type="radio"
                                  id="warehouseOne"
                                  name="send_to_warehouse"
                                  defaultValue="yes"
                                  onChange={handleInputChange}
                                />
                                <label htmlFor="warehouseOne">Yes</label>
                                <input
                                  type="radio"
                                  id="warehouseTwo"
                                  name="send_to_warehouse"
                                  defaultValue="no"
                                  onChange={handleInputChange}
                                />
                                <label htmlFor="warehouseTwo">No</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="borderShip updateLoading mt-3">
                          <div className="row">
                            <div className="col-6">
                              <label>Assign Warehouse</label>
                              <select
                                name="assign_warehouse"
                                onChange={handleInputChange}
                                className="form-control"
                              >
                                <option value="">Select</option>
                                <option value="Asia Direct Hre">
                                  Asia Direct Hre
                                </option>
                                <option value="Asia Direct - SA">
                                  Asia Direct - SA
                                </option>
                                <option value="Jingwei International Logistics">
                                  Jingwei International Logistics
                                </option>
                                <option value="OBD Logistics">
                                  OBD Logistics
                                </option>
                                <option value="Shenzhen Nimbus">
                                  Shenzhen Nimbus
                                </option>
                              </select>
                            </div>
                            <div className="col-6">
                              <label>Assign to Clearing</label>
                              <div className="shipRefer">
                                <input
                                  type="radio"
                                  id="clearingOne"
                                  name="assign_to_clearing"
                                  defaultValue="yes"
                                  onChange={handleInputChange}
                                />
                                <label htmlFor="clearingOne">Yes</label>
                                <input
                                  type="radio"
                                  id="clearingTwo"
                                  name="assign_to_clearing"
                                  defaultValue="no"
                                  onChange={handleInputChange}
                                />
                                <label htmlFor="clearingTwo">No</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="borderShip">
                        <div>
                          <h3 className="mb-4 ">Location details</h3>
                        </div>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="col-lg-12">
                              <h5 className="labelTitle">Collection from</h5>
                              <select
                                value={consigneeId}
                                onChange={(e) => setConsigneeId(e.target.value)}
                              >
                                <option value="">Select Co</option>
                                {country?.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                              <p className="text-danger mb-0"></p>
                            </div>
                            <div className="col-lg-12 my-1">
                              <h5 className="labelTitle">Port of Loading</h5>
                              <input
                                type="text"
                                name="port_of_loading"
                                onChange={handleInputChange}
                                value={inputData.port_of_loading}
                              />
                            </div>
                            <div className="my-3">
                              <h5 className="labelTitle">Collection Address</h5>
                              <input
                                type="text"
                                name="collection_address"
                                onChange={handleInputChange}
                                value={inputData.collection_address}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <h5 className="labelTitle">Delivery To</h5>
                            <select
                              value={inputData.delivery_to}
                              name="delivery_to"
                              onChange={handleInputChange}
                            >
                              <option>select...</option>
                              {country &&
                                country.length > 0 &&
                                country.map((option, index) => (
                                  <option key={index} value={option.id}>
                                    {option.name}
                                  </option>
                                ))}
                            </select>
                            <p className="text-danger mb-0"></p>
                            <div className="my-3">
                              <h5 className="labelTitle">Port of Discharge</h5>
                              <input
                                type="text"
                                onChange={handleInputChange}
                                name="post_of_discharge"
                                value={inputData.post_of_discharge}
                              />
                            </div>
                            <div className="col-lg-12 my-3">
                              <h5 className="labelTitle">Delivery Address</h5>
                              <input
                                type="text"
                                onChange={handleInputChange}
                                name="delivery_address"
                                value={inputData.delivery_address}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="borderShip">
                        <h3 className="mb-4">Cargo details</h3>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="shipRefer col-lg-12">
                              <h5 className="labelTitle">
                                Product Description
                              </h5>
                              <input
                                type="text"
                                onChange={handleInputChange}
                                name="product_desc"
                                value={inputData.product_desc}
                                className="w-100"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 ">
                            <h5 className="labelTitle">Nature of Goods</h5>
                            <select
                              name="nature_of_goods"
                              onChange={handleInputChange}
                              value={inputData.nature_of_goods}
                            >
                              <option value="">Select...</option>
                              <option value="generalCargo">
                                General cargo
                              </option>
                              <option value="battery">Battery</option>
                              <option value="liquids">Liquids</option>
                              <option value="powders">Powders</option>
                              <option value="hazardous">Hazardous</option>
                            </select>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 mt-3">
                            <h5 className="labelTitle">Package Type</h5>
                            <select
                              name="package_type"
                              onChange={handleInputChange}
                              value={inputData.package_type}
                            >
                              <option value="">Select...</option>
                              <option value="box">Box</option>
                              <option value="crate">Crate</option>
                              <option value="pallet">Pallet</option>
                              <option value="bags">Bags</option>
                            </select>
                          </div>
                          <div className="col-lg-6 mt-3">
                            <h5 className="labelTitle">Total Packages</h5>
                            <input
                              type="text"
                              name="no_of_packages"
                              onChange={handleInputChange}
                              value={inputData.no_of_packages}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 mt-3">
                            <h5 className="labelTitle">Total Dimension</h5>
                            <input
                              type="text"
                              name="dimension"
                              onChange={handleInputChange}
                              value={inputData.dimension}
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <h5 className="labelTitle">Total Weight</h5>
                            <input
                              type="text"
                              name="weight"
                              onChange={handleInputChange}
                              value={inputData.weight}
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <h5 className="labelTitle">Volumetric Weight</h5>
                            <input
                              type="text"
                              name="autoCalculate"
                              disabled
                              onChange={handleInputChange}
                              value={totaldimension}
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <h5 className="labelTitle">Add attachments</h5>
                            <select
                              name="add_attachments"
                              value={inputData.add_attachments}
                              onChange={handleInputChange}
                            >
                              <option value="">Select...</option>
                              <option value="supplierInvoice">
                                Supplier Invoice / Quotation / Proforma Invoice
                              </option>
                              <option value="FCL">FCL</option>
                              <option value="LCL">LCL</option>
                              <option value="otherDocuments">
                                Other documents
                              </option>
                            </select>
                          </div>
                          <div className="col-lg-6 mt-3">
                            <h5 className="labelTitle">Comment</h5>
                            <input
                              type="text"
                              name="comment"
                              className="mb-3"
                              onChange={handleInputChange}
                              value={inputData.comment}
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <h5 className="labelTitle">Add attachments</h5>
                            <select
                              name="add_attachments"
                              value={inputData.add_attachments}
                              onChange={handleInputChange}
                            >
                              <option value="">Select...</option>
                              <option value="supplierInvoice">
                                Supplier Invoice / Quotation / Proforma Invoice
                              </option>
                              <option value="packingList">Packing List</option>
                              <option value="licenses">Licenses/Permits</option>
                              <option value="otherDocuments">
                                Other documents
                              </option>
                            </select>
                          </div>
                          <div className="w-100">
                            <button
                              type="submit"
                              className="btn btn-danger mt-3 w-25 ms-2"
                              onClick={handleclicknavi}
                            >
                              Update Freight
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ToastContainer />
              </section>
            </div>
          </div>
        </div>
      </div>
      <Modal open={showModal} onClose={handleUpdateClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 650, md: 800 },
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "16px",
            overflow: "hidden",
            outline: "none",
          }}
        >
          <div className="customHeader">
            <h5>Update Freight</h5>
            <div className="crossBtn">
              <i onClick={handleUpdateClose} aria-hidden="true">
                <CloseIcon />
              </i>
            </div>
          </div>
          <section className="manageModal flex-grow-1 overflow-auto">
            <div className="container px-0">
              <div className="borderShip mt-0">
                <h3 className="mb-3">Freight Details</h3>
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h5 className="labelTitle">Freight Type</h5>
                    <select
                      name="freight"
                      onChange={handklechangeas}
                      id="freightOption"
                      value={inputData.freight}
                    >
                      <option value="">Select...</option>
                      <option value="Sea">Sea</option>
                      <option value="Air">Air</option>
                      <option value="Road">Road</option>
                      <option value="Rail">Rail</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <h5 className="labelTitle">Freight Option</h5>
                    <select
                      name="freight_type"
                      onChange={handklechangeas}
                      value={inputData.freight_type}
                    >
                      <option value="">Select...</option>
                      <option value="express">Express</option>
                      <option value="normal">Normal</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="borderShip">
                <h3 className="mb-3">Shipment Details</h3>
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h5 className="labelTitle">Origin</h5>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="me-2">
                            <input
                              type="radio"
                              id="origin1"
                              name="origin"
                              onChange={secondradi}
                              checked={
                                secondRadio ===
                                "Shipper will deliver at Asia Direct - Africa warehouse"
                              }
                              value="Shipper will deliver at Asia Direct - Africa warehouse"
                            />
                          </div>
                          <div className="ps-0">
                            <label htmlFor="origin1" className="my-0">
                              Shipper will deliver at Asia Direct - Africa warehouse
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="me-2">
                            <input
                              type="radio"
                              id="origin2"
                              name="origin"
                              onChange={secondradi}
                              value="Asia Direct will collect from shipper address"
                              checked={
                                secondRadio ===
                                "Asia Direct will collect from shipper address"
                              }
                            />
                          </div>
                          <div className="ps-0">
                            <label htmlFor="origin2" className="my-0">
                              Asia Direct will collect from shipper address
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="me-2">
                            <input
                              type="radio"
                              id="origin3"
                              name="origin"
                              onChange={secondradi}
                              value="Shipper will deliver to the port of loading"
                              checked={
                                secondRadio ===
                                "Shipper will deliver to the port of loading"
                              }
                            />
                          </div>
                          <div className="ps-0">
                            <label htmlFor="origin3" className="my-0">
                              Shipper will deliver to the port of loading
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="me-2">
                            <input
                              type="radio"
                              id="origin4"
                              name="origin"
                              onChange={secondradi}
                              value="Shipper will deliver and facilitate export at the Port of loading"
                              checked={
                                secondRadio ===
                                "Shipper will deliver and facilitate export at the Port of loading"
                              }
                            />
                          </div>
                          <div className="ps-0">
                            <label htmlFor="origin4" className="my-0">
                              Shipper will deliver and facilitate export at the Port of loading
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5 className="labelTitle">Destination</h5>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="me-2">
                            <input
                              type="radio"
                              id="Destination1"
                              name="Destination"
                              onChange={handlethird}
                              checked={
                                thirdRadio ===
                                "Asia Direct will deliver to the Address"
                              }
                              value="Asia Direct will deliver to the Address"
                            />
                          </div>
                          <div className="ps-0">
                            <label htmlFor="Destination1" className="my-0">
                              Asia Direct will deliver to the Address
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="me-2">
                            <input
                              type="radio"
                              id="Destination2"
                              name="Destination"
                              onChange={handlethird}
                              checked={
                                thirdRadio ===
                                "Consignee will collect at Asia Direct - Africa warehouse"
                              }
                              value="Consignee will collect at Asia Direct - Africa warehouse"
                            />
                          </div>
                          <div className="ps-0">
                            <label htmlFor="Destination2" className="my-0">
                              Consignee will collect at Asia Direct - Africa warehouse
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="me-2">
                            <input
                              type="radio"
                              id="Destination3"
                              name="Destination"
                              onChange={handlethird}
                              value="Consignee will collect at the nearest port"
                              checked={
                                thirdRadio ===
                                "Consignee will collect at the nearest port"
                              }
                            />
                          </div>
                          <div className="ps-0">
                            <label htmlFor="Destination3" className="my-0">
                              Consignee will collect at the nearest port
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="me-2">
                            <input
                              type="radio"
                              id="Destination4"
                              name="Destination"
                              onChange={handlethird}
                              checked={
                                thirdRadio ===
                                "Consignee will collect and facilitate import at destination port"
                              }
                              value="Consignee will collect and facilitate import at destination port"
                            />
                          </div>
                          <div className="ps-0">
                            <label htmlFor="Destination4" className="my-0">
                              Consignee will collect and facilitate import at destination port
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="borderShip">
                <h3 className="mb-3">Your Shipment Reference</h3>
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="labelTitle">Are you the</h5>
                    <div className="mt-2 shipRefer d-flex align-items-center">
                      <input
                        type="radio"
                        id="shipper"
                        name="shipper"
                        value="shipper"
                        checked={radioButton === "shipper"}
                        onChange={dddd}
                      />
                      <label htmlFor="shipper" className="mb-0">
                        Shipper
                      </label>
                      <input
                        type="radio"
                        id="consignee"
                        name="shipperOrConsignee"
                        value="consignee"
                        checked={radioButton === "consignee"}
                        onChange={dddd}
                      />
                      <label htmlFor="consignee" className="mb-0">
                        Consignee
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="borderShip">
                <h3 className="mb-3">Shipment Options</h3>
                <div className="row">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <h5 className="labelTitle">Insurance Required?</h5>
                    <div className="shipRefer d-flex align-items-center mt-2">
                      <input
                        type="radio"
                        onChange={handleInsuranceChange}
                        id="estYes1"
                        name="insurance"
                        value="Yes"
                        checked={insurance === "Yes"}
                      />
                      <label htmlFor="estYes1" className="mb-0">
                        Yes
                      </label>
                      <input
                        type="radio"
                        onChange={handleInsuranceChange}
                        id="estNo1"
                        name="insurance"
                        value="No"
                        checked={insurance === "No"}
                      />
                      <label htmlFor="estNo1" className="mb-0">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <h5 className="labelTitle">Send to Warehouse?</h5>
                    <div className="shipRefer d-flex align-items-center mt-2">
                      <input
                        type="radio"
                        id="warehouseOne"
                        name="send_to_warehouse"
                        value="Yes"
                        checked={warehousew === "Yes"}
                        onChange={warehouse2}
                      />
                      <label htmlFor="warehouseOne" className="mb-0">
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="warehouseTwo"
                        name="send_to_warehouse"
                        value="No"
                        checked={warehousew === "No"}
                        onChange={warehouse2}
                      />
                      <label htmlFor="warehouseTwo" className="mb-0">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h5 className="labelTitle">Assign to Clearing?</h5>
                    <div className="shipRefer d-flex align-items-center mt-2">
                      <input
                        type="radio"
                        id="clearingOne"
                        name="assign_to_clearing"
                        value="Yes"
                        checked={clearings === "Yes"}
                        onChange={clearing2}
                      />
                      <label htmlFor="clearingOne" className="mb-0">
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="clearingTwo"
                        name="assign_to_clearing"
                        checked={clearings === "No"}
                        value="No"
                        onChange={clearing2}
                      />
                      <label htmlFor="clearingTwo" className="mb-0">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="borderShip">
                <h3 className="mb-3">Location Details</h3>
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="mb-3">
                      <h5 className="labelTitle">Collection from</h5>
                      <select
                        value={inputData.collection_from}
                        name="collection_from"
                        onChange={handleInputChange}
                      >
                        <option value="">Select...</option>
                        {country.map((option, index) => (
                          <option key={index} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <h5 className="labelTitle">Port of Loading</h5>
                      <input
                        type="text"
                        name="port_of_loading"
                        onChange={handleInputChange}
                        value={inputData.port_of_loading}
                      />
                    </div>
                    <div>
                      <h5 className="labelTitle">Collection Address</h5>
                      <input
                        type="text"
                        name="collection_address"
                        onChange={handleInputChange}
                        value={inputData.collection_address}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h5 className="labelTitle">Delivery To</h5>
                      <select
                        value={inputData.delivery_to}
                        name="delivery_to"
                        onChange={handleInputChange}
                      >
                        <option value="">Select...</option>
                        {country.map((option, index) => (
                          <option key={index} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <h5 className="labelTitle">Port of Discharge</h5>
                      <input
                        type="text"
                        onChange={handleInputChange}
                        name="post_of_discharge"
                        value={inputData.post_of_discharge}
                      />
                    </div>
                    <div>
                      <h5 className="labelTitle">Delivery Address</h5>
                      <input
                        type="text"
                        onChange={handleInputChange}
                        name="delivery_address"
                        value={inputData.delivery_address}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="borderShip d-flex justify-content-between flex-wrap gap-3 align-items-center">
                <div>
                  <h3 className="mb-0" style={{ borderLeft: "none", paddingLeft: 0 }}>Document Section</h3>
                </div>
                <div>
                  <button className="btn btn_add_web" onClick={handleShow}>
                    Upload Documents
                  </button>
                  {show1 && (
                    <Modal
                      open={show1}
                      onClose={handleClose}
                      slotProps={{
                        backdrop: {
                          sx: { backgroundColor: "rgba(0,0,0,0.5)" },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 4,
                          bgcolor: "white",
                          borderRadius: 3,
                          width: 500,
                          mx: "auto",
                          mt: 10,
                          boxShadow: 24,
                          textAlign: "center",
                          backgroundImage:
                            "linear-gradient(135deg, #e3f2fd, #ffffff)",
                        }}
                      >
                        <h2 style={{ marginBottom: "20px", color: "#1976d2" }}>
                          📂 Upload Documents
                        </h2>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                          <InputLabel id="doc-select-label">
                            Select Document Type
                          </InputLabel>
                          <Select
                            labelId="doc-select-label"
                            onChange={handleSelect}
                            sx={{ borderRadius: 2, bgcolor: "#f5f5f5" }}
                          >
                            {docOptions.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <div className="mt-3">
                          {selectedDocs.map((doc, index) => (
                            <div
                              key={index}
                              className="mb-3"
                              style={{ textAlign: "left" }}
                            >
                              <label className="fw-bold">{doc.name}</label>
                              <input
                                type="file"
                                className="form-control"
                                multiple
                                accept="image/*,application/pdf"
                                onChange={(e) =>
                                  handleFileChangefil(e, doc.name)
                                }
                              />
                            </div>
                          ))}
                        </div>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            mt: 4,
                          }}
                        >
                          <Button
                            onClick={handleClose}
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              px: 3,
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={handleSave}
                            sx={{
                              borderRadius: 2,
                              px: 3,
                              backgroundImage:
                                "linear-gradient(45deg, #43a047, #66bb6a)",
                            }}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    </Modal>
                  )}
                </div>
              </div>

              <div className="borderShip">
                <h3 className="mb-3">Cargo Details</h3>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Product Description</h5>
                    <input
                      type="text"
                      onChange={handleInputChange}
                      name="product_desc"
                      value={inputData.product_desc}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Nature of Goods</h5>
                    <select
                      name="nature_of_goods"
                      onChange={handleInputChange}
                      value={inputData.nature_of_goods}
                    >
                      <option value="">Select...</option>
                      <option value="generalCargo">General cargo</option>
                      <option value="battery">Battery</option>
                      <option value="liquids">Liquids</option>
                      <option value="powders">Powders</option>
                      <option value="hazardous">Hazardous</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Package Type</h5>
                    <select
                      name="package_type"
                      onChange={handleInputChange}
                      value={inputData.package_type}
                    >
                      <option value="">Select...</option>
                      <option value="box">Box</option>
                      <option value="crate">Crate</option>
                      <option value="pallet">Pallet</option>
                      <option value="bags">Bags</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Commodity</h5>
                    <select
                      name="commodity"
                      onChange={handleInputChange}
                      value={inputData.commodity}
                    >
                      <option value="">Select...</option>
                      {apidata &&
                        apidata.length > 0 &&
                        apidata.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Total Packages</h5>
                    <input
                      type="text"
                      name="no_of_packages"
                      onChange={handleInputChange}
                      value={inputData.no_of_packages}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Auto Calculate</h5>
                    <input
                      type="text"
                      name="autoCalculate"
                      onChange={handleInputChange}
                      value={totaldimension}
                      disabled
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Total Dimension</h5>
                    <div className="unitDimention">
                      <input
                        type="text"
                        name="dimension"
                        onChange={handleInputChange}
                        value={inputData.dimension}
                      />
                      <select
                        className="form-select"
                        name="dimension_unit"
                        onChange={handleInputChange}
                      >
                        <option value="">Unit</option>
                        <option value="cm³">cm³</option>
                        <option value="m³">m³</option>
                        <option value="in³">in³</option>
                        <option value="ft³">ft³</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Total Weight</h5>
                    <div className="unitDimention">
                      <input
                        type="text"
                        name="weight"
                        onChange={handleInputChange}
                        value={inputData.weight}
                      />
                      <select
                        className="form-select"
                        name="weight_unit"
                        onChange={handleInputChange}
                      >
                        <option value="">Unit</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="lbs">lbs</option>
                        <option value="ton">ton</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Select Document</h5>
                    <select name="documentName" onChange={handleInputChange} value={inputData.documentName}>
                      <option value="">Select...</option>
                      <option value="Customs Documents">Customs docs</option>
                      <option value="Supporting Documents">Supporting docs</option>
                      <option value="Invoice, Packing List">Invoice / Packing L</option>
                      <option value="Product Literature">Product Literature</option>
                      <option value="Letters of authority">LOA</option>
                      <option value="Waybills">Freight Docs</option>
                      <option value="Waybills">Shipping instruction</option>
                      <option value="Supplier Invoices">Freight Invoices</option>
                      <option value="AD_Quotations">Attach Quote</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Type</h5>
                    <select
                      name="fcl_lcl"
                      value={inputData.fcl_lcl}
                      onChange={handleInputChange}
                    >
                      <option value="">Select...</option>
                      <option value="FCL">FCL</option>
                      <option value="LCL">LCL</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Comment</h5>
                    <input
                      type="text"
                      name="comment"
                      onChange={handleInputChange}
                      value={inputData.comment}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="labelTitle">Licenses</h5>
                    <input
                      type="file"
                      name="licenses"
                      onChange={handleFileChange2}
                      multiple
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="modalFooterActions">
            <button className="btn-cancel" onClick={handleUpdateClose}>
              Cancel
            </button>
            <button className="btn-submit" onClick={handleclicknavi}>
              Update Freight
            </button>
          </div>
        </Box>
      </Modal>
      <Modal open={formData5} onClose={handleUpdateClose5}>
        <Box className="filter-modal-overlay">
          <div className="filter-modal-header">
            <div className="filter-modal-header-left">
              <div className="filter-modal-icon-badge">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="7" x2="20" y2="7"></line>
                  <line x1="7" y1="12" x2="17" y2="12"></line>
                  <line x1="10" y1="17" x2="14" y2="17"></line>
                </svg>
              </div>
              <div className="filter-modal-titles">
                <h5 className="filter-modal-title">Filter Freights</h5>
                <p className="filter-modal-subtitle">
                  Filter by country route, date range, or freight criteria
                </p>
              </div>
            </div>
            <button
              type="button"
              className="filter-modal-close-btn"
              onClick={handleUpdateClose5}
              aria-label="Close"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="filter-modal-grid">
            <div className="filter-field-group">
              <label className="filter-field-label" htmlFor="mf-filter-origin">
                Collection from
              </label>
              <select
                id="mf-filter-origin"
                className="filter-control-select"
                name="origin"
                onChange={handechangefilter}
                value={inputvali.origin || ""}
              >
                <option value="">Select country...</option>
                {country?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-field-group">
              <label className="filter-field-label" htmlFor="mf-filter-destination">
                Destination
              </label>
              <select
                id="mf-filter-destination"
                className="filter-control-select"
                name="destination"
                onChange={handechangefilter}
                value={inputvali.destination || ""}
              >
                <option value="">Select country...</option>
                {country?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-field-group">
              <label className="filter-field-label" htmlFor="mf-filter-startDate">
                Start Date
              </label>
              <input
                type="date"
                id="mf-filter-startDate"
                className="filter-control-input"
                name="startDate"
                onChange={handechangefilter}
                value={inputvali.startDate || ""}
              />
            </div>

            <div className="filter-field-group">
              <label className="filter-field-label" htmlFor="mf-filter-endDate">
                End Date
              </label>
              <input
                type="date"
                id="mf-filter-endDate"
                className="filter-control-input"
                name="endDate"
                onChange={handechangefilter}
                value={inputvali.endDate || ""}
              />
            </div>

            <div className="filter-field-group">
              <label className="filter-field-label" htmlFor="mf-filter-freight">
                Freight Mode
              </label>
              <select
                id="mf-filter-freight"
                className="filter-control-select"
                name="freight"
                onChange={handechangefilter}
                value={inputvali.freight || ""}
              >
                <option value="">All Modes</option>
                <option value="Sea">Sea</option>
                <option value="Air">Air</option>
                <option value="Road">Road</option>
              </select>
            </div>

            <div className="filter-field-group">
              <label className="filter-field-label" htmlFor="mf-filter-type">
                Freight Type
              </label>
              <select
                id="mf-filter-type"
                className="filter-control-select"
                name="type"
                onChange={handechangefilter}
                value={inputvali.type || ""}
              >
                <option value="">All Types</option>
                <option value="express">Express</option>
                <option value="normal">Consolidation</option>
              </select>
            </div>
          </div>

          <div className="filter-modal-footer">
            <button
              type="button"
              className="filter-btn-reset"
              onClick={handleResetFilter}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              <span>Reset Filters</span>
            </button>
            <div className="filter-modal-footer-right">
              <button
                type="button"
                onClick={handleUpdateClose5}
                className="filter-btn-close"
              >
                Close
              </button>
              <button
                type="button"
                onClick={postapi}
                className="filter-btn-apply"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <ToastContainer />
      <FooterWeb />
    </div>
  );
}
