import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../Styles/MinderProfile.css"; // Ensure correct path to styling file

const MinderProfilePage = () => {
  const navigate = useNavigate();
  const [minderData, setMinderData] = useState({
    availability: "",
    credentials: "",
    price_per_day: "",
    experience: "",
    pet_preferences: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // For error handling

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMinderData({ ...minderData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset error message on form submit
    
    // Get token from localStorage
    const token = localStorage.getItem("access_token");
    
    // If there's no token, display an alert and stop the request
    if (!token) {
      alert("You must be logged in to update your profile.");
      setLoading(false);
      return;
    }

    try {
      // Send the updated data to the backend via POST request
      const response = await axios.post(
        "http://localhost:8000/api/update-minder-profile/", // API endpoint
        minderData, // Data being sent in the request
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Profile update response:", response.data);
      alert("Minder profile updated successfully!");
      
      // Navigate to the home page after a successful update
      navigate("/minderhomepage");
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Show the appropriate error message
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.detail || "Failed to update minder profile.");
      } else {
        setErrorMessage("An unknown error occurred while updating the profile.");
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="minder-profile-container">
      <Sidebar />
      <div className="minder-main-content">
        <h1>Welcome to the Minder Profile Setup!</h1>

        {/* Display error message if exists */}
        {errorMessage && <div className="error-box">{errorMessage}</div>}

        {/* Form to update minder profile */}
        <form onSubmit={handleSubmit} className="minder-form">
          <label>Availability (Days of the week):</label>
          <input
            type="text"
            name="availability"
            value={minderData.availability}
            onChange={handleChange}
            placeholder="e.g., Monday, Wednesday, Friday"
          />

          <label>Price per Day:</label>
          <input
            type="number"
            name="price_per_day"
            value={minderData.price_per_day}
            onChange={handleChange}
            placeholder="Enter price per day"
          />

          <label>Experience:</label>
          <textarea
            name="experience"
            value={minderData.experience}
            onChange={handleChange}
            placeholder="Describe your experience"
          />

          <label>Pet Preferences:</label>
          <input
            type="text"
            name="pet_preferences"
            value={minderData.pet_preferences}
            onChange={handleChange}
            placeholder="Enter pet preferences"
          />

          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={minderData.location}
            onChange={handleChange}
            placeholder="Enter location"
          />

          <div className="button-container">
            {/* Save Button */}
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Minder Info"}
            </button>

            {/* Redirect to /ownerhomepage */}
            <button 
              type="button" 
              onClick={() => navigate("/minderhomepage")} 
              className="secondary-button">
              Already Set Up Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MinderProfilePage;
