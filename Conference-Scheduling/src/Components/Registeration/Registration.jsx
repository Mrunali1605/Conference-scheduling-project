import React, { useState } from 'react';
import './Registration.css';

const Registration = ({ event, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    qualification: '',
    workingStatus: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register for {event.title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="18"
              max="100"
            />
          </div>
          <div className="form-group">
            <label htmlFor="qualification">Qualification:</label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="workingStatus">Working Status:</label>
            <select
              id="workingStatus"
              name="workingStatus"
              value={formData.workingStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="student">Student</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="self-employed">Self-Employed</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit">Register</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;