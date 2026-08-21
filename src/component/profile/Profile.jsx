import React, { useEffect, useState } from 'react'
import Topbar from '../Topbar'
import Navbar from '../homepage/Navbar'
import Footer from '../homepage/Footer'
import image from "../../assestss/slide5.jpg"
import logoprofile from '../../assestss/logoasia.png'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EditIcon from "@mui/icons-material/Edit";
import "./Profile.css";

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><circle cx='12' cy='8' r='4'/><path d='M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z'/></svg>";

export default function Profile() {

  const [userData, setUserData] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0)
  }, [])

  const handleclicknavi = () => {
    navigate('/update-profile')
  }

  const location = useLocation()
  console.log(location?.state?.dataloc)
  const userdata = JSON.parse(localStorage.getItem('data'))
  console.log(userdata)
  const fetchData = () => {
    const user = JSON.parse(localStorage.getItem('data'));
    axios.post(`${process.env.REACT_APP_BASE_URL}client-details`, {
      client_id: user?.id
    }).then((response) => {
      console.log(response.data.data)
      setUserData(response?.data?.data)
    }).catch((error) => { toast.error(error.response.data.message) })
  };
  return (
    <div>
      <Topbar />
      <Navbar />
      <div className="prf-wrapper">
        <div className="prf-container">
          
          {/* Header */}
          <div className="prf-header">
            <h1 className="prf-title">Profile Details</h1>
            <p className="prf-subtitle">Manage and view your personal details and business credentials</p>
          </div>

          <div className="row">
            {/* Left Card */}
            <div className="col-lg-4 col-md-5 mb-4">
              <div className="prf-card prf-left-card">
                <div className="prf-avatar-wrapper">
                  <img
                    src={
                      userData.profile && userData.profile !== "null" && userData.profile !== "undefined"
                        ? `${process.env.REACT_APP_BASE_URL_image}${userData.profile}`
                        : DEFAULT_AVATAR
                    }
                    className="prf-avatar"
                    alt="user profile"
                    onError={(e) => {
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
                <h3 className="prf-name text-capitalize">{userdata?.full_name || "N/A"}</h3>
                <span className="prf-badge">Client</span>

                <div className="prf-divider"></div>
                <h5 className="prf-section-title">Contact Details</h5>

                <div className="prf-contact-list">
                  <div className="prf-contact-item">
                    <span className="prf-contact-icon">
                      <MailOutlineIcon fontSize="small" />
                    </span>
                    <div className="prf-contact-content">
                      <span className="prf-contact-label">Email</span>
                      <span className="prf-contact-value">{userdata?.email || "N/A"}</span>
                    </div>
                  </div>

                  <div className="prf-contact-item">
                    <span className="prf-contact-icon">
                      <PhoneIcon fontSize="small" />
                    </span>
                    <div className="prf-contact-content">
                      <span className="prf-contact-label">Tele Phone</span>
                      <span className="prf-contact-value">{userData?.telephone || "N/A"}</span>
                    </div>
                  </div>

                  <div className="prf-contact-item">
                    <span className="prf-contact-icon">
                      <PhoneAndroidIcon fontSize="small" />
                    </span>
                    <div className="prf-contact-content">
                      <span className="prf-contact-label">Cell Phone</span>
                      <span className="prf-contact-value">{userdata?.cellphone || "N/A"}</span>
                    </div>
                  </div>

                  <div className="prf-contact-item">
                    <span className="prf-contact-icon">
                      <HomeOutlinedIcon fontSize="small" />
                    </span>
                    <div className="prf-contact-content">
                      <span className="prf-contact-label">Address 1</span>
                      <span className="prf-contact-value">{userData?.address_1 || userdata?.address_1 || "N/A"}</span>
                    </div>
                  </div>

                  <div className="prf-contact-item">
                    <span className="prf-contact-icon">
                      <HomeOutlinedIcon fontSize="small" />
                    </span>
                    <div className="prf-contact-content">
                      <span className="prf-contact-label">Address 2</span>
                      <span className="prf-contact-value">{userData?.address_2 || userdata?.address_2 || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card Panel */}
            <div className="col-lg-8 col-md-7 mb-4">
              <div className="prf-right-panels">
                
                {/* Location Settings Card */}
                <div className="prf-card">
                  <h5 className="prf-section-title">Location Settings</h5>
                  <div className="prf-grid">
                    <div className="prf-detail-box">
                      <span className="prf-detail-label">City</span>
                      <span className="prf-detail-value">{userData?.city || userdata?.city || "N/A"}</span>
                    </div>

                    <div className="prf-detail-box">
                      <span className="prf-detail-label">Province</span>
                      <span className="prf-detail-value">{userData?.province || userdata?.province || "N/A"}</span>
                    </div>

                    <div className="prf-detail-box">
                      <span className="prf-detail-label">Country</span>
                      <span className="prf-detail-value">{userData?.country_name || userdata?.country_name || "N/A"}</span>
                    </div>

                    <div className="prf-detail-box">
                      <span className="prf-detail-label">Postal Code</span>
                      <span className="prf-detail-value">{userData?.code || userdata?.code || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Company & References Card */}
                <div className="prf-card">
                  <h5 className="prf-section-title">Company & References</h5>
                  <div className="prf-grid">
                    <div className="prf-detail-box">
                      <span className="prf-detail-label">Company ID</span>
                      <span className="prf-detail-value">{userData?.company_id || userdata?.company_id || "N/A"}</span>
                    </div>

                    <div className="prf-detail-box">
                      <span className="prf-detail-label">Importers Reference</span>
                      <span className="prf-detail-value">{userData?.importers_ref || userdata?.importers_ref || "N/A"}</span>
                    </div>

                    <div className="prf-detail-box">
                      <span className="prf-detail-label">Tax Reference</span>
                      <span className="prf-detail-value">{userdata?.tax_ref || userData?.tax_ref || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Actions area */}
                <div className="prf-action-area">
                  <button className="prf-btn" onClick={handleclicknavi}>
                    <EditIcon fontSize="small" />
                    Update Profile
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
}
