// import React, { useState } from 'react';
// import Topbar from '../component/Topbar';
// import Navbar from '../component/homepage/Navbar';
// import Footer from '../component/homepage/Footer';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// export default function Changepasswordmain() {

//   const [data, setData] = useState({});
//   const [error, setError] = useState({});
//   const navigate = useNavigate();

//   const handleClick = () => {
//     handleValidate(data);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData({ ...data, [name]: value });
//   };

//   const handleValidate = (value) => {
//     let error = {};
//     if (!value.oldpassword) {
//       error.oldpassword = "Old Password is required";
//     }
//     if (!value.newpassword) {
//       error.newpassword = "New Password is required";
//     }
//     if (!value.confirmpassword) {
//       error.confirmpassword = "Confirm Password is required";
//     }
//     if (value.oldpassword && value.newpassword && value.oldpassword === value.newpassword) {
//       error.newpassword = "New Password must be different from Old Password";
//     }
//     if (value.newpassword && value.confirmpassword && value.newpassword !== value.confirmpassword) {
//       error.confirmpassword = "New Password and Confirm Password do not match";
//     }
//     setError(error);
//     if (Object.keys(error).length === 0) {
//       apihit();
//     }
//   };

//   const userid = JSON.parse(localStorage.getItem('data'));

//   const apihit = () => {
//     const passwordChange = {
//       id: userid.id,
//       oldpassword: data.oldpassword,
//       newpassword: data.newpassword,
//       confirmpassword: data.confirmpassword,
//     };

//     axios.post(`${process.env.REACT_APP_BASE_URL}change-password`, passwordChange)
//       .then((response) => {
//         toast.success(response.data.message);
//         setTimeout(() => {
//           navigate('/');
//         }, 1000);
//       })
//       .catch((error) => {
//         toast.error(error.response.data.message);
//       });
//   };

//   return (
//     <div>
//       <Topbar />
//       <Navbar />
//       <section className="changePass">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className='col-md-5'>
//               <div className="mainDiv">
//                 <div className="card">
//                   <div className='card-body cardstyle'>
//                     <form action="" method="post" name="signupForm" id="signupForm">
//                       <h2 className="formTitle">Change Password</h2>
//                       <div className="inputDiv">
//                         <label className="inputLabel" htmlFor="password1">
//                           Old Password
//                         </label>
//                         <input
//                           type="password"
//                           id="password1"
//                           name="oldpassword"
//                           required=""
//                           placeholder='Old Password'
//                           onChange={handleChange} />
//                         <p className='text-danger mb-0'>{error.oldpassword}</p>
//                       </div>
//                       <div className="inputDiv">
//                         <label className="inputLabel" htmlFor="password">
//                           New Password
//                         </label>
//                         <input
//                           type="password"
//                           id="password"
//                           name="newpassword"
//                           placeholder='New Password'
//                           required=""
//                           onChange={handleChange} />
//                         <p className='text-danger mb-0'>{error.newpassword}</p>
//                       </div>
//                       <div className="inputDiv">
//                         <label className="inputLabel" htmlFor="confirmPassword">
//                           Confirm Password
//                         </label>
//                         <input
//                           type="password"
//                           id="confirmPassword"
//                           name="confirmpassword"
//                           onChange={handleChange}
//                           placeholder='confirm Password' />
//                         <p className='text-danger mb-0'>{error.confirmpassword}</p>
//                       </div>
//                       <div className='text-center mt-3'>
//                           <button className='btn btn-danger' onClick={handleClick}>Change Password</button>
//                         </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//       <ToastContainer />
//     </div>
//   );
// }
import React, { useState } from 'react';
import Topbar from '../component/Topbar';
import Navbar from '../component/homepage/Navbar';
import Footer from '../component/homepage/Footer';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import './Changepassword.css';

export default function Changepasswordmain() {

  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    handleValidate(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleValidate = (value) => {
    let error = {};
    if (!value.oldpassword) {
      error.oldpassword = "Old Password is required";
    }
    if (!value.newpassword) {
      error.newpassword = "New Password is required";
    }
    if (!value.confirmpassword) {
      error.confirmpassword = "Confirm Password is required";
    }
    if (value.oldpassword && value.newpassword && value.oldpassword === value.newpassword) {
      error.newpassword = "New Password must be different from Old Password";
    }
    if (value.newpassword && value.confirmpassword && value.newpassword !== value.confirmpassword) {
      error.confirmpassword = "New Password and Confirm Password do not match";
    }
    setError(error);
    if (Object.keys(error).length === 0) {
      apihit();
    }
  };
  const userid = JSON.parse(localStorage.getItem('data'));
  const apihit = () => {
    const passwordChange = {
      id: userid.id,
      oldpassword: data.oldpassword,
      newpassword: data.newpassword,
      confirmpassword: data.confirmpassword, 
    };
    axios.post(`${process.env.REACT_APP_BASE_URL}change-password`, passwordChange)
      .then((response) => {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div>
      <Topbar />
      <Navbar />
      <div className="pwd-wrapper">
        <div className="pwd-card">
          <div className="pwd-icon-wrapper">
            <LockIcon className="pwd-icon-lock" />
          </div>
          <h2 className="pwd-title">Change Password</h2>
          <p className="pwd-subtitle">Update your credentials to secure your account</p>
          
          <form onSubmit={handleClick}>
            {/* Old Password */}
            <div className="pwd-input-group">
              <label className="pwd-label" htmlFor="password1">
                Old Password
              </label>
              <div className="pwd-input-wrapper">
                <VpnKeyIcon className="pwd-input-icon" />
                <input
                  type="password"
                  id="password1"
                  name="oldpassword"
                  placeholder="Enter old password"
                  className="pwd-input"
                  onChange={handleChange}
                />
              </div>
              {error.oldpassword && <p className="pwd-error-text">{error.oldpassword}</p>}
            </div>

            {/* New Password */}
            <div className="pwd-input-group">
              <label className="pwd-label" htmlFor="password">
                New Password
              </label>
              <div className="pwd-input-wrapper">
                <KeyIcon className="pwd-input-icon" />
                <input
                  type="password"
                  id="password"
                  name="newpassword"
                  placeholder="Enter new password"
                  className="pwd-input"
                  onChange={handleChange}
                />
              </div>
              {error.newpassword && <p className="pwd-error-text">{error.newpassword}</p>}
            </div>

            {/* Confirm Password */}
            <div className="pwd-input-group">
              <label className="pwd-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="pwd-input-wrapper">
                <LockIcon className="pwd-input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmpassword"
                  placeholder="Confirm new password"
                  className="pwd-input"
                  onChange={handleChange}
                />
              </div>
              {error.confirmpassword && <p className="pwd-error-text">{error.confirmpassword}</p>}
            </div>

            <button type="submit" className="pwd-btn">
              Change Password
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
