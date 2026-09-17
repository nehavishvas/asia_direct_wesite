import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

// Material-UI Icons
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import "./Notification.css";

export default function Notification() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentuser = JSON.parse(localStorage.getItem("data") || "{}");

  const handlegetnoti = () => {
    if (!currentuser?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}notification-users`, {
        user_id: currentuser.id,
      })
      .then((response) => {
        const resData = response.data?.data;
        setData(Array.isArray(resData) ? resData : []);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load notifications");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handlegetnoti();
  }, []);

  const hanldeclickdelete = () => {
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
          .post(`${process.env.REACT_APP_BASE_URL}remove-all-notifications`, {
            user_id: currentuser.id,
          })
          .then((response) => {
            toast.success(response.data?.message || "All notifications cleared");
            handlegetnoti();
          })
          .catch((error) => {
            toast.error(error.response?.data?.message || "Failed to clear notifications");
          });
        Swal.fire({
          title: "Deleted!",
          text: "Your notifications have been deleted.",
          icon: "success",
        });
      }
    });
  };

  const handleclickdelete = (id) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}remove-notification`, {
        notification_id: id,
      })
      .then((response) => {
        toast.success(response.data?.message || "Notification removed");
        handlegetnoti();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to remove notification");
      });
  };

  // Helper to get matching icon based on notification content
  const getNotificationIcon = (item) => {
    const title = (item?.title || "").toLowerCase();
    const desc = (item?.description || "").toLowerCase();
    const text = `${title} ${desc}`;

    if (
      text.includes("accepted") ||
      text.includes("approved") ||
      text.includes("success") ||
      text.includes("completed")
    ) {
      return <CheckCircleOutlineIcon style={{ fontSize: "1.35rem" }} />;
    }
    if (
      text.includes("order") ||
      text.includes("delivered") ||
      text.includes("freight") ||
      text.includes("shipment") ||
      text.includes("truck") ||
      text.includes("transit") ||
      text.includes("dispatch")
    ) {
      return <LocalShippingOutlinedIcon style={{ fontSize: "1.35rem" }} />;
    }
    if (
      text.includes("custom") ||
      text.includes("clearance") ||
      text.includes("document") ||
      text.includes("invoice")
    ) {
      return <DescriptionOutlinedIcon style={{ fontSize: "1.35rem" }} />;
    }
    return <CheckCircleOutlineIcon style={{ fontSize: "1.35rem" }} />;
  };

  // Helper to determine uppercase status label (e.g. ACCEPTED, DELIVERED, etc.)
  const getStatusText = (item) => {
    const title = (item?.title || "").toLowerCase();
    const desc = (item?.description || "").toLowerCase();
    const text = `${title} ${desc}`;

    if (text.includes("accepted")) return "ACCEPTED";
    if (text.includes("delivered")) return "DELIVERED";
    if (text.includes("approved")) return "APPROVED";
    if (text.includes("pending")) return "PENDING";
    if (text.includes("transit") || text.includes("dispatched") || text.includes("on the way"))
      return "IN TRANSIT";
    if (text.includes("cancelled") || text.includes("rejected")) return "CANCELLED";
    if (text.includes("clearance") || text.includes("custom")) return "CLEARANCE";
    if (text.includes("invoice") || text.includes("billing")) return "INVOICE";
    if (text.includes("freight")) return "FREIGHT";
    if (text.includes("order")) return "DELIVERED";
    return "UPDATE";
  };

  const notificationsList = Array.isArray(data) ? data : [];

  return (
    <div className="noti-page-wrapper">
      <div className="noti-container">
        {/* Header Section */}
        <div className="noti-header-section">
          <div className="noti-header-left">
            <div className="noti-title-line">
              <h1 className="noti-page-title">Notifications</h1>
              <span className="noti-pill-total">{notificationsList.length} Total</span>
            </div>
            <p className="noti-page-subtitle">
              Stay updated with your freight movements, orders, and system alerts
            </p>
          </div>

          <div className="noti-header-right">
            <button
              className="noti-btn-refresh-simple"
              onClick={handlegetnoti}
              title="Refresh notifications"
            >
              <RefreshIcon style={{ fontSize: "1.1rem" }} />
              <span>Refresh</span>
            </button>

            {notificationsList.length > 0 && (
              <button
                className="noti-btn-clear-all-simple"
                onClick={hanldeclickdelete}
                title="Clear all notifications"
              >
                <DeleteOutlineIcon style={{ fontSize: "1.1rem" }} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="noti-cards-list">
            {[1, 2, 3].map((n) => (
              <div key={n} className="noti-skeleton-item">
                <div className="noti-skel-icon" />
                <div className="noti-skel-lines">
                  <div className="noti-skel-line w40" />
                  <div className="noti-skel-line w75" />
                </div>
              </div>
            ))}
          </div>
        ) : notificationsList.length > 0 ? (
          /* Notifications List */
          <div className="noti-cards-list">
            {notificationsList.map((item, index) => (
              <div key={item?.id || index} className="noti-card-item">
                {/* Left Dynamic Green Icon */}
                <div className="noti-card-left-icon">{getNotificationIcon(item)}</div>

                {/* Content */}
                <div className="noti-card-content">
                  <h4 className="noti-card-title">{item?.title}</h4>
                  <p className="noti-card-desc">{item?.description}</p>

                  {/* Documents (if any) */}
                  {Array.isArray(item?.document) && item.document.length > 0 && (
                    <div className="noti-card-docs">
                      {item.document.map((doc, docIndex) => (
                        <a
                          key={docIndex}
                          href={`${process.env.REACT_APP_BASE_URLdocument || ""}${doc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="noti-doc-link"
                        >
                          <FileDownloadOutlinedIcon style={{ fontSize: "0.95rem" }} />
                          View Document {docIndex + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Status Pill & Delete Button */}
                <div className="noti-card-right">
                  <span className="noti-status-pill">{getStatusText(item)}</span>
                  <button
                    className="noti-delete-icon-btn"
                    title="Delete notification"
                    onClick={() => handleclickdelete(item.id)}
                  >
                    <DeleteOutlineIcon style={{ fontSize: "1.15rem" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="noti-empty-box">
            <div className="noti-empty-icon-circle">
              <NotificationsNoneOutlinedIcon fontSize="inherit" />
            </div>
            <h3 className="noti-empty-headline">No Notifications</h3>
            <p className="noti-empty-text">
              You're all caught up! When you have new freight or order updates, they will show up
              here.
            </p>
            <Link to="/" className="btn btn-primary px-4 py-2" style={{ borderRadius: "8px" }}>
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}