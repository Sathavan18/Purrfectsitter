import React, { useState } from "react";
import logo from './purrfectsitter.PNG';
import "../Styles/MinderHomePage.css";
import { useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";

const PetSitterHomePage = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState(1); // Example: 1 unread notifications

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    // Clear session info here if needed
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false); 
  };
  

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-left">
            <img alt="logo" className="logo" src={logo} />
        </div>
        <div className="nav-search" onClick={() => navigate("/search")}>
          <span className="search-text"><IoMdSearch />Search Owners</span>
        </div>
        <div className="nav-links">
          {/* Notification Button */}
          <div className="notification-icon" onClick={() => navigate("/notifications")}>
            🔔 {notifications > 0 && <span className="notification-badge">{notifications}</span>}
          </div>
          <button onClick={() => navigate("/about")}>About</button>
          <button onClick={() => navigate("/help")}>Help</button>
          <button onClick={handleLogoutClick}>Logout</button>
        </div>

      </nav>

      <div className="dashboard-content">
        <div className="left-grid">
          <div className="grid-box edit-profile-box" onClick={() => navigate("/minderprofilepage")}>
              <span>Edit Profile</span>
            </div>
            <div className="grid-box set-preferences-box" onClick={() => navigate("/preferences")}>
              <span>Settings</span>
            </div>
            <div className="grid-box view-ratings-box" onClick={() => navigate("/view-ratings")}>
              <span>View Ratings</span>
            </div>
            <div className="grid-box issue-complaint-box" onClick={() => navigate("/complaint")}>
              <span>Issue Complaint</span>
            </div>
          </div>

        <div className="manage-booking-box" onClick={() => navigate("/manage-bookings")}>
          <span>Manage Bookings</span>
        </div>
      </div>
      {/* 🔻 Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>Confirm</button>
              <button className="cancel-btn" onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetSitterHomePage;