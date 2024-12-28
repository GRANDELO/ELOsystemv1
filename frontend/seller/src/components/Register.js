import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/styles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    username: '',
    dateOfBirth: '',
    gender: '',
    category: '',
  });
  const [locations, setLocations] = useState([
    { town: "", area: [""], specific: [""] },
  ]);


  const [currentStep, setCurrentStep] = useState(1); // State to manage the current step
  const [isNextEnabled, setIsNextEnabled] = useState(false); // State to manage next button status
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [towns, setTowns] = useState([]);
  const [selectedTown, setSelectedTown] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('https://elosystemv1.onrender.com/api/locations');
        setTowns(response.data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setMessage(err.response?.data?.message || 'Failed to fetch locations');
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Trim the form data before sending it
    const trimmedFormData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      username: formData.username.trim(),
      dateOfBirth: formData.dateOfBirth.trim(),
      gender: formData.gender.trim(),
      category: formData.category.trim(),
      locations: locations
    };

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/auth/register', trimmedFormData);
      setMessage(response.data.message);
      sessionStorage.setItem('email', trimmedFormData.email);
      navigate('/verification');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while processing your request.');
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    const validateStep = () => {
      switch (currentStep) {
        case 1:
          const fullNameValid = /^[a-zA-Z]{3,}$/.test(formData.fullName.trim());
          const emailValid = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/.test(formData.email.trim());
          const usernameValid = /^[a-zA-Z0-9_]{4,}$/.test(formData.username.trim());
          return fullNameValid && emailValid && usernameValid;
        case 2:
          const passwordValid = formData.password.trim().length >= 8 &&
            /[A-Z]/.test(formData.password.trim()) &&
            /[a-z]/.test(formData.password.trim()) &&
            /[0-9]/.test(formData.password.trim()) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(formData.password.trim());
          return formData.phoneNumber && passwordValid && formData.password === formData.confirmPassword;
        case 3:
          return formData.dateOfBirth && formData.gender && formData.category;
        default:
          return false;
      }
    };
  
    setIsNextEnabled(validateStep());
  }, [formData, currentStep]);
  
  const handleTownChange = (index, e) => {
    const selectedTown = e.target.value;
    const town = towns.find(t => t.town === selectedTown);
  
    // Update the specific location
    setLocations(prevLocations => {
      const updatedLocations = [...prevLocations];
      updatedLocations[index] = {
        ...updatedLocations[index],
        town: selectedTown,
        area: town ? town.areas : [""],
        specific: [""], // Reset specific areas when the town changes
      };
      return updatedLocations;
    });
  };
  
  const handleAreaChange = (index, e) => {
    const selectedArea = e.target.value;
  
    // Update the specific area
    setLocations(prevLocations => {
      const updatedLocations = [...prevLocations];
      updatedLocations[index] = {
        ...updatedLocations[index],
        area: [selectedArea],
        specific: [""], // Reset specific areas when the area changes
      };
      return updatedLocations;
    });
  };
  
  const handleSpecificChange = (index, e) => {
    const specificValue = e.target.value;
  
    // Update the specific value
    setLocations(prevLocations => {
      const updatedLocations = [...prevLocations];
      updatedLocations[index] = {
        ...updatedLocations[index],
        specific: [specificValue],
      };
      return updatedLocations;
    });
  };
  
  // Add a new location section
  const addNewLocation = () => {
    setLocations(prevLocations => [
      ...prevLocations,
      { town: "", area: [""], specific: [""] },
    ]);
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
      {currentStep === 1 && (
        <div className="formsep">
          <label>Enter Your First Name:</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          {formData.fullName && !/^[a-zA-Z]{3,} $/.test(formData.fullName) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Full Name must be at least 3 characters long and contain only letters.</p>
          )}

          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="yourname@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {formData.email && !/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/.test(formData.email) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Please enter a valid email address (e.g., yourname@gmail.com).</p>
          )}

          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {formData.username && !/^[a-zA-Z0-9_]{4,}$/.test(formData.username) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Username must be at least 4 characters long and contain only letters, numbers, or underscores.</p>
          )}

          <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
        </div>
      )}
      {currentStep === 2 && (
        <div className="formsep">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="07XXXXXXXX or 01XXXXXXXX"
            pattern="(07|01)\d{8}"
            title="Please enter a valid 10-digit phone number starting with 07 or 01"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {formData.phoneNumber && !/^(07|01)\d{8}$/.test(formData.phoneNumber) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Please enter a valid 10-digit phone number starting with 07 or 01.</p>
          )}

          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {formData.password && formData.password.length < 8 && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must be at least 8 characters long.</p>
          )}
          {formData.password && !/[A-Z]/.test(formData.password) && (
            <p style={{ color: 'red' }}>Password must contain at least one uppercase letter.</p>
          )}
          {formData.password && !/[a-z]/.test(formData.password) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one lowercase letter.</p>
          )}
          {formData.password && !/[0-9]/.test(formData.password) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one number.</p>
          )}
          {formData.password && !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one special character.</p>
          )}

          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {formData.password && formData.password !== formData.confirmPassword && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>The passwords don't match!</p>
          )}

          <button type="button" onClick={previousStep}>Back</button>
          <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
        </div>
      )}
      {currentStep === 3 && (
        <>
        {locations.map((location, index) => (
          <div key={index}>
            <label>
              Town:
              <select
                value={location.town}
                onChange={(e) => handleTownChange(index, e)}
              >
                <option value="">Select a town</option>
                {towns.map((town, i) => (
                  <option key={i} value={town.town}>
                    {town.town}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Area:
              <select
                value={location.area[0]}
                onChange={(e) => handleAreaChange(index, e)}
                disabled={!location.town}
              >
                <option value="">Select an area</option>
                {location.area.map((area, i) => (
                  <option key={i} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Specific:
              <input
                type="text"
                  placeholder={
                    location.area[0]
                      ? `Your area within ${location.area[0]}`
                      : "Enter the specific area"
                  }
                value={location.specific[0]}
                onChange={(e) => handleSpecificChange(index, e)}
                disabled={!location.area.length || !location.town}
              />
            </label>
          </div>
        ))}
                  <button type="button" onClick={previousStep}>Back</button>
                  <button type="button" onClick={nextStep} >Next</button>
        </>
      )}
      {currentStep === 4 && (
        <div className="formsep">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Seller">Own Business</option>
            <option value="Salesperson">Personal Acount</option>
          </select>

          <button type="button" onClick={previousStep}>Back</button>
          <button type="submit">Register</button>
        </div>
      )}

      </form>
      <div className="divmess">
          {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
