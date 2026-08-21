import React, { useEffect, useState, useContext } from 'react';
import Topbar from '../Topbar';
import Navbar from '../homepage/Navbar';
import Footer from '../homepage/Footer';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../MyContext';
import SaveIcon from '@mui/icons-material/Save';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import "./Updateprofile.css";

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><circle cx='12' cy='8' r='4'/><path d='M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z'/></svg>";


export default function UpdateProfile() {

    const [selectedImage, setSelectedImage] = useState('default-image-url.jpg');
    const [userData, setUserData] = useState({});
    const [error, setError] = useState({});
    const [country, setCountry] = useState([]);
    const [file, setFile] = useState(null);
    const { text, setText } = useContext(MyContext)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        setFile(file);
    };

    const handlefunclocal = () => {
        localStorage.setItem("profile2", JSON.stringify(selectedImage))
    }

    const fetchData = () => {
        const user = JSON.parse(localStorage.getItem('data'));
        axios.post(`${process.env.REACT_APP_BASE_URL}client-details`, {
            client_id: user?.id
        })
            .then((response) => {
                console.log(response.data.data)
                setUserData(response.data.data);
                if (response.data.data.profile) {
                    setSelectedImage(response?.data?.data?.profile);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.msg);
            });
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleUpdate = () => {
        handlevalidate(userData)
    }
    const handlevalidate = (value) => {
        let error = {}
        if (!value.email) {
            error.email = "Email is required"
            toast.error("Email is Required")
        }
        if (!value.telephone) {
            error.telephone = "telephone is required"
            toast.error("Telephone is Required")
        }
        if (!value.cellphone) {
            error.cellphone = "Cellphone is Required"
            toast.error("Cellphone is Required")
        } else {
            apihit()
        }
        setError(error)
    }

    const apihit = () => {
        const user = JSON.parse(localStorage.getItem('data'));
        const formData = new FormData();
        formData.append('client_id', user.id);
        formData.append('email', userData.email);
        formData.append('address_1', userData.address_1);
        formData.append('address_2', userData.address_2);
        formData.append('city', userData.city);
        formData.append('code', userData.code);
        formData.append('telephone', userData.telephone);
        formData.append('contact_person', userData.contact_person);
        formData.append('cellphone', userData.cellphone);
        formData.append('country_code', userData.country_code);
        formData.append('country', userData.country);
        formData.append('province', userData.province);
        formData.append('client_name', userData.full_name);
        formData.append('importers_ref', userData.importers_ref);
        formData.append('tax_ref', userData.tax_ref);
        formData.append('company_id', userData.company_id);
        if (file) {
            formData.append('profile', file);
        }
        console.log(formData)
        axios.post(`${process.env.REACT_APP_BASE_URL}update-client-profile`, formData)
            .then((response) => {
                handlefunclocal();

                setText(response.data.data[0].profile)
                console.log(response.data.data);
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/My-profile', { state: { dataloc: file } });
                }, 500);
            })
            .catch((error) => {
                console.log(error.response.data.message);
                toast.error(error.response.data.message);
            });
    };
    const file1212 = userData.profile
    console.log(file1212)
    console.log(process.env.REACT_APP_BASE_URL_image)

    const handlekeypreaa = (e) => {
        if (e.charCode < 48 || e.charCode > 57) {
            e.preventDefault();
        }
    };


    const getdata = () => {
        axios
            .get(`${process.env.REACT_APP_BASE_URL}GetCountries`)
            .then((response) => {
                console.log(response.data.data)
                setCountry(response.data.data);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };
    useEffect(() => {
        getdata()
    }, [])
    return (
        <>
            <Topbar />
            <Navbar />
            <div className="up-wrapper">
                <div className="up-container">
                    
                    {/* Header */}
                    <div className="up-header">
                        <h1 className="up-title">Update Profile</h1>
                        <p className="up-subtitle">Modify your personal settings and contact coordinates</p>
                    </div>

                    <div className="up-card">
                        <div className="row">
                            {/* Left Column (Avatar Upload) */}
                            <div className="col-lg-4 mb-4">
                                <div className="up-left-card">
                                    <div className="up-avatar-wrapper">
                                        <img
                                            src={
                                                selectedImage && selectedImage !== 'default-image-url.jpg'
                                                    ? selectedImage.startsWith('blob:')
                                                        ? selectedImage
                                                        : `${process.env.REACT_APP_BASE_URL_image}${selectedImage}`
                                                    : userData.profile && userData.profile !== "null" && userData.profile !== "undefined"
                                                        ? `${process.env.REACT_APP_BASE_URL_image}${userData.profile}`
                                                        : DEFAULT_AVATAR
                                            }
                                            className="up-avatar"
                                            alt="profile preview"
                                            onError={(e) => {
                                                e.target.src = DEFAULT_AVATAR;
                                            }}
                                        />
                                    </div>
                                    <div className="up-form-group w-100 align-items-center">
                                        <label className="up-upload-btn">
                                            <CameraAltIcon fontSize="small" className="me-2" />
                                            Choose Profile Photo
                                            <input
                                                type="file"
                                                name="profile"
                                                onChange={handleImageChange}
                                                style={{ display: "none" }}
                                                accept="image/*"
                                            />
                                        </label>
                                        {file && <span className="up-file-name">{file.name}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Form Inputs) */}
                            <div className="col-lg-8">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">Full Name</label>
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={userData?.full_name || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">
                                                Email <span className="up-required">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={userData?.email || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">Address 1</label>
                                            <input
                                                type="text"
                                                name="address_1"
                                                value={userData?.address_1 || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">Address 2</label>
                                            <input
                                                type="text"
                                                name="address_2"
                                                value={userData?.address_2 || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={userData?.city || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">Postal Code</label>
                                            <input
                                                type="text"
                                                name="code"
                                                value={userData?.code || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Cellphone Input */}
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">
                                                Cellphone <span className="up-required">*</span>
                                            </label>
                                            <div className="d-flex gap-2">
                                                <div style={{ flex: "0 0 90px" }}>
                                                    <select
                                                        name="country_code"
                                                        value={userData?.country_code || ""}
                                                        onChange={handleChange}
                                                        className="up-select"
                                                    >
                                                        <option value="">Code</option>
                                                        {country &&
                                                            country.length > 0 &&
                                                            country.map((item, index) => (
                                                                <option key={index} value={item.id}>
                                                                    +{item.phonecode}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <input
                                                        type="text"
                                                        name="cellphone"
                                                        value={userData?.cellphone || ""}
                                                        onKeyPress={handlekeypreaa}
                                                        maxLength={13}
                                                        onChange={handleChange}
                                                        className="up-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Telephone Input */}
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">
                                                Telephone <span className="up-required">*</span>
                                            </label>
                                            <div className="d-flex gap-2">
                                                <div style={{ flex: "0 0 90px" }}>
                                                    <select
                                                        name="country_code"
                                                        value={userData?.country_code || ""}
                                                        onChange={handleChange}
                                                        className="up-select"
                                                    >
                                                        <option value="">Code</option>
                                                        {country &&
                                                            country.length > 0 &&
                                                            country.map((item, index) => (
                                                                <option key={index} value={item.id}>
                                                                    +{item.phonecode}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <input
                                                        type="text"
                                                        name="telephone"
                                                        value={userData?.telephone || ""}
                                                        onKeyPress={handlekeypreaa}
                                                        maxLength={13}
                                                        onChange={handleChange}
                                                        className="up-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">Country</label>
                                            <select
                                                name="country"
                                                value={userData?.country || ""}
                                                onChange={handleChange}
                                                className="up-select"
                                            >
                                                <option value="">Select country...</option>
                                                {country &&
                                                    country.length > 0 &&
                                                    country.map((item, index) => (
                                                        <option key={index} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">Province</label>
                                            <input
                                                type="text"
                                                name="province"
                                                value={userData?.province || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">Company ID</label>
                                            <input
                                                type="text"
                                                name="company_id"
                                                value={userData?.company_id || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">Tax Ref</label>
                                            <input
                                                type="text"
                                                name="tax_ref"
                                                value={userData?.tax_ref || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">Importer Ref</label>
                                            <input
                                                type="text"
                                                name="importers_ref"
                                                value={userData?.importers_ref || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="up-form-group">
                                            <label className="up-label">Contact Person</label>
                                            <input
                                                type="text"
                                                name="contact_person"
                                                value={userData?.contact_person || ""}
                                                onChange={handleChange}
                                                className="up-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="up-action-area">
                                    <button className="up-btn" onClick={handleUpdate}>
                                        <SaveIcon fontSize="small" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ToastContainer />
            <Footer />
        </>
    );
}