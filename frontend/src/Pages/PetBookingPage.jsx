// PetBookingPage.js

import { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import { Link } from 'react-router-dom';
import '../Styles/Booking.css'; 

function PetBookingPage() {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        petType: 'dog',
        size: 'small',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Booking details:', formData);
    };

    return (
        <div className="booking-container">
            {/* Sidebar component */}
            <Sidebar />

            {/* Booking Form */}
            <div className="booking-form">
                <h1>Create a Pet Booking</h1>
                <form onSubmit={handleSubmit}>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    <input type="time" name="time" value={formData.time} onChange={handleChange} required />

                    <select name="petType" value={formData.petType} onChange={handleChange}>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                    </select>

                    <select name="size" value={formData.size} onChange={handleChange}>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>

                    <button type="submit">Find Pet Minders</button>
                </form>

                {/* Placeholder for minders */}
                <div className="minders-list">
                    <p>No minders available yet.</p>
                </div>
            </div>
        </div>
    );
}

export default PetBookingPage;