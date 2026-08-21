 import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../Topbar";
import Navbar from "../homepage/Navbar";
import Footer from "../homepage/Footer";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import "./Customclearence.css";

export default function Addclearing() {
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [country, setCountry] = useState([]);
  const [formData2, setFormData2] = useState(null);
  const [freightMode, setFreightMode] = useState("");
  const [data, setData] = useState({
    user_id: "",
    freight: "",
    freight_option: "",
    is_Import_Export: "",
    is_cong_shipp: "",
    customer_ref: "",
    goods_desc: "",
    nature_of_goods: "",
    packing_type: "",
    total_dimension: "",
    total_box: "",
    total_weight: "",
    destination: "",
    loading_country: "",
    discharge_country: "",
    port_of_loading: "",
    port_of_discharge: "",
    comment_on_docs: "",
    added_by: "",
    document: "",
    document_name: "",
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const userid = JSON.parse(localStorage.getItem("data"));
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    console.log(data.industry);
  };
  const handleInputChangefile = (e) => {
    const file = e.target.file;
    setSelectedImage(file);
  };
  const handleFreightModeChange = (e) => {
    const { value } = e.target;
    setFreightMode(value);
    setData({ ...data, customer_ref: value });
  };
  const handleclick = () => {
    handleapi(data);
  };
  const handlevalidate = (value) => {
    let error = {};
    // if (!value.customer_ref) {
    //   error.customer_ref = "Customer reference is required";
    // }
    if (!value.trans_reference) {
      error.trans_reference = "Transaction reference is required";
    }
    // if (!value.goods_desc) {
    //   error.goods_desc = "Goods description is required";
    // }
    if (!value.port_of_entry) {
      error.port_of_entry = "Port of entry is required";
    }
    if (!value.is_cong_shipp) {
      error.is_cong_shipp = "shipper or consignee is required";
    }
    if (!value.destination) {
      error.destination = "Destination is required";
    } else {
      handleapi();
    }
    setError(error);
  };

  const handleFileChange2 = (event) => {
    const files = event.target.files;
    setFormData2({ ...formData2, licenses: files });
  };
  const handleapi = () => {
    console.log(data.industry);
    const formdata = new FormData();
    formdata.append("freight", data?.freight);
    formdata.append("freight_option", data.freight_option);
    formdata.append("is_Import_Export", data.is_Import_Export);
    formdata.append("is_cong_shipp", data.is_cong_shipp);
    formdata.append("goods_desc", data.goods_desc);
    formdata.append("nature_of_goods", data.nature_of_goods);
    formdata.append("packing_type", data.packing_type);
    formdata.append("total_dimension", data.total_dimension);
    formdata.append("total_box", data.total_box);
    formdata.append("total_weight", data.total_weight);
    formdata.append("loading_country", data.loading_country);
    formdata.append("discharge_country", data.discharge_country);
    formdata.append("port_of_discharge", data.port_of_discharge);
    formdata.append("port_of_loading", data.port_of_loading);
    formdata.append("added_by", "2");
    formdata.append("user_id", userid?.id);
    formdata.append("customer_ref", data?.customer_ref);
    formdata.append("destination", data?.destination);
    formdata.append("dimension_unit", data?.dimension_unit);
    formdata.append("weight_unit", data?.weight_unit);
    // formdata.append("document", selectedImage);
    formdata.append("comment_on_docs", data?.comment_on_docs);
    console.log(data.document);
    formdata.append("documentName", data?.documentName);
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
    for (let [key, value] of formdata.entries()) {
      console.log(`${key} : ${value}`);
    }
    axios
      .post(`${process.env.REACT_APP_BASE_URL}add-clearing-customer`, formdata)
      .then((response) => {
        if (response.data.success === true) {
          console.log(response.data);
          toast.success(response.data.message);
          setTimeout(() => {
            navigate("/calculate-clearence", {
              state: { dataIID: response.data.data },
            });
          }, 500);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  useEffect(() => {
    getcountry();
  }, []);
  const getcountry = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}country-list`)
      .then((response) => {
        console.log(response.data.data);
        setCountry(response.data.data);
      })
      .catch((error) => {
        toast.errror(error.response.data.data);
      });
  };
  // const destinations = [
  //   { label: "South Africa" },
  //   { label: "Thailand" },
  //   { label: "Dubai" },
  //   { label: "Singapore" },
  //   { label: "United States" },
  //   { label: "United Kingdom" },
  // ];
  // 9-9
  const getLabel = () => {
    if (!data.packing_type) return "Number of Packages";
    return `Number of ${data.packing_type}${
      data.packing_type.endsWith("s") ? "" : "s"
    }`;
  };

  const getHelperText = () => {
    if (!data.packing_type) return "Provide the quantity being shipped.";
    return `Provide the number of ${data.packing_type.toLowerCase()} being shipped.`;
  };
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}GetCountries`)
      .then((res) => {
        console.log("pratima", res.data.data);
        setCountries(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
      });
  }, []);

  return (
    <div>
      <Topbar />
      <Navbar />
      <>
        <section class="sec_freight">
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-12">
                <div class="page-banner full-row">
                  <div class="container">
                    <div class="row align-items-center">
                      <div className="col-md-6">
                        <div className="d-flex">
                          <Link
                            className="backArrow"
                            onClick={() => navigate(-1)}
                          >
                            <ArrowBack />
                          </Link>
                          <h3 class="fre_det_hd">Custom Clearance</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="frightFormSec">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="borderShip mt-0">
                  <h3 className="mb-3">Custom Clearance Details</h3>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h5>Freight</h5>
                      <div className="mainTool">
                        <select
                          className="form-control"
                          onChange={handleFreightModeChange}
                          name="freight"
                        >
                          <option value="">Select...</option>
                          <option value="Sea">Sea</option>
                          <option value="Air">Air</option>
                          <option value="Road">Road</option>
                          <option value="Rail">Rail</option>
                        </select>
                        <div className="toolSpace">
                          <p className="toolText">
                            Select the mode of freight transportation (Sea, Air,
                            Road, or Rail).
                          </p>
                        </div>
                      </div>
                    </div>
                    {freightMode === "Air" && (
                      <div className="col-md-6 mb-3">
                        <label htmlFor="">Air Freight Option </label>
                        <div className="mainTool">
                          <select
                            name="freight_option"
                            required
                            onChange={handleInputChange}
                          >
                            <option value="">Select...</option>
                            <option value="Economy">Economy</option>
                            <option value="Express">Express</option>
                            <option value="Cargo Priority">
                              Cargo Priority
                            </option>
                          </select>
                          <div className="toolSpace">
                            <p className="toolText">
                              Select this option if you prefer faster delivery
                              via air transportation
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {freightMode === "Sea" && (
                      <div className="col-md-6 mb-3">
                        <label htmlFor="">Sea Freight Option</label>
                        <div className="mainTool">
                          <select
                            name="freight_option"
                            required
                            onChange={handleInputChange}
                          >
                            <option value="">Select...</option>
                            <option value="Indian Ocean">Indian Ocean</option>
                            <option value="Pacific Ocean">Pacific Ocean</option>
                            <option value="Atlantic Ocean">
                              Atlantic Ocean
                            </option>
                          </select>
                          <div className="toolSpace">
                            <p className="toolText">
                              Choose sea freight for cost-effective shipping of
                              larger or heavier goods
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-md-6 mb-3">
                      <h5>Destination</h5>
                      <div className="autoComplete mainTool">
                        <Autocomplete
                          disablePortal
                          options={countries || []}
                          getOptionLabel={(option) => option.name || ""}
                          onChange={(event, value) => {
                            handleInputChange({
                              target: {
                                name: "destination",
                                value: value?.id || "",
                              },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Destination"
                              required
                            />
                          )}
                        />
                        <div className="toolSpace">
                          <p className="toolText">
                            Enter the country or location where the goods will
                            be delivered.
                          </p>
                        </div>
                      </div>
                      <p className="text-danger mb-0"> {error.destination}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <h5 className="mb-0">I would like to</h5>
                      <div className="shipRefer d-flex align-items-center">
                        <input
                          type="radio"
                          id="status_import"
                          name="is_Import_Export"
                          defaultValue="import"
                          value="import"
                          onChange={handleInputChange}
                        />
                        <label htmlFor="status_import" className="mb-0">
                          Import
                        </label>

                        <input
                          type="radio"
                          id="status_export"
                          name="is_Import_Export"
                          defaultValue="export"
                          value="export"
                          onChange={handleInputChange}
                        />
                        <label htmlFor="status_export" className="mb-0">
                          Export
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <h5 className="mb-0">I am the</h5>
                      <div className="shipRefer d-flex align-items-center">
                        <input
                          type="radio"
                          id="status_shipper"
                          name="is_cong_shipp"
                          defaultValue="Shipper"
                          value="Shipper"
                          onChange={handleInputChange}
                        />
                        <label htmlFor="status_shipper" className="mb-0">
                          Shipper
                        </label>

                        <input
                          type="radio"
                          id="status_consignee"
                          name="is_cong_shipp"
                          defaultValue="Consignee"
                          value="Consignee"
                          onChange={handleInputChange}
                        />
                        <label htmlFor="status_consignee" className="mb-0">
                          Consignee
                        </label>
                      </div>
                      <p className="text-danger mb-0">
                        {error.is_cong_shipp}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="borderShip">
                  <h3 className="mb-3">Port Clearing Details</h3>
                  <div className="row">
                    <div className="col-md-6 mb-3 autoComplete mainTool">
                      <h5>Port of Loading Country</h5>
                      <Autocomplete
                        options={country || []}
                        getOptionLabel={(option) => option.country_name || ""}
                        onChange={(e, value) => {
                          handleInputChange({
                            target: {
                              name: "loading_country",
                              value: value?.country_id || "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Port of Loading Country"
                            required
                          />
                        )}
                      />
                      <div className="toolSpace">
                        <p className="toolText">
                          Select the country where the goods will be loaded onto
                          the vessel for export. This is the origin country of
                          the shipment
                        </p>
                      </div>
                      <p className="text-danger mb-0">{error.port_of_exit}</p>
                    </div>
                    <div className="col-md-6 mb-3 autoComplete mainTool">
                      <h5>Port of Discharge Country</h5>
                      <Autocomplete
                        options={country || []}
                        getOptionLabel={(option) => option.country_name || ""}
                        onChange={(event, newValue) => {
                          handleInputChange({
                            target: {
                              name: "discharge_country",
                              value: newValue ? newValue.country_id : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Port of Discharge Country"
                            variant="outlined"
                          />
                        )}
                      />
                      <div className="toolSpace">
                        <p className="toolText">
                          Select the country where the goods will be unloaded
                          from the vessel. This is the destination country of
                          the shipment.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3 mainTool">
                      <h5>Port of Loading</h5>
                      <input
                        type="text"
                        name="port_of_loading"
                        className="form-control"
                        onChange={handleInputChange}
                      ></input>
                      <div className="toolSpace">
                        <p className="toolText">
                          Select the specific port where your cargo will be
                          loaded onto the vessel at the origin country.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3 mainTool">
                      <h5>Port of Discharge</h5>
                      <input
                        type="text"
                        name="port_of_discharge"
                        className="form-control"
                        onChange={handleInputChange}
                      ></input>
                      <div className="toolSpace">
                        <p className="toolText">
                          Select the port where your cargo will be unloaded at
                          the destination country
                        </p>
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
                            backgroundImage: "linear-gradient(135deg, #e3f2fd, #ffffff)",
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
                    <div className="col-md-6 mb-3 mainTool">
                      <h5>Product Description</h5>
                      <input
                        className="form-control"
                        onChange={handleInputChange}
                        name="goods_desc"
                      ></input>
                      <div className="toolSpace">
                        <p className="toolText">
                          Enter key features and details of your product
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3 mainTool">
                      <h5>Nature of Goods</h5>
                      <select
                        className="form-select"
                        onChange={handleInputChange}
                        name="nature_of_goods"
                      >
                        <option value="">Select...</option>
                        <option value="General Cargo">General Cargo</option>
                        <option value="Battery">Battery</option>
                        <option value="Liquid">Liquid</option>
                        <option value="Powder">Powder</option>
                        <option value="Harzadous">Hazardous</option>
                      </select>
                      <div className="toolSpace">
                        <p className="toolText">
                          Specify the Nature of goods being shipped for proper
                          handling.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3 mainTool">
                      <h5>Packing Type</h5>
                      <select
                        className="form-select"
                        onChange={handleInputChange}
                        name="packing_type"
                      >
                        <option value="">Select...</option>
                        <option value="Box">Box</option>
                        <option value="Crate">Crate</option>
                        <option value="Pallet">Pallet</option>
                        <option value="Bag">Bag</option>
                      </select>
                      <div className="toolSpace">
                        <p className="toolText">
                          Specify the type of packing used for shipment.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3 mainTool">
                      <h5>Total Dimension</h5>
                      <div className="unitDimention">
                        <input
                          className="form-control"
                          onChange={handleInputChange}
                          placeholder="0.00"
                          name="total_dimension"
                        ></input>
                        <select
                          className="form-select"
                          name="dimension_unit"
                          value={data.dimension_unit || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">Unit</option>
                          <option value="cm³">cm³</option>
                          <option value="m³">m³</option>
                          <option value="in³">in³</option>
                          <option value="ft³">ft³</option>
                        </select>
                      </div>
                      <div className="toolSpace">
                        <p className="toolText">
                          Specify the complete size of the shipment.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3 mainTool">
                      <h5>{getLabel()}</h5>
                      <input
                        className="form-control"
                        onChange={handleInputChange}
                        placeholder={`Enter number of ${
                          data.packing_type
                            ? data.packing_type.toLowerCase() + "s"
                            : "packages"
                        }`}
                        name="total_box"
                        value={data.total_box}
                      />
                      <div className="toolSpace">
                        <p className="toolText">{getHelperText()}</p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3 mainTool">
                      <h5>Total weight</h5>
                      <div className="unitDimention">
                        <input
                          className="form-control"
                          onChange={handleInputChange}
                          placeholder="0.00"
                          name="total_weight"
                        ></input>
                        <select
                          className="form-select"
                          name="weight_unit"
                          value={data.weight_unit || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">Unit</option>
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="lbs">lbs</option>
                          <option value="ton">ton</option>
                        </select>
                      </div>
                      <div className="toolSpace">
                        <p className="toolText">
                          Provide the overall weight of the shipment.
                        </p>
                      </div>
                    </div>

                    <div className="col-md-12 mb-3 mainTool">
                      <h5>Comment on Docs</h5>
                      <textarea
                        rows="4"
                        className="form-control"
                        onChange={handleInputChange}
                        name="comment_on_docs"
                      />
                      <div className="toolSpace">
                        <p className="toolText">
                          Add any remarks or notes related to shipping
                          documents.
                        </p>
                      </div>
                    </div>

                    <div className="text-center my-4">
                      <button className="btn btnFreight2" onClick={handleclick}>
                        Add Clearance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      <Footer />
      <ToastContainer />
    </div>
  );
}
