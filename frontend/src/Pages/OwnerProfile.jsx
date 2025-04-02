import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../Styles/OwnerProfile.css"; // Make sure styles are imported

const OwnerProfilePage = () => {
  const navigate = useNavigate();
  const [petData, setPetData] = useState({
    pet_name: "",
    pet_type: "",
    pet_age: "",
    breed: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // For error handling

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset error message on form submit
    
    // Get the access token dynamically from localStorage
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You must be logged in to update your profile.");
      setLoading(false);
      return;
    }

    try {
      // Send the API request with the access token in the Authorization header
      const response = await axios.post(
        "http://localhost:8000/api/update-owner-profile/", // Ensure this is the correct endpoint
        petData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Profile update response:", response.data);
      alert("Pet profile updated successfully!");
      navigate("/ownerhomepage");
    } catch (error) {
      console.error("Error updating profile:", error);
      // If token has expired or is invalid, prompt user to login again
      if (error.response && error.response.status === 401) {
        alert("Session expired, please log in again.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Redirect to login page
      } else {
        setErrorMessage("Failed to update pet profile.");
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="owner-home-container">
      <Sidebar />
      <div className="owner-main-content">
        <h1>Welcome to the Owner Profile Setup!</h1>

        {/* Display error message if exists */}
        {errorMessage && <div className="error-box">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="pet-form">
          <label>Pet Name:</label>
          <input
            type="text"
            name="pet_name"
            value={petData.pet_name}
            onChange={handleChange}
            placeholder="Enter pet name"
          />

          <label>Pet Type:</label>
          <select
            name="pet_type"
            value={petData.pet_type}
            onChange={handleChange}
          >
            <option value="">Select pet type</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="guinea pig">Guinea Pig</option>
            <option value="other">Other</option>
          </select>

          {petData.pet_type === "dog" && (
            <>
              <label>Breed:</label>
              <input
                type="text"
                name="breed"
                value={petData.breed}
                onChange={handleChange}
                placeholder="Enter breed"
              />
            </>
          )}

          <label>Pet Age:</label>
          <input
            type="number"
            name="pet_age"
            value={petData.pet_age}
            onChange={handleChange}
            placeholder="Enter pet age"
          />

          {/* Buttons container */}
          <div className="button-container">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Pet Info"}
            </button>

            <button type="button" onClick={() => navigate("/ownerhomepage")} className="secondary-button">
              Already Set Up Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerProfilePage;
