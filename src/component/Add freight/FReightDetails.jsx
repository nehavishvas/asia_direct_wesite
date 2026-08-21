import React, { useEffect, useState } from "react";
import Topbar from "../Topbar";
import Navbar from "../homepage/Navbar";
import Footer from "../homepage/Footer";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from "react-toastify";
import "./FReightDetails.css";
export default function FreightDetails() {
  const location = useLocation();
  const [document, setDocument] = useState([]);
  const [document1, setDocument1] = useState([]);
  const [packing, setPacking] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [documents, setDocuments] = useState({});
  const data1 = location?.state?.printdata[0];
  console.log(data1);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  
  useEffect(()=>{
    GetFreightImages()
  },[])
  // const GetFreightImages = () => {
  //   const data = { freight_id: data1.id };
  //   axios
  //     .post(`${process.env.REACT_APP_BASE_URL}GetFreightImages`, data)
  //     .then((response) => {
  //       setDocument(response.data.data["Supplier Invoice"]);
  //       setLicenses(response.data.data["Licenses"]);
  //       setDocument1(response.data.data["Other Documents"]);
  //       setPacking(response.data.data["Packing List"]);
  //       console.log(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.log(error.response.data);
  //     });
  // };

  const deleteapi =(id) =>{
    console.log(id)
    const data11={
      doc_id:id
    }
    axios.post(`${process.env.REACT_APP_BASE_URL}DeleteDocument`,data11).then((response)=>{
      GetFreightImages();
      toast.success(response.data.message)
    }).catch((error)=>{
      console.log(error.response.data)
    })
  }
     const GetFreightImages = () => {
    const data = { freight_id:data1.id,uploaded_by:"2" };
  
    axios
      .post(`${process.env.REACT_APP_BASE_URL}GetFreightImages`, data)
      .then((response) => {
        console.log(response.data.data);
  
        // Save all groups (Customs, Packing, Invoices, Licenses, etc.)
        setDocuments(response.data.data);
      })
      .catch((error) => {
        console.log(error.response?.data);
      });
  };
  return (
    <div>
      <Topbar />
      <Navbar />
      
      {/* Banner */}
      <section className="sec_freight">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="page-banner full-row">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h3 className="fre_det_hd">Freight Details</h3>
                    </div>
                    <div className="col-md-6">
                      <nav className="float-start float-md-end">
                        <ol className="breadcrumb m-0">
                          <li className="breadcrumb-item">
                            <a href="/">Home</a>
                          </li>
                          <li className="breadcrumb-item active">
                            <Link to={"/freight-details"}>
                              All Freight Details
                            </Link>
                          </li>
                        </ol>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="fd-container">
        <div className="row mt-2">
          
          {/* Column 1: Shipper Details */}
          <div className="col-md-4 mb-4">
            <div className="fd-card">
              <h6 className="fd-card-title">Shipper Details</h6>
              
              <h6 className="fd-section-header">Company Details</h6>
              <table className="fd-table">
                <tbody>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Shipper:</td>
                    <td className="fd-value-cell">{data1.full_name || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Contact Person:</td>
                    <td className="fd-value-cell">{data1.contact_person || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Cell:</td>
                    <td className="fd-value-cell">{data1.cellphone || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Telephone:</td>
                    <td className="fd-value-cell">{data1.telephone || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Email:</td>
                    <td className="fd-value-cell">{data1.email || "N/A"}</td>
                  </tr>
                </tbody>
              </table>

              <h6 className="fd-section-header">Pickup Address</h6>
              <table className="fd-table">
                <tbody>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Address 1:</td>
                    <td className="fd-value-cell">{data1.address_1 || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">City:</td>
                    <td className="fd-value-cell">{data1.city || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Country:</td>
                    <td className="fd-value-cell">{data1.country || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Postal Code:</td>
                    <td className="fd-value-cell">{data1.code || "N/A"}</td>
                  </tr>
                </tbody>
              </table>

              <h6 className="fd-section-header">Export Details</h6>
              <table className="fd-table">
                <tbody>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Exporter:</td>
                    <td className="fd-value-cell">Asia Direct</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Export Code:</td>
                    <td className="fd-value-cell">204101</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Vat/Tax No:</td>
                    <td className="fd-value-cell">{data1.tax_ref || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 2: Attachments */}
          <div className="col-md-4 mb-4">
            <div className="fd-card">
              <h6 className="fd-card-title">Attachments & Documents</h6>
              
              <div className="main_det p-0">
                {Object.keys(documents).length > 0 ? (
                  Object.keys(documents).map((groupName, groupIndex) => (
                    <div key={groupIndex} className="fd-doc-group">
                      <h6 className="fd-doc-group-label">{groupName}</h6>
                      <div className="fd-doc-list">
                        {documents[groupName] && documents[groupName].length > 0 ? (
                          documents[groupName].map((item) => (
                            <div key={item.id} className="fd-doc-item">
                              <a
                                href={`${process.env.REACT_APP_BASE_URLdocument}${item?.document}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fd-doc-link"
                              >
                                View Document
                              </a>
                              <DeleteIcon
                                onClick={() => deleteapi(item.id)}
                                className="fd-delete-btn"
                                fontSize="small"
                              />
                            </div>
                          ))
                        ) : (
                          <p className="fd-empty-docs">No files attached</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="fd-empty-docs text-center my-auto">No attached files found for this freight.</p>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Booking Information */}
          <div className="col-md-4 mb-4">
            <div className="fd-card">
              <h6 className="fd-card-title">Booking Information</h6>
              
              <h6 className="fd-section-header">POL Information</h6>
              <table className="fd-table">
                <tbody>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Place of Loading:</td>
                    <td className="fd-value-cell">{data1.port_of_loading || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Port of Loading:</td>
                    <td className="fd-value-cell">{data1.port_of_loading || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Instructions:</td>
                    <td className="fd-value-cell">{data1.shipment_origin || "N/A"}</td>
                  </tr>
                </tbody>
              </table>

              <h6 className="fd-section-header">Transit Information</h6>
              <table className="fd-table">
                <tbody>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Freight Option:</td>
                    <td className="fd-value-cell">{data1.freight_type || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Type:</td>
                    <td className="fd-value-cell">{data1.fcl_lcl || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Insurance:</td>
                    <td className="fd-value-cell">{data1.insurance || "N/A"}</td>
                  </tr>
                </tbody>
              </table>

              <h6 className="fd-section-header">POD Information</h6>
              <table className="fd-table">
                <tbody>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Place of delivery:</td>
                    <td className="fd-value-cell">{data1.place_of_delivery || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Port of Discharge:</td>
                    <td className="fd-value-cell">{data1.post_of_discharge || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Instructions:</td>
                    <td className="fd-value-cell">{data1.shipment_des || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Comment:</td>
                    <td className="fd-value-cell">{data1.comment || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Cargo Details Card */}
        <div className="row my-2">
          <div className="col-md-12 mb-4">
            <div className="fd-card">
              <h6 className="fd-card-title">Cargo Details</h6>
              
              <table className="fd-table">
                <tbody>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Product Description:</td>
                    <td className="fd-value-cell">{data1.product_desc || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Hazardous:</td>
                    <td className="fd-value-cell">{data1.nature_of_goods || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Packaging:</td>
                    <td className="fd-value-cell">{data1.package_type || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Commodity:</td>
                    <td className="fd-value-cell">{data1.commodity || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">No of Packages:</td>
                    <td className="fd-value-cell">{data1.no_of_packages || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Dimensions (cbm):</td>
                    <td className="fd-value-cell">{data1.dimension || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Weight (kgs):</td>
                    <td className="fd-value-cell">{data1.weight || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Vol weight (kgs):</td>
                    <td className="fd-value-cell">{data1.auto_calculate || "N/A"}</td>
                  </tr>
                  <tr className="fd-row">
                    <td className="fd-label-cell">Attachment Name:</td>
                    <td className="fd-value-cell">{data1.add_attachments || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <ToastContainer />
    </div>
  );
}
