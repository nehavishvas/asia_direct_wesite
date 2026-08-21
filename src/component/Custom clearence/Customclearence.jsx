 import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SidebarWeb from "../homepage/SidebarwWeb";
import NavbarWeb from "../homepage/NavbarWeb";
import Arrow from "../../assestss/Group 2.png";
import FooterWeb from "../homepage/FooterWeb";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "./Customclearence.css";
const pageSize = 5;
export default function Customclearence() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const handleUpdateModalClose = () => setOpenUpdateModal(false);
  const [files, setFiles] = useState(null);
  const [formData2, setFormData2] = useState(null);
  const [country, setCountry] = useState([]);
  const [id, setId] = useState("");
  const [images, setImages] = useState({
    Supplier_invoice: null,
    Packing_list: null,
    Proof_of_payment: null,
    Waybill: null,
    Bill_of_lading: null,
    Arrival_notification: null,
    Product_brochures: null,
    Product_literature: null,
    Letter_of_authority: null,
  });
  const filteredData = data.filter((item) => {
    return (
      item.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clearance_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.goods_desc?.includes(searchQuery?.toLowerCase()) ||
      item.port_of_entry_name
        ?.toLowerCase()
        ?.includes(searchQuery?.toLowerCase()) ||
      item.port_of_exit_name
        ?.toLowerCase()
        ?.includes(searchQuery?.toLowerCase())
    );
  });

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

  // Handle dropdown change
  const handleSelect = (e) => {
    const selected = e.target.value;
    if (selected && !selectedDocs.find((doc) => doc.name === selected)) {
      setSelectedDocs([...selectedDocs, { name: selected, files: [] }]);
    }
  };

  // Handle file upload for each document type
  const handleFileChangefil = (e, docName) => {
    const files = Array.from(e.target.files);
    setSelectedDocs((prev) =>
      prev.map((doc) => (doc.name === docName ? { ...doc, files } : doc))
    );
  };

  // For saving data (you can send to API)
  const handleSave = () => {
    console.log("Uploaded Documents:", selectedDocs);

    // To see filenames instead of [object Object]
    selectedDocs.forEach((doc) => {
      console.log("Doc Type:", doc);
      doc.files.forEach((file) => {
        console.log("File:", file.name, "| Size:", file.size, "bytes");
      });
    });

    handleClose();
  };
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const startindex = (currentPage - 1) * pageSize;
  const endIndex = startindex + pageSize;
  const currentdata = filteredData.slice(startindex, endIndex);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const getdata = JSON.parse(localStorage.getItem("data"));
  const getdatat = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}get-client-clearing`, {
        user_id: getdata.id,
      })
      .then((response) => {
        setData(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getdatat();
  }, []);
  ////////////////////////////////////////////////////update clearence ///////////////////////
  const [predata, setPredata] = useState({});
  const handleidvali = (id) => {
    const useridche = data.filter((item) => {
      return item.id === id;
    });
    console.log(useridche[0]);
    const userdata = useridche[0];
    setPredata((prevData) => ({
      ...prevData,
      clearing_id: userdata.clearing_id,
      freight: userdata.freight,
      freight_option: userdata.freight_option,
      is_Import_Export: userdata.is_Import_Export,
      is_cong_shipp: userdata.is_cong_shipp,
      customer_ref: userdata.customer_ref,
      goods_desc: userdata.goods_desc,
      nature_of_goods: userdata.nature_of_goods,
      packing_type: userdata.packing_type,
      total_dimension: userdata.total_dimension,
      total_box: userdata.total_box,
      total_weight: userdata.total_weight,
      destination: userdata.destination,
      loading_country: userdata.loading_country,
      discharge_country: userdata.discharge_country,
      port_of_loading: userdata.port_of_loading,
      port_of_discharge: userdata.port_of_discharge,
      clearing_id: userdata.id,
      document_req: userdata.document_req,
      document: userdata.document,
      document_name: userdata.document_name,
      comment_on_docs: userdata.comment_on_docs,
    }));
  };
  const hanldechange = (e) => {
    const { name, value } = e.target;
    setPredata({ ...predata, [name]: value });
  };

  const dataid = JSON.parse(localStorage.getItem("data"));
  const updatedata = () => {
    const formdata = new FormData();
    formdata.append("clearing_id", predata.clearing_id);
    formdata.append("client", dataid?.id);
    formdata.append("comment_on_docs", predata.comment_on_docs);
    formdata.append("uploaded_by", "2");
    formdata.append("freight", predata.freight);
    formdata.append("Freight_option", predata.freight_option);
    formdata.append("is_Import_Export", predata.is_Import_Export);
    formdata.append("is_cong_shipp", predata.is_cong_shipp);
    formdata.append("customer_ref", predata.customer_ref);
    formdata.append("goods_desc", predata.goods_desc);
    formdata.append("nature_of_goods", predata.nature_of_goods);
    formdata.append("packing_type", predata.packing_type);
    formdata.append("total_dimesion", predata.total_dimension);
    formdata.append("total_box", predata.total_box);
    formdata.append("total_weight", predata.total_weight);
    formdata.append("destination", predata.destination);
    formdata.append("loading_country", predata.loading_country);
    formdata.append("discharge_country", predata.discharge_country);
    formdata.append("port_of_loading", predata.port_of_loading);
    formdata.append("port_of_discharge", predata.port_of_discharge);
    formdata.append("documentName", predata.documentName);
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
    axios
      .post(`${process.env.REACT_APP_BASE_URL}update-clearing`, formdata)
      .then((response) => {
        getdatat();
        toast.success("Update clearance successfully");
        setOpenUpdateModal(false);
        console.log(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  const handleclicknavi = (id) => {
    console.log(id);
    const userdata1 = data.filter((item) => {
      return item.id === id;
    });
    navigate("/clearence-details", { state: { data: userdata1[0] } });
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
          .post(`${process.env.REACT_APP_BASE_URL}delete-clearing`, {
            clearing_id: id,
          })
          .then((response) => {
            getdatat();
            toast.success(response.data.message);
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
  const handleclickbnavigatethe = () => {
    navigate("/Add-Custom-clearence");
  };
  const handleclickuoploaddoc = (item) => {
    setOpenModal(true);
    setId(item.id);
  };
  const handleFileChange2 = (event) => {
    const files = event.target.files;
    setFormData2({ ...formData2, licenses: files });
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleFileChangeimg = (e) => {
    const { name, files } = e.target;
    setImages((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };
  const handlepostimahe = () => {
    if (
      !images.Supplier_invoice &&
      !images.Packing_list &&
      !images.Proof_of_payment &&
      !images.Waybill &&
      !images.Bill_of_lading &&
      !images.Arrival_notification &&
      !images.Product_brochures &&
      !images.Product_literature &&
      !images.Letter_of_authority
    ) {
      toast.error("Please select at least one document to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("supplier_invoice", images.Supplier_invoice);
    formData.append("packing_list", images.Packing_list);
    formData.append("proof_of_payment", images.Proof_of_payment);
    formData.append("waybill", images.Waybill);
    formData.append("bill_of_lading", images.Bill_of_lading);
    formData.append("arrival_notification", images.Arrival_notification);
    formData.append("product_brochures", images.Product_brochures);
    formData.append("product_literature", images.Product_literature);
    formData.append("letter_of_authority", images.Letter_of_authority);
    formData.append("clearance_id", id);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}upload-clrearance-doc`, formData)
      .then((response) => {
        toast.success(response.data.message);
        setOpenModal(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  useEffect(() => {
    getcountry();
  }, []);
  const getcountry = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}country-list`)
      .then((response) => {
        setCountry(response.data.data);
      })
      .catch((error) => {
        toast.errror(error.response.data.data);
      });
  };

  const handleInputChangefile = (e) => {
    const file = e.target.files[0];
    setFiles(file);
  };
  return (
    <div>
      <NavbarWeb />
      <SidebarWeb />
      <>
        <section className="manageFrightSec">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                {data.length == 0 ? (
                  <div></div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center flex-wrap my-3">
                    <div className="">
                      <h4 className="para_det me-4">Clearance Details</h4>
                    </div>
                    <div className="d-flex justify-content-end align-items-center flex-wrap fretDeatilBtn">
                      <div>
                        <input
                          className="py-1 px-2 rounded customSearch"
                          value={searchQuery}
                          onChange={handleSearch}
                          placeholder="Search"
                        ></input>
                      </div>
                      <div>
                        <button
                          className=" add_button"
                          onClick={() => {
                            navigate("/Add-Custom-clearence");
                          }}
                        >
                          Add clearance
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {data.length == 0 ? (
                  <>
                    <p className="text-center fs-1 fw-bold  my-5">
                      Believe in Our service{" "}
                    </p>
                    <div className="text-center mb-5">
                      <button
                        className="btn btn-danger text-center"
                        onClick={handleclickbnavigatethe}
                      >
                        Add Clearance
                      </button>
                    </div>
                    <p className=" text-center">
                      You have not added any clearance Order before{" "}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="card border-0">
                      <div className="card-body">
                        <div
                          className="table-responsive"
                          style={{ minHeight: "50vh" }}
                        >
                          <table className="table table-striped tableICon">
                            <thead>
                              <tr>
                                <th style={{ width: "35%" }}>Client & Cargo</th>
                                <th style={{ width: "35%" }}>Route</th>
                                <th style={{ width: "15%" }}>Documents</th>
                                <th style={{ width: "15%", textAlign: "right" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentdata &&
                                currentdata.length > 0 &&
                                currentdata.map((item, index) => {
                                  console.log(currentdata);
                                  return (
                                    <>
                                      <tr key={index}>
                                        <td className="list_bd">
                                          <div className="d-flex align-items-center">
                                            <p
                                              className="client_nm"
                                              onClick={() => {
                                                handleclicknavi(item?.id);
                                              }}
                                            >
                                              {item.client_name}
                                            </p>
                                            <p
                                              className="fright_no mx-2"
                                              onClick={() => {
                                                handleclicknavi(item?.id);
                                              }}
                                            >
                                              {item.clearance_number}
                                            </p>
                                          </div>
                                          <div className="">
                                            <p
                                              className="origin"
                                              onClick={() => {
                                                handleclicknavi(item?.id);
                                              }}
                                            >
                                              {item.goods_desc}
                                            </p>
                                          </div>
                                          <div className="">
                                            {item.quotation_status == "0" ? (
                                              <button className="dec_btn dot_icon">
                                                <FiberManualRecordIcon />
                                                pending
                                              </button>
                                            ) : item.quotation_status == "1" ? (
                                              <button className="acc_btn dot_icon">
                                                <FiberManualRecordIcon />
                                                Accept
                                              </button>
                                            ) : item.quotation_status == "2" ? (
                                              <button className="dec_btn dot_icon">
                                                <FiberManualRecordIcon />
                                                Declined
                                              </button>
                                            ) : item.quotation_status == "3" ? (
                                              <button className="dec_btn dot_icon">
                                                <FiberManualRecordIcon />
                                                Move to Order
                                              </button>
                                            ) : item.quotation_status == "4" ? (
                                              <button className="dec_btn dot_icon">
                                                <FiberManualRecordIcon />
                                                Estimated
                                              </button>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </td>
                                        <td>
                                          <div
                                            className="country_mnge"
                                            onClick={() => {
                                              handleclicknavi(item?.id);
                                            }}
                                          >
                                            {item.port_of_entry_name}
                                            <img
                                              src={Arrow}
                                              className="flag_img1"
                                            />
                                            {item.port_of_exit_name}
                                          </div>
                                        </td>
                                        <td>
                                          {item.quotation_status === "1" ? (
                                            <button
                                              onClick={() => {
                                                handleclickuoploaddoc(item);
                                              }}
                                              className="btn upload_btn"
                                            >
                                              <CloudUploadIcon />
                                              Upload Doc
                                            </button>
                                          ) : (
                                            "----"
                                          )}
                                        </td>
                                        <td className="">
                                          <p className="port_date">
                                            {new Date(
                                              item.created_at
                                            ).toLocaleDateString("en-GB")}
                                          </p>
                                          <div className="text-end">
                                            <div className="dropdown">
                                              <a
                                                href=""
                                                type="button"
                                                className="act_btn dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                              >
                                                Action
                                              </a>
                                              <div
                                                className="dropdown-menu drop_down"
                                                aria-labelledby="dropdownMenuButton1"
                                              >
                                                <div className="btnManageFreight">
                                                  <div className="drpIcons dropdown-item item_drop">
                                                    {item.status === "2" ? (
                                                      <p></p>
                                                    ) : (
                                                      // <i onClick={() => { handlenavi() }}><MessageIcon style={{ fontSize: "20px" }} /></i>
                                                      <a
                                                        className="link_bdy"
                                                        href="https://chat.whatsapp.com/C1SiwQek53B434FSz4BjQo"
                                                        target="_blank"
                                                      >
                                                        <WhatsAppIcon className="text-success" />
                                                        Whatsapp
                                                      </a>
                                                    )}
                                                  </div>
                                                  <div
                                                    className="drpIcons dropdown-item item_drop"
                                                    onClick={() => {
                                                      handledelete(item.id);
                                                    }}
                                                  >
                                                    <i className="fa fa-trash icon_align"></i>
                                                    Delete
                                                  </div>
                                                  <div className="">
                                                    {item.status === "2" ? (
                                                      <p></p>
                                                    ) : (
                                                      <div
                                                        className="drpIcons dropdown-item item_drop drop_item1"
                                                        onClick={() => {
                                                          handleidvali(item.id);
                                                          setOpenUpdateModal(true);
                                                        }}
                                                      >
                                                        <i className="fa fa-edit icon_align"></i>
                                                        Edit
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  );
                                })}
                            </tbody>
                          </table>
                          <div className="text-center d-flex justify-content-center align-items-center">
                            <button
                              disabled={currentPage === 1}
                              className="bg_page"
                              onClick={() => handlePageChange(currentPage - 1)}
                            >
                              <i class="fi fi-rr-angle-small-left page_icon"></i>
                            </button>
                            <span className="mx-2">{` ${currentPage}`}</span>
                            <button
                              disabled={currentPage === totalPage}
                              className="bg_page"
                              onClick={() => handlePageChange(currentPage + 1)}
                            >
                              <i class="fi fi-rr-angle-small-right page_icon"></i>
                            </button>
                          </div>                          <Modal open={openUpdateModal} onClose={handleUpdateModalClose}>
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
                                <h5>Update Custom Clearance</h5>
                                <div className="crossBtn">
                                  <i onClick={handleUpdateModalClose} aria-hidden="true">
                                    <CloseIcon />
                                  </i>
                                </div>
                              </div>
                              <section className="manageModal flex-grow-1 overflow-auto">
                                <div className="container px-0">
                                  <div className="borderShip mt-0">
                                    <h3 className="mb-3">Clearance Details</h3>
                                    <div className="row">
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">Freight</label>
                                        <select
                                          onChange={hanldechange}
                                          value={predata.freight}
                                          name="freight"
                                        >
                                          <option value="">Select...</option>
                                          <option value="Sea">Sea</option>
                                          <option value="Air">Air</option>
                                          <option value="Road">Road</option>
                                          <option value="Rail">Rail</option>
                                        </select>
                                      </div>
                                      {predata.freight_option && (
                                        <div className="col-md-6 mb-3">
                                          <label className="text-dark">Freight Option</label>
                                          <input
                                            type="text"
                                            value={predata.freight_option}
                                            onChange={hanldechange}
                                            name="freight_option"
                                            placeholder="Freight Option"
                                          />
                                        </div>
                                      )}
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">I would like to</label>
                                        <select
                                          value={predata.is_Import_Export}
                                          onChange={hanldechange}
                                          name="is_Import_Export"
                                        >
                                          <option value="">Select...</option>
                                          <option value="import">Import</option>
                                          <option value="export">Export</option>
                                        </select>
                                      </div>
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">I am the</label>
                                        <select
                                          value={predata.is_cong_shipp}
                                          onChange={hanldechange}
                                          name="is_cong_shipp"
                                        >
                                          <option value="">Select...</option>
                                          <option value="Shipper">Shipper</option>
                                          <option value="Consignee">Consignee</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="borderShip">
                                    <h3 className="mb-3">Port Clearing Details</h3>
                                    <div className="row">
                                      <div className="col-md-6 mb-3 autoComplete">
                                        <label className="text-dark">Port of Entry Country</label>
                                        <Autocomplete
                                          options={country || []}
                                          getOptionLabel={(option) => option.country_name || ""}
                                          value={
                                            country.find((c) => c.country_id === predata.loading_country) || null
                                          }
                                          onChange={(event, newValue) => {
                                            hanldechange({
                                              target: {
                                                name: "loading_country",
                                                value: newValue ? newValue.country_id : "",
                                              },
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              placeholder="Select Country"
                                              variant="outlined"
                                            />
                                          )}
                                        />
                                      </div>
                                      <div className="col-md-6 mb-3 autoComplete">
                                        <label className="text-dark">Port of Exit Country</label>
                                        <Autocomplete
                                          options={country || []}
                                          getOptionLabel={(option) => option.country_name || ""}
                                          value={
                                            country.find((c) => c.country_id === predata.discharge_country) || null
                                          }
                                          onChange={(event, newValue) => {
                                            hanldechange({
                                              target: {
                                                name: "discharge_country",
                                                value: newValue ? newValue.country_id : "",
                                              },
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              placeholder="Select Discharge Country"
                                              variant="outlined"
                                            />
                                          )}
                                        />
                                      </div>
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">Port of Origin</label>
                                        <input
                                          name="port_of_loading"
                                          value={predata.port_of_loading}
                                          onChange={hanldechange}
                                        />
                                      </div>
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">Port of Entry Port</label>
                                        <input
                                          name="port_of_discharge"
                                          value={predata.port_of_discharge}
                                          onChange={hanldechange}
                                        />
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
                                              backgroundImage: "linear-gradient(135deg, #e3f2fd, #ffffff)",
                                            }}
                                          >
                                            <h2 style={{ marginBottom: "20px", color: "#1976d2" }}>
                                              📂 Upload Documents
                                            </h2>
                                            <FormControl fullWidth sx={{ mt: 2 }}>
                                              <InputLabel id="doc-select-label">Select Document Type</InputLabel>
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
                                                <div key={index} className="mb-3" style={{ textAlign: "left" }}>
                                                  <label className="fw-bold">{doc.name}</label>
                                                  <input
                                                    type="file"
                                                    className="form-control"
                                                    multiple
                                                    accept="image/*,application/pdf"
                                                    onChange={(e) => handleFileChangefil(e, doc.name)}
                                                  />
                                                </div>
                                              ))}
                                            </div>
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                                              <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, px: 3 }}>
                                                Cancel
                                              </Button>
                                              <Button
                                                variant="contained"
                                                color="success"
                                                onClick={handleSave}
                                                sx={{
                                                  borderRadius: 2,
                                                  px: 3,
                                                  backgroundImage: "linear-gradient(45deg, #43a047, #66bb6a)",
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
                                        <label className="text-dark">Goods Description</label>
                                        <input
                                          type="text"
                                          value={predata.goods_desc}
                                          onChange={hanldechange}
                                          name="goods_desc"
                                          placeholder="Description"
                                        />
                                      </div>
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">Nature of Goods</label>
                                        <select
                                          value={predata.nature_of_goods}
                                          onChange={hanldechange}
                                          name="nature_of_goods"
                                        >
                                          <option value="">Select...</option>
                                          <option value="General Cargo">General Cargo</option>
                                          <option value="Battery">Battery</option>
                                          <option value="Liquid">Liquid</option>
                                          <option value="Powder">Powder</option>
                                          <option value="Harzadous">Hazardous</option>
                                        </select>
                                      </div>
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">Packing Type</label>
                                        <select
                                          value={predata.packing_type}
                                          onChange={hanldechange}
                                          name="packing_type"
                                        >
                                          <option value="">Select...</option>
                                          <option value="Box">Box</option>
                                          <option value="Crate">Crate</option>
                                          <option value="Pallet">Pallet</option>
                                          <option value="Bags">Bags</option>
                                        </select>
                                      </div>
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">No of Packages</label>
                                        <input
                                          value={predata.total_box}
                                          onChange={hanldechange}
                                          placeholder="0"
                                          name="total_box"
                                        />
                                      </div>
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">Total Weight</label>
                                        <div className="unitDimention">
                                          <input
                                            value={predata.total_weight}
                                            onChange={hanldechange}
                                            placeholder="0.00"
                                            name="total_weight"
                                          />
                                          <select name="weight_unit" onChange={hanldechange} value={predata.weight_unit || "kg"}>
                                            <option value="kg">kg</option>
                                            <option value="g">g</option>
                                            <option value="lbs">lbs</option>
                                            <option value="ton">ton</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">Total Dimension</label>
                                        <div className="unitDimention">
                                          <input
                                            onChange={hanldechange}
                                            value={predata.total_dimension}
                                            placeholder="0.00"
                                            name="total_dimension"
                                          />
                                          <select name="dimension_unit" onChange={hanldechange} value={predata.dimension_unit || "cm³"}>
                                            <option value="cm³">cm³</option>
                                            <option value="m³">m³</option>
                                            <option value="in³">in³</option>
                                            <option value="ft³">ft³</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">Destination</label>
                                        <input
                                          type="text"
                                          value={predata.destination}
                                          onChange={hanldechange}
                                          name="destination"
                                        />
                                      </div>
                                      <div className="col-md-6 mb-3">
                                        <label className="text-dark">Comment On Docs</label>
                                        <input
                                          type="text"
                                          value={predata.comment_on_docs}
                                          onChange={hanldechange}
                                          name="comment_on_docs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>
                              <div className="modalFooterActions">
                                <button className="btn-cancel" onClick={handleUpdateModalClose}>
                                  Cancel
                                </button>
                                <button className="btn-submit" onClick={updatedata}>
                                  Submit
                                </button>
                              </div>
                            </Box>
                          </Modal>
                        </div>
                      </div>
                    </div>
                    <Modal open={openModal} onClose={handleCloseModal}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 400,
                          bgcolor: "background.paper",
                          boxShadow: 24,
                          p: 4,
                          borderRadius: 2,
                          height: 500,
                          overflow: "scroll",
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="h1"
                          className="col-12 mb-3"
                        >
                          Upload Clearance Document
                        </Typography>
                        <form>
                          <div className="form-group">
                            <label htmlFor="uploadDoc">Supplier Invoice</label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              id="uploadDoc"
                              name="Supplier_invoice"
                              onChange={handleFileChangeimg}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="uploadDoc">Packing List</label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              id="uploadDoc"
                              name="Packing_list"
                              onChange={handleFileChangeimg}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="uploadDoc">Proof of Payment</label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              id="uploadDoc"
                              name="Proof_of_payment"
                              onChange={handleFileChangeimg}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="uploadDoc">Waybill</label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              id="uploadDoc"
                              name="Waybill"
                              onChange={handleFileChangeimg}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="uploadDoc">Bill of Lading</label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              id="uploadDoc"
                              name="Bill_of_lading"
                              onChange={handleFileChangeimg}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="uploadDoc">Product Brochures</label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              id="uploadDoc"
                              name="Product_brochures"
                              onChange={handleFileChangeimg}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="uploadDoc">
                              Product Literature
                            </label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              id="uploadDoc"
                              name="Product_literature"
                              onChange={handleFileChangeimg}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="uploadDoc">
                              Letter of Authority
                            </label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              id="uploadDoc"
                              name="Letter_of_authority"
                              onChange={handleFileChangeimg}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="uploadDoc">
                              Arrival Notification
                            </label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              id="uploadDoc"
                              name="Arrival_notification"
                              onChange={handleFileChangeimg}
                            />
                          </div>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handlepostimahe}
                          >
                            Upload
                          </Button>
                        </form>
                      </Box>
                    </Modal>
                    <ToastContainer />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        <FooterWeb />
      </>
    </div>
  );
}
