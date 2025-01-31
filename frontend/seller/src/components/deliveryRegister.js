import axiosInstance from './axiosInstance';
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
    locations: 
    {
      county: "",
      town: "",
      area: "",
    },


  });
  const [currentStep, setCurrentStep] = useState(1); // State to manage the current step
  const [isNextEnabled, setIsNextEnabled] = useState(false); // State to manage next button status
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [towns, setTowns] = useState([]);
  const [selectedTown, setSelectedTown] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('');
  const totalSteps = 4; // Total number of steps
  const stepTimeEstimate = 2; // Estimate 2 minutes per step
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get('/locations');
        setCounties(response.data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError(err.response?.data?.message || 'Failed to fetch locations');
      }
    };
  
    fetchLocations();
  }, []);
  
  useEffect(() => {
    if (selectedCounty) {
      const countyData = counties.find(county => county.county === selectedCounty);
      setTowns(countyData ? countyData.towns : []);
    }
  }, [selectedCounty]);
  
  useEffect(() => {
    if (selectedTown) {
      const townData = towns.find(town => town.town === selectedTown);
      setAreas(townData ? townData.areas : []);
    }
  }, [selectedTown]);

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
      locations: 
        {
          county: selectedCounty,
          town: selectedTown,
          area: selectedArea,
        },
    };

    try {
      const response = await axiosInstance.post('/delivery/register', trimmedFormData);
      setMessage(response.data.message);
      sessionStorage.setItem('email', trimmedFormData.email);
      navigate('/deliveryVerification');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while processing your request.');
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
          return selectedCounty && selectedTown && selectedArea ;
        case 4:
          const passwordValid = formData.password.trim().length >= 8 &&
          /[A-Z]/.test(formData.password.trim()) &&
          /[a-z]/.test(formData.password.trim()) &&
          /[0-9]/.test(formData.password.trim()) &&
          /[!@#$%^&*(),.?":{}|<>]/.test(formData.password.trim());
          return formData.dateOfBirth && formData.gender && passwordValid && formData.password === formData.confirmPassword;
        default:
          return false;
      }
    };
  
    setIsNextEnabled(validateStep());
  }, [formData, currentStep, selectedTown, selectedArea,]);

  const handleCountyChange = (event) => {
    const selectedCountyValue = event.target.value;
    setSelectedCounty(selectedCountyValue);
    setSelectedTown(""); // Reset town selection
    setSelectedArea(""); // Reset area selection
    setTowns([]); // Clear towns when county changes
    setAreas([]); // Clear areas when county changes
  
    if (selectedCountyValue) {
      const countyData = counties.find(county => county.county === selectedCountyValue);
      setTowns(countyData ? countyData.towns : []);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;
  const timeRemaining = stepTimeEstimate * (totalSteps - currentStep);

  return (
    <div className="container">
      <h2>Register</h2>
      <div className="progress-container">
        <p>Step {currentStep} of {totalSteps}</p>
        <p>Estimated Time Remaining: {timeRemaining} minutes</p>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
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

          <label>vehicle type:</label>
          <select
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          >
            <option value="">Select vehicle type</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Bicycle">Bicycle</option>
            <option value="Tuk Tuk">Tuk Tuk</option>
            {/*
            <option value="Pickup Truck">Pickup Truck</option>
            <option value="Van">Van</option>
            <option value="Lorry">Lorry</option>
            <option value="Car">Car</option>
            <option value="Trailer">Trailer</option>
            <option value="Cart">Cart</option>
            <option value="Drone">Drone</option>
            */}
          </select>

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


<>
            <label>County</label>
            <select value={selectedCounty} onChange={handleCountyChange}>
              <option value="">Select County</option>
              {counties.map((county) => (
                <option key={county.county} value={county.county}>
                  {county.county}
                </option>
              ))}
            </select>

            {selectedCounty && (
              <>
                <label>Town</label>
                <select value={selectedTown} onChange={handleTownChange}>
                  <option value="">Select Town</option>
                  {towns.map((town) => (
                    <option key={town.town} value={town.town}>
                      {town.town}
                    </option>
                  ))}
                </select>
              </>
            )}

            {selectedTown && (
              <>
                <label>Area</label>
                <select value={selectedArea} onChange={handleAreaChange}>
                  <option value="">Select Area</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}-route
                    </option>
                  ))}
                </select>
              </>
            )}

          </>

        <button type="button" onClick={previousStep}>Back</button>
        <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
        </div>
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
          </select>

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

          <div className="terms-container">
            <p>
              By clicking "<strong>Register,</strong>" you agree to our{' '}
              <a href="/documents/TERMS OF SERVICE.pdf" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/documents/Privacy Policy.pdf" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>.
            </p>
          </div>

          <button type="button" onClick={previousStep}>Back</button>
          <button type="submit">Register</button>
        </div>
      )}
      </form>
      <div className="divmess">
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
