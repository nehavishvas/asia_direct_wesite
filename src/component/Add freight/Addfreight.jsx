 import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Box } from "@mui/system";
export default function AddFreight() {
  const [showAirOptions, setShowAirOptions] = useState(false);
  const [error, setError] = useState({});
  const [apidata, setApidata] = useState([]);
  const [clientdata, setClientdata] = useState([]);
  const [showRailOptions, setShowRailOptions] = useState(false);
  const [country, setCountry] = useState([]);
  const [formData2, setFormData2] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    freightOption: "",
    collectionFrom: "",
    seaOption: "",
    roadOption: "",
    expressOrNormal: "",
    origin: "",
    country: "",
    document: [],
    destination: "",
    customerReference: "",
    shipperOrConsignee: "",
    portOfLoading: "",
    collectionAddress: "",
    portOfDischarge: "",
    deliveryAddress: "",
    productDescription: "",
    totalPackages: "",
    totalDimension: "",
    natureOfGoods: "",
    packageType: "",
    totalWeight: "",
    autoCalculate: "",
    attachmentType: "",
    comment: "",
    attachments: "",
    assign_for_estimate: "",
    insurance: "",
    quote_received: "",
    client_quoted: "",
    assign_to_transporter: "",
    send_to_warehouse: "",
    assign_warehouse: "",
    assign_to_clearing: "",
    fcl_lcl: "",
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
    getdataap();
  }, []);
  
  const getdataap = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}getCommodities`)
      .then((response) => {
        console.log(response.data);
        setApidata(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const getdata = () => {
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
    getdata();
    getclient();
  }, []);

  const handleFreightOptionChange = (event) => {
    const value = event.target.value;
    setShowAirOptions(value === "Air");
    setShowRailOptions(value === "rail");
    setFormData({ ...formData, freightOption: value });
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleclicksubmit = () => {
    handlevalidfate(formData);
  };
  const handlevalidfate = (value) => {
    let error = {};
    let isValid = true;
    if (!value.freightOption) {
      error.freightOption = "Freight is required";
      isValid = false;
    }
    if (!value.origin) {
      error.origin = "Origin is required";
      isValid = false;
    }
    if (!value.Destination) {
      error.Destination = "Destination is required";
      isValid = false;
    }
    if (!value.collectionFrom) {
      error.collectionFrom = "Collection country is required";
      isValid = false;
    }
    if (!value.country) {
      error.country = "Country is required";
      isValid = false;
    }
    setError(error);
    if (isValid) {
      apihit();
    }
  };

  const totalcalc =
    167 * parseInt(formData.totalWeight);
  const apihit = () => {
    const data = new FormData();
    data.append("client_id", JSON.parse(localStorage.getItem("data"))?.id);
    data.append("date", formattedDate);
    data.append("product_desc", formData.productDescription);
    data.append("nature_of_goods", formData.natureOfGoods);
    data.append("delivery_address", formData.deliveryAddress);
    data.append("freight", formData.freightOption);
    data.append("priority", formData.priority);
    data.append("type", formData.type);
    data.append("no_of_packages", formData.totalPackages);
    data.append("weight", formData.totalWeight);
    data.append("dimension", formData.totalDimension);
    data.append("comment", formData.comment);
    data.append("port_of_loading", formData.portOfLoading);
    data.append("auto_calculate", totalcalc);
    data.append("package_type", formData.packageType);
    data.append("post_of_discharge", formData.portOfDischarge);
    data.append("add_attachments", formData.attachmentType);
    data.append("sea_freight_option", formData.seaOption);
    data.append("road_freight_option", formData.roadOption);
    data.append("commodity", formData.commodity);
    data.append("shipment_origin", formData.origin);
    data.append("shipment_des", formData.Destination);
    data.append("hazardous", formData.shipperOrConsignee);
    data.append("collection_from", formData.collectionFrom);
    data.append("delivery_to", formData.country);
    data.append("shipment_ref", formData.user_type);
    data.append("user_type", formData.customerReference);
    data.append("collection_address", formData.collectionAddress);
    data.append("assign_for_estimate", formData.assign_for_estimate);
    data.append("insurance", formData.insurance);
    data.append("quote_received", formData.quote_received);
    data.append("client_quoted", formData.client_quoted);
    data.append("send_to_warehouse", formData.send_to_warehouse);
    data.append("assign_to_clearing", formData.assign_to_clearing);
    data.append("ready_for_collection", formData.ready_for_collection);
    data.append("dimension_unit", formData.dimension_unit);
    data.append("weight_unit", formData.weight_unit);
    data.append("fcl_lcl", formData.fcl_lcl);
    data.append("documentName", formData.documentName);
    selectedDocs.forEach((doc) => {
      console.log("Doc Type:", doc.name);
      doc.files.forEach((file) => {
        data.append(doc.name, file); 
        console.log("File:", file.name, "| Size:", file.size, "bytes");
      });
    });
    if (formData2) {
      for (let i = 0; i < formData2.licenses.length; i++) {
        data.append("document", formData2.licenses[i]);
      }
    }
    axios
      .post(`${process.env.REACT_APP_BASE_URL}freight-add`, data)
      .then((response) => {
        toast.success(response.data.message);
        if (response.data.success === true) {
          setTimeout(() => {
            navigate("/freight-details");
          }, [1500]);
        } else {
          toast.error("something went wrong");
        }
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  const handlekey12 = (e) => {
    if (e.charCode < 44 || e.charCode > 57) {
      e.preventDefault();
    }
  };
  
  const handleclickprevious = () => {
    navigate("/freight-details");
  };
  const getclient = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}client-list`)
      .then((response) => {
        console.log(response.data.data);
        setClientdata(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data.data);
      });
  };
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return (
    <>
      <section class="sec_freight">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="page-banner full-row py-5">
                <div class="container">
                  <div class="row align-items-center">
                    <div class="col-md-6">
                      <div className="d-flex">
                        <Link
                          className="backArrow"
                          onClick={() => navigate(-1)}
                        >
                          <ArrowBack />
                        </Link>
                        <h3 class="fre_det_hd">Add Freight</h3>
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
            <div className="col-lg-8">
              <div className="borderShip mt-0">
                <h3 className="mb-4">Freight Details</h3>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="col-12 col-md-6  mainTool">
                      <h5>Date</h5>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleInputChange}
                        name="date"
                      />
                      <div className="toolSpace">
                        <p className="toolText">
                          Enter the date the freight details are valid for
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 mt-3">
                    <div className=" mainTool">
                      <h5>Freight Type</h5>
                      <select
                        name="freightOption"
                        id="freightOption"
                        onChange={handleFreightOptionChange}
                      >
                        <option value="">Select...</option>
                        <option value="Sea">Sea</option>
                        <option value="Air">Air</option>
                        <option value="Road">Road</option>
                        <option value="Rail">Rail</option>
                      </select>
                      <p className="text-danger mb-0">{error.freightOption}</p>
                      <div className="toolSpace">
                        <p className="toolText">
                          Select the mode of transport for your shipment.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 mainTool mt-3">
                    <h5>Freight Options</h5>
                    <select name="type" onChange={handleInputChange}>
                      <option value="">Select...</option>
                      <option value="express">Express</option>
                      <option value="normal">Consolidation</option>
                    </select>
                    <div className="toolSpace">
                      <p className="toolText">
                        Specify whether the freight is express or consolidated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="borderShip ">
                <div className="row">
                  <div className="col-lg-6 mainTool mb-3">
                    <div className="">
                      <h5>Ready for Collection</h5>
                      <select
                        name="ready_for_collection"
                        onChange={handleInputChange}
                      >
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="toolSpace">
                      <p className="toolText">
                        Specify whether the goods are prepared for pickup.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 mainTool">
                    <h5>Priority</h5>
                    <select name="priority" onChange={handleInputChange}>
                      <option value="">Select...</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <div className="toolSpace">
                      <p className="toolText">
                        Specify how urgently this shipment should be processed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="borderShip">
                <h3 className="mb-4">Shipment details</h3>
                <div className="row">
                  <div className="col-lg-6">
                    <h5>Origin</h5>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="">
                            <input
                              type="radio"
                              id="origin1"
                              onChange={handleInputChange}
                              name="origin"
                              value="Shipper will deliver at Asia Direct - Africa warehouse"
                            />
                          </div>
                          <div className="ms-2">
                            <label
                              for="origin1"
                              className="my-0 add_freight_label"
                            >
                              Shipper will deliver at Asia Direct - Africa
                              warehouse
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="">
                            <input
                              type="radio"
                              id="origin2"
                              onChange={handleInputChange}
                              name="origin"
                              value="Asia Direct will collect from shipper address"
                            />
                          </div>
                          <div className="ps-2">
                            <label
                              for="origin2"
                              className="my-0  add_freight_label"
                            >
                              Asia Direct will collect from shipper address
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="">
                            <input
                              type="radio"
                              id="origin3"
                              onChange={handleInputChange}
                              name="origin"
                              value="Shipper will deliver to the port of loading"
                            />
                          </div>
                          <div className="ps-2">
                            <label
                              for="origin3"
                              className="my-0 add_freight_label"
                            >
                              Shipper will deliver to the port of loading,
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="">
                            <input
                              type="radio"
                              id="origin4"
                              onChange={handleInputChange}
                              name="origin"
                              value="Shipper will deliver and facilitate export at the Port of loading"
                            />
                          </div>
                          <div className="ps-2">
                            <label
                              for="origin4"
                              className="my-0  add_freight_label"
                            >
                              Shipper will deliver and facilitate export at the
                              Port of loading
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-danger mb-0">{error.origin}</p>
                  </div>
                  <div className="col-lg-6 top10M">
                    <h5>Destination</h5>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="">
                            <input
                              type="radio"
                              id="Destination1"
                              onChange={handleInputChange}
                              name="Destination"
                              value="Asia Direct will deliver to the Address"
                            />
                          </div>
                          <div className="ps-2">
                            <label
                              for="Destination1"
                              className="my-0 add_freight_label"
                            >
                              Asia Direct will deliver to the Address
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="">
                            <input
                              type="radio"
                              id="Destination2"
                              onChange={handleInputChange}
                              name="Destination"
                              value="Consignee will collect at Asia Direct - Africa warehouse"
                            />
                          </div>
                          <div className="ps-2">
                            <label
                              for="Destination2"
                              className="my-0 add_freight_label"
                            >
                              Consignee will collect at Asia Direct - Africa
                              warehouse
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="">
                            <input
                              type="radio"
                              id="Destination3"
                              onChange={handleInputChange}
                              name="Destination"
                              value="Consignee will collect at the nearest port"
                            />
                          </div>
                          <div className="ps-2">
                            <label
                              for="Destination3"
                              className="my-0 add_freight_label"
                            >
                              Consignee will collect at the nearest port
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="parentShipper">
                      <div className="childshipper">
                        <div className="d-flex">
                          <div className="">
                            <input
                              type="radio"
                              id="Destination4"
                              onChange={handleInputChange}
                              name="Destination"
                              value="Consignee will collect and facilitate import at destination port"
                            />
                          </div>
                          <div className="ps-2">
                            <label
                              for="Destination4"
                              className="my-0  add_freight_label"
                            >
                              Consignee will collect and facilitate import at
                              destination port
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-danger mb-0">{error.Destination}</p>
                  </div>
                </div>
              </div>
              <div className="borderShip">
                <h3 className="mb-4">Shipment reference</h3>
                <div className="row">
                  <div className="col-lg-6">
                    <h5>Hazardous </h5>
                    <div className="shipRefer d-flex align-items-center">
                      <input
                        type="radio"
                        id="shipper"
                        name="shipperOrConsignee"
                        value="yes"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="shipper" className="mb-0">
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="consignee"
                        name="shipperOrConsignee"
                        value="no"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="consignee" className="mb-0">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 top10M">
                    <div className="">
                      <h5>I am the </h5>
                      <div className="shipRefer d-flex align-items-center">
                        <input
                          type="radio"
                          id="shipper"
                          name="user_type"
                          value="shipper"
                          onChange={handleInputChange}
                        />
                        <label htmlFor="shipper" className="mb-0">
                          Shipper
                        </label>
                        <input
                          type="radio"
                          id="consignee"
                          name="user_type"
                          value="consignee"
                          onChange={handleInputChange}
                        />
                        <label htmlFor="consignee" className="mb-0">
                          Consignee
                        </label>
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
                    <div className="col-lg-12 mainTool autoComplete">
                      <h5>Collection from</h5>
                      <Autocomplete
                        options={country || []}
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, value) => {
                          handleInputChange({
                            target: {
                              name: "collectionFrom",
                              value: value?.id || "", 
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Collection From"
                            variant="outlined"
                          />
                        )}
                      />
                      <div className="toolSpace">
                        <p className="toolText">
                          Specify the country from which goods will be picked up
                        </p>
                      </div>
                      <p className="text-danger mb-0">{error.collectionFrom}</p>
                    </div>
                    <div className="col-lg-12 my-3 mainTool">
                      <h5>Port of Loading</h5>
                      <input
                        type="text"
                        name="portOfLoading"
                        placeholder="Port of Loading"
                        onChange={handleInputChange}
                      />
                      <div className="toolSpace">
                        <p className="toolText">
                          Specify the loading port where goods will depart
                        </p>
                      </div>
                    </div>
                    <div className="my-3 mainTool">
                      <h5>Collection Address</h5>
                      <input
                        type="text"
                        name="collectionAddress"
                        placeholder="Collection Address"
                        onChange={handleInputChange}
                      />
                      <div className="toolSpace">
                        <p className="toolText">
                          Enter the full address where the cargo will be
                          collected.
                        </p>
                      </div>
                    </div>
                    <div className="col-12 mainTool mb-3">
                      <h5>Incoterm</h5>
                      <select name="incoterm" onChange={handleInputChange}>
                        <option value="">Select...</option>
                        <option value="CFR">CFR</option>
                        <option value="CIF">CIF</option>
                        <option value="DAP">DAP</option>
                        <option value="DDU">DDU</option>
                        <option value="DDP">DDP</option>
                        <option value="EXW">EXW</option>
                        <option value="FCA">FCA</option>
                        <option value="FOB">FOB </option>
                      </select>
                      <p className="text-danger mb-0">{error.incoterm}</p>
                      <div className="toolSpace">
                        <p className="toolText">
                          Specify the Incoterm for delivery and cost
                          obligations.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 ">
                    <div className="mainTool autoComplete">
                      <h5>Delivery To</h5>
                      <Autocomplete
                        options={country || []}
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, value) => {
                          handleInputChange({
                            target: {
                              name: "country",
                              value: value?.id || "", // same as your <select> value
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Delivery To" // 👈 works like <option>Select...</option>
                            variant="outlined"
                          />
                        )}
                      />
                      <div className="toolSpace">
                        <p className="toolText">
                          Specify the country of delivery for this shipment.
                        </p>
                      </div>
                      <p className="text-danger mb-0">{error.country}</p>
                    </div>
                    <div className="my-3 mainTool">
                      <h5>Port of Discharge</h5>
                      <input
                        type="text"
                        name="portOfDischarge"
                        placeholder="Port of Discharge"
                        onChange={handleInputChange}
                      />
                      <div className="toolSpace">
                        <p className="toolText">
                          Destination port where goods are unloaded.
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-12 my-3 mainTool">
                      <h5>Delivery Address</h5>
                      <input
                        type="text"
                        name="deliveryAddress"
                        placeholder="Delivery Address"
                        onChange={handleInputChange}
                      />
                      <div className="toolSpace">
                        <p className="toolText">
                          The complete address where goods will be delivered.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="borderShip">
                <h3 className="mb-4">Cargo details</h3>
                <div className="row">
                  <div className="col-lg-6 mainTool mb-3">
                    <div className="shipRefer col-lg-12">
                      <h5>Product Description</h5>
                      <input
                        type="text"
                        name="productDescription"
                        placeholder="Product Description"
                        className=" w-100"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="toolSpace">
                      <p className="toolText">
                        Details of the product being shipped.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 mb-3 mainTool autoComplete">
                    <h5>Commodity</h5>
                    <Autocomplete
                      options={apidata || []} 
                      getOptionLabel={(option) => option.name || ""} 
                      onChange={(event, value) => {
                        handleInputChange({
                          target: {
                            name: "commodity",
                            value: value ? value.id : "", 
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Commodity" />
                      )}
                    />
                    <div className="toolSpace">
                      <p className="toolText">
                        Specify the type of commodity being shipped.
                      </p>
                    </div>
                  </div>
                  {formData.shipperOrConsignee === "yes" ? (
                    <div className="col-lg-12 mainTool mb-3">
                      <h5>Nature of Goods</h5>
                      <select name="natureOfGoods" onChange={handleInputChange}>
                        <option value="">Select...</option>
                        <option value="generalCargo">General cargo</option>
                        <option value="battery">Battery</option>
                        <option value="liquids">Liquids</option>
                        <option value="powders">Powders</option>
                        <option value="hazardous">Hazardous</option>
                      </select>
                      <div className="toolSpace">
                        <p className="toolText">
                          Select the category of goods being transported. This
                          information ensures proper packaging, handling, and
                          compliance with shipping regulations.
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="row">
                  <div className="col-lg-6 mainTool mb-3">
                    <h5>Package Type</h5>
                    <select name="packageType" onChange={handleInputChange}>
                      <option value="">Select...</option>
                      <option value="box">Box</option>
                      <option value="crate">Crate</option>
                      <option value="pallet">Pallet</option>
                      <option value="bags">Bags</option>
                    </select>
                    <div className="toolSpace">
                      <p className="toolText">
                        Select the type of packaging used for the shipment.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 mainTool">
                    <h5>Total Packages</h5>
                    <input
                      type="text"
                      onKeyPress={handlekey12}
                      placeholder="Total Packages"
                      name="totalPackages"
                      onChange={handleInputChange}
                    />
                    <div className="toolSpace">
                      <p className="toolText">
                        Enter the total number of packages in the shipment.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 mt-3 mainTool ">
                    <h5>Total Dimension</h5>
                    <div className="unitDimention">
                      <input
                        type="text"
                        onKeyPress={handlekey12}
                        placeholder="Total Dimension"
                        name="totalDimension"
                        onChange={handleInputChange}
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
                    <div className="toolSpace">
                      <p className="toolText">
                        Enter the overall dimensions (L x W x H) of all packages
                        combined.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 mt-3 mainTool">
                    <h5>Total Weight</h5>
                    <div className="unitDimention">
                      <input
                        type="text"
                        onKeyPress={handlekey12}
                        placeholder="Total Weight"
                        name="totalWeight"
                        onChange={handleInputChange}
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
                    <div className="toolSpace">
                      <p className="toolText">
                        Enter the combined weight of all packages.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 mt-3 mainTool">
                    <h5>Volumetric Weight</h5>
                    <input
                      type="text"
                      value={totalcalc.toFixed(2)}
                      disabled
                      name="autoCalculate"
                      onChange={handleInputChange}
                    />
                    <div className="toolSpace">
                      <p className="toolText">
                        System auto-calculates total dimension and weight from
                        your entries
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 mt-3 mainTool">
                    <h5>Type</h5>
                    <select
                      type="text"
                      name="fcl_lcl"
                      onChange={handleInputChange}
                    >
                      <option>select...</option>
                      <option value={"FCL"}>FCL</option>
                      <option value={"LCL"}>LCL</option>
                    </select>
                    <div className="toolSpace">
                      <p className="toolText">
                        Choose Full Container Load (FCL) or Less than Container
                        Load (LCL).
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 mt-3 mainTool">
                    <h5>Comment</h5>
                    <input type="text" name="comment" placeholder="comment" />
                    <div className="toolSpace">
                      <p className="toolText">
                        {" "}
                        Add clarifications or special handling instructions, if
                        any
                      </p>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <button
                      type="submit"
                      className=" btn btn_add_web allFreFilter"
                      onClick={handleclicksubmit}
                    >
                      Add Freight
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div
                className="bookingProcess mt-0"
                style={{ marginBottom: "25px" }}
              >
                <h5>
                  Speed up your booking process by reusing details from a
                  previous booking
                </h5>
                <button onClick={handleclickprevious} className="shadow">
                  Show Previous Booking
                </button>
              </div>
              <div className="borderShip updateLoading mt-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <h5>Insurance</h5>
                        <div className="shipRefer d-flex align-items-center">
                          <input
                            type="radio"
                            onChange={handleInputChange}
                            id="estYes1"
                            name="insurance"
                            value="Yes"
                          />
                          <label htmlFor="estYes1" className="mb-0">
                            Yes
                          </label>
                          <input
                            type="radio"
                            onChange={handleInputChange}
                            id="estNo1"
                            name="insurance"
                            value="No"
                          />
                          <label htmlFor="estNo1" className="mb-0">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <p className="text-danger mb-0">
                      {error.assign_for_estimate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="borderShip updateLoading">
                <div className="row">
                  <div className="col-6">
                    <h5>Send to Warehouse</h5>
                    <div className="shipRefer d-flex align-items-center">
                      <input
                        type="radio"
                        id="warehouseOne"
                        name="send_to_warehouse"
                        defaultValue="yes"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="warehouseOne" className="mb-0">
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="warehouseTwo"
                        name="send_to_warehouse"
                        defaultValue="no"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="warehouseTwo" className="mb-0">
                        No
                      </label>
                    </div>
                    <p className="text-danger mb-0">
                      {error.send_to_warehouse}
                    </p>
                  </div>
                </div>
              </div>
              <div className="borderShip updateLoading">
                <div className="row">
                  <div className="col-12">
                    <h5>Assign to Clearing</h5>
                    <div className="shipRefer d-flex align-items-center">
                      <input
                        type="radio"
                        id="clearingOne"
                        name="assign_to_clearing"
                        value="Yes"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="clearingOne" className="mb-0">
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="clearingTwo"
                        name="assign_to_clearing"
                        value="No"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="clearingTwo" className="mb-0">
                        No
                      </label>
                    </div>
                    <p className="text-danger mb-0">
                      {error.assign_to_clearing}
                    </p>
                  </div>
                </div>
              </div>
              <div className="borderShip updateLoading">
                <div>
                  <label className="freight_hd">Document Section</label>
                </div>
                <div>
                  <button className="btn btn_add_web" onClick={handleShow}>
                    Upload Documents{" "}
                    <span>
                      <i class="fa fa-upload" aria-hidden="true"></i>
                    </span>
                  </button>

                  {show1 && (
                    <Modal
                      open={show1}
                      onClose={handleClose}
                      slotProps={{
                        backdrop: {
                          sx: { backgroundColor: "rgba(0,0,0,0.5)" }, // darker overlay background
                        },
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "white",
                          borderRadius: 3,
                          width: 500,
                          mx: "auto",
                          mt: 10,
                          boxShadow: 24, // nice shadow effect
                        }}
                      >
                        <div className="customHeader d-flex justify-content-between">
                          <h5>Upload Documents</h5>
                          <div className="crossBtn">
                            <i
                              onClick={handleClose}
                              variant="outlined"
                              sx={{
                                borderRadius: 2,
                                px: 3,
                              }}
                            >
                              <CloseIcon />
                            </i>
                          </div>
                        </div>
                        <div style={{ padding: "16px" }}>
                          <h5>Select Document Type</h5>
                          <FormControl fullWidth>
                            <Select
                              labelId="doc-select-label"
                              onChange={handleSelect}
                              sx={{ borderRadius: 2 }}
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
                                <h5 className="freight_hd">{doc.name}</h5>
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
                          <div className="text-center">
                            <button
                              variant="contained"
                              color="success"
                              onClick={handleSave}
                              className="btn btn_add_web allFreFilter"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </Box>
                    </Modal>
                  )}
                </div>
              </div>
              <div className="checkOffers">
                <h5>Check Asia Direct offers for your next vessel</h5>
                <p>
                  Please enter your location and container details to see the
                  offers.
                </p>
                <ul>
                  <li>
                    <i className="fi fi-rs-usd-circle"></i>{" "}
                    <span>Fixed price at booking</span>{" "}
                  </li>
                  <li>
                    {" "}
                    <i className="fi fi-rr-loading"></i>{" "}
                    <span>Loading Guarantee</span>{" "}
                  </li>
                  <li>
                    <i className="fi fi-rr-shuffle"></i>
                    <span>
                      Changes and cancellations Possible for a fee
                    </span>{" "}
                  </li>
                  <p>Spot rate is not applicable for our contract customers</p>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
