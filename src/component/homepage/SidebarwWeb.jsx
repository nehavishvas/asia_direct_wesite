// import React from 'react'
// import { useNavigate } from 'react-router-dom'

// export default function SidebarWeb() {
// const navigate = useNavigate()
//   const handleclick = () =>{
//     navigate('/Custom-clearence')
//   }
//   const handleclicknavi = () =>{
//     navigate('/freight-details')
//   }
//   return (
//     <aside class="left-sidebar left_aside sidebarMain" data-sidebarbg="skin6" id="sidebarMain" style={{position:"fixed"}}>
//       <nav class="sidebar-nav">
//         <ul id="sidebarnav" class="nav_bar_side">
//           <li class="sidebar-item">
//             <p class="sidebar-link sidebar-link link_sidebar " style={{cursor:"pointer"}}>
//               <i class="fi fi-br-category-alt"></i>
//               <span class="hide-menu">Dashboard</span>
//             </p>
//           </li>
//           <li class="sidebar-item">
//             <p class="sidebar-link sidebar-link link_sidebar active" onClick={handleclicknavi} style={{cursor:"pointer"}}
//               >
//               <i class="fi fi-rs-truck-moving"></i>
//               <span class="hide-menu">Freight</span>
//             </p>
//           </li>
//           <li class="sidebar-item">
//             <p class="sidebar-link sidebar-link link_sidebar" onClick={handleclick} style={{cursor:"pointer"}}
//               >
//               <i class="fi fi-rs-document-signed"></i>
//               <span class="hide-menu">Customs Clearance</span>
//             </p>
//           </li>
//           <li class="sidebar-item">
//             <p class="sidebar-link sidebar-link link_sidebar" onClick={()=>{navigate('/Clearence-order')}} style={{cursor:"pointer"}}
//               >
//               <i class="fi fi-rs-document-signed"></i>
//               <span class="hide-menu">Customs Order</span>
//             </p>
//           </li>
//           <li class="sidebar-item">
//             <p class="sidebar-link sidebar-link link_sidebar" onClick={()=>{navigate('/Tracking')}} style={{cursor:"pointer"}}
//               >
//               <i class="fi fi-rs-document-signed"></i>
//               <span class="hide-menu">Tracking</span>
//             </p>
//           </li>
//           <li class="sidebar-item">
//             <p class="sidebar-link sidebar-link link_sidebar" onClick={()=>{navigate("/My-profile")}}
//             >
//               <i class="fi fi-rr-settings"></i>
//               <span class="hide-menu">Settings</span>
//             </p>
//           </li>
//         </ul>
//       </nav>
//     </aside >
//   )
// }

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SidebarwWeb.css';

export default function SidebarWeb() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current path matches the given path
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="left-sidebar left_aside sidebarMain" data-sidebarbg="skin6" id="sidebarMain">
      <nav className="sidebar-nav">
        <ul id="sidebarnav" className="nav_bar_side">
          <li className="sidebar-item">
            <p
              className={`sidebar-link sidebar-link link_sidebar ${isActive('/freight-details') ? 'active' : ''}`}
              onClick={() => navigate('/freight-details')}
              style={{ cursor: "pointer" }}
            >
              <i className="fi fi-rs-truck-moving"></i>
              <span className="hide-menu">Freight</span>
            </p>
          </li>
          <li className="sidebar-item">
            <p
              className={`sidebar-link sidebar-link link_sidebar ${isActive('/order-details') ? 'active' : ''}`}
              onClick={() => navigate('/order-details')}
              style={{ cursor: "pointer" }}
            >
              <i className="fi fi-rs-dolly-flatbed-alt"></i>
              <span className="hide-menu">Freight Order</span>
            </p>
          </li>
          <li className="sidebar-item">
            <p
              className={`sidebar-link sidebar-link link_sidebar ${isActive('/Custom-clearence') ? 'active' : ''}`}
              onClick={() => navigate('/Custom-clearence')}
              style={{ cursor: "pointer" }}
            >
              <i className="fi fi-rs-legal"></i>
              <span className="hide-menu">Customs Clearance</span>
            </p>
          </li>
          <li className="sidebar-item">
            <p
              className={`sidebar-link sidebar-link link_sidebar ${isActive('/Clearence-order') ? 'active' : ''}`}
              onClick={() => navigate('/Clearence-order')}
              style={{ cursor: "pointer" }}
            >
              <i className="fi fi-rs-document-signed"></i>
              <span className="hide-menu">Customs Order</span>
            </p>
          </li>
          <li className="sidebar-item">
            <p
              className={`sidebar-link sidebar-link link_sidebar ${isActive('/Tracking') ? 'active' : ''}`}
              onClick={() => navigate('/Tracking')}
              style={{ cursor: "pointer" }}
            >
              <i className="fi fi-rs-location-alt"></i>
              <span className="hide-menu">Tracking</span>
            </p>
          </li>
          <li className="sidebar-item">
            <p
              className={`sidebar-link sidebar-link link_sidebar ${isActive('/My-profile') ? 'active' : ''}`}
              onClick={() => navigate("/My-profile")}
              style={{ cursor: "pointer" }}
            >
              <i className="fi fi-rr-settings"></i>
              <span className="hide-menu">Settings</span>
            </p>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

