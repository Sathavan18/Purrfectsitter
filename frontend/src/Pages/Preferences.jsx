import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Preferences.css'; 
import Sidebar from '../Components/Sidebar';

const Preferences = () => {
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState({
    availability: '',
    preferredPets: '',
    travelDistance: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrefs({ ...prefs, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Preferences (not saved):", prefs);
    navigate('/PetSitterHomePage');
  };

  return (
    <div className="edit-preferences-page">
            <Sidebar />
        <div className="preferences-container">
        <h2>Set Your Preferences</h2>
        <form className="preferences-form" onSubmit={handleSubmit}>
            <label>Availability</label>
            <select name="availability" value={prefs.availability} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="anytime">Anytime</option>
            </select>

            <label>Preferred Pet Types</label>
            <input
            type="text"
            name="preferredPets"
            placeholder="e.g., Dogs, Cats"
            value={prefs.preferredPets}
            onChange={handleChange}
            />

            <label>Willing to Travel (km)</label>
            <input
            type="number"
            name="travelDistance"
            placeholder="e.g., 10"
            value={prefs.travelDistance}
            onChange={handleChange}
            />

            <button type="submit">Save Preferences</button>
        </form>
        </div>
    </div>
  );
};

export default Preferences;