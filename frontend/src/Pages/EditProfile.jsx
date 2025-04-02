import React, { useState } from 'react';
import '../Styles/EditProfile.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

const EditProfile = () => {
    const navigate = useNavigate(); // Assuming you have react-router-dom installed
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        address: '',
        petName: '',
        petType: '',
        petNotes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Profile:', profile);
        // You can add an API call here to submit updates
        navigate('/PetSitterHomePage');
    };

    return (
        <div className="edit-profile-page">
            <Sidebar />
            <div className="edit-profile-container">
                <h2>Edit Profile</h2>
                <form className="edit-profile-form" onSubmit={handleSubmit}>
                    <input name="name" type="text" placeholder="Full Name" value={profile.name} onChange={handleChange} />
                    <input name="email" type="email" placeholder="Email" value={profile.email} onChange={handleChange} />
                    <input name="address" type="text" placeholder="Address" value={profile.address} onChange={handleChange} />
                    <input name="petName" type="text" placeholder="Pet Name" value={profile.petName} onChange={handleChange} />
                    <input name="petType" type="text" placeholder="Pet Type" value={profile.petType} onChange={handleChange} />
                    <textarea name="petNotes" placeholder="Pet Notes" value={profile.petNotes} onChange={handleChange} />
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;