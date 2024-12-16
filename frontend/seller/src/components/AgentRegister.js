import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/styles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    idnumber: '',
    username: '',
    dateOfBirth: '',
    gender: '',
    town: '',
    townspecific: '',

  });
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
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      idnumber: formData.idnumber.trim(),
      username: formData.username.trim(),
      dateOfBirth: formData.dateOfBirth.trim(),
      gender: formData.gender.trim(),
      town: selectedTown,
      townspecific: selectedArea, 
    };

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/agent/register', trimmedFormData);
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

  const handleTownChange = (e) => {
    const selectedTown = e.target.value;
    setSelectedTown(selectedTown);
    const town = towns.find(t => t.town === selectedTown);
    setAreas(town ? town.areas : []);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };


  useEffect(() => {
    const validateStep = () => {
      switch (currentStep) {
        case 1:
          const firstNameValid = /^[a-zA-Z]{3,}$/.test(formData.firstName.trim());
          const lastNameValid = /^[a-zA-Z]{3,}$/.test(formData.lastName.trim());
          const usernameValid = /^[a-zA-Z0-9_]{4,}$/.test(formData.username.trim());
          return firstNameValid && lastNameValid  && usernameValid;
        case 2:
          const emailValid = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/.test(formData.email.trim());
          const phonenumberValid = /^(07|01)\d{8}$/.test(formData.phoneNumber.trim());
          const idnumberValid = /^\d{7,8}$/.test(formData.idnumber.trim());
          return phonenumberValid && emailValid && idnumberValid;
        case 3:
          return formData.dateOfBirth && formData.gender && selectedTown && selectedArea;
        case 4:
          const passwordValid = formData.password.trim().length >= 8 &&
          /[A-Z]/.test(formData.password.trim()) &&
          /[a-z]/.test(formData.password.trim()) &&
          /[0-9]/.test(formData.password.trim()) &&
          /[!@#$%^&*(),.?":{}|<>]/.test(formData.password.trim());
          return passwordValid && formData.password === formData.confirmPassword;
        default:
          return false;
      }
    };
  
    setIsNextEnabled(validateStep());
  }, [formData, currentStep]);
  
  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
      {currentStep === 1 && (
        <div className="formsep">
          <label>Enter Your First Name:</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter your name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {formData.firstName && !/^[a-zA-Z]{3,}$/.test(formData.firstName) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Full Name must be at least 3 characters long and contain only letters.</p>
          )}

          <label>Enter Your Last Name:</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {formData.lastName && !/^[a-zA-Z]{3,}$/.test(formData.lastName) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>Full Name must be at least 3 characters long and contain only letters.</p>
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

          <label htmlFor="idnumber">ID Number:</label>
          <input
            type="number"
            id="idnumber"
            name="idnumber"
            placeholder="ID Number"
            value={formData.idnumber}
            onChange={handleChange}
            min="1"
            required
          />
          {formData.idnumber && !/^\d{7,8}$/.test(formData.idnumber) && (
            <p style={{ color: 'red', fontSize: 'smaller' }}>
              Please enter a valid ID number (7 or 8 digits).
            </p>
          )}


          <button type="button" onClick={previousStep}>Back</button>
          <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
        </div>
      )}
        {currentStep === 3 && (
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

          <label>Town</label>
          <select as="select" value={selectedTown} onChange={handleTownChange}>
            <option value="">Select Town</option>
            {towns.map((town) => (
              <option key={town.town} value={town.town}>
                {town.town}
              </option>
            ))}
          </select>


      {selectedTown && (
          <>
            <label>Area</label>
            <select as="select" value={selectedArea} onChange={handleAreaChange}>
              <option value="">Select Area</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </>
      )}
                <button type="button" onClick={previousStep}>Back</button>
                <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
        </div>
      )}
      {currentStep === 4 && (
        <div className="formsep">


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
