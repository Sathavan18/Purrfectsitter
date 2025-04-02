import React, { useState } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

function ReviewPage() {
  const [formData, setFormData] = useState({
    pet_minder_name: '', // Changed from ID to name input
    rating: '',
    comment: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      
      if (!token) {
        throw new Error('Please log in to submit a review');
      }
  
      // Verify token is still valid
      const response = await api.post('/reviews/', {
        pet_minder_name: formData.pet_minder_name.trim(),
        rating: Number(formData.rating),
        comment: formData.comment
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      setSuccess(true);
      setFormData({ pet_minder_name: '', rating: '', comment: '' });
    } catch (err) {
      if (err.response?.status === 401) {
        setError({ message: 'Session expired. Please log in again.' });
        // Optional: Redirect to login
        // navigate('/login');
      } else {
        setError(err.response?.data || { message: 'Submission failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Submit a Review</h2>
      
      {success && (
        <div style={{ color: 'green', margin: '10px 0' }}>
          Review submitted successfully!
        </div>
      )}

      {error?.message && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="pet_minder_name">Pet Minder Name:</label>
          <input
            type="text"
            id="pet_minder_name"
            name="pet_minder_name"
            value={formData.pet_minder_name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
            placeholder="Enter the pet minder's exact username"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="rating">Rating (1-5):</label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', minHeight: '100px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 15px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {/* Debug section (optional) */}
      <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <h3>Debug Info:</h3>
        <pre>Form Data: {JSON.stringify(formData, null, 2)}</pre>
        {error && <pre>Error: {JSON.stringify(error, null, 2)}</pre>}
      </div>
    </div>
  );
}

export default ReviewPage;