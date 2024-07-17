import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

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
    category: ''
  });
  const [currentStep, setCurrentStep] = useState(1); // State to manage the current step
  const [isNextEnabled, setIsNextEnabled] = useState(false); // State to manage next button status
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({
    fullNameError: '',
    emailError: '',
    usernameError: '',
    phoneNumberError: '',
    passwordError: '',
    confirmPasswordError: '',
    dateOfBirthError: '',
    genderError: '',
    categoryError: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        setErrors({ ...errors, fullNameError: /^[a-zA-Z]{4,}$/.test(value) ? '' : 'Full name should contain only letters and be at least 4 characters.' });
        break;
      case 'email':
        setErrors({ ...errors, emailError: /^[a-zA-Z0-9_]{4,}@gmail\.com$/.test(value) ? '' : 'Enter correct email in the following format username@gmail.com' });
        break;
      case 'username':
        setErrors({ ...errors, usernameError: /^[a-zA-Z0-9_]{4,}$/.test(value) ? '' : 'Username should contain only letters, numbers, and underscores, and be at least 4 characters.' });
        break;
      case 'phoneNumber':
        setErrors({ ...errors, phoneNumberError: /^(07|01)\d{8}$/.test(value) ? '' : 'Enter a valid 10-digit phone number starting with 07 or 01.' });
        break;
      case 'password':
        setErrors({
          ...errors,
          passwordError: value.length >= 8 &&
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /[0-9]/.test(value) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(value) ? '' :
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        });
        break;
      case 'confirmPassword':
        setErrors({ ...errors, confirmPasswordError: formData.password === value ? '' : 'Passwords do not match.' });
        break;
      case 'dateOfBirth':
        setErrors({ ...errors, dateOfBirthError: value ? '' : 'Please select your date of birth.' });
        break;
      case 'gender':
        setErrors({ ...errors, genderError: value ? '' : 'Please select your gender.' });
        break;
      case 'category':
        setErrors({ ...errors, categoryError: value ? '' : 'Please select a category.' });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/auth/register', formData);
      setMessage(response.data.message);
      navigate('/verification');
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while processing your request.');
      }
    }
  };

  const nextStep = () => {
    // Validate current step fields before proceeding
    switch (currentStep) {
      case 1:
        validateField('fullName', formData.fullName);
        validateField('email', formData.email);
        validateField('username', formData.username);
        if (!errors.fullNameError && !errors.emailError && !errors.usernameError) {
          setCurrentStep(currentStep + 1);
        }
        break;
      case 2:
        validateField('phoneNumber', formData.phoneNumber);
        validateField('password', formData.password);
        validateField('confirmPassword', formData.confirmPassword);
        if (!errors.phoneNumberError && !errors.passwordError && !errors.confirmPasswordError) {
          setCurrentStep(currentStep + 1);
        }
        break;
      case 3:
        validateField('dateOfBirth', formData.dateOfBirth);
        validateField('gender', formData.gender);
        validateField('category', formData.category);
        if (!errors.dateOfBirthError && !errors.genderError && !errors.categoryError) {
          handleSubmit(); // Proceed to submit the form after validating the last step
        }
        break;
      default:
        break;
    }
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Use effect to check validation on formData change
  useEffect(() => {
    const validateStep = () => {
      switch (currentStep) {
        case 1:
          return !errors.fullNameError && !errors.emailError && !errors.usernameError;
        case 2:
          return !errors.phoneNumberError && !errors.passwordError && !errors.confirmPasswordError;
        case 3:
          return !errors.dateOfBirthError && !errors.genderError && !errors.categoryError;
        default:
          return false;
      }
    };

    setIsNextEnabled(validateStep());
  }, [formData, currentStep, errors]);

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="formsep">
            <label>Full Name:</label>
            <input type="text" name="fullName" placeholder="Enter your name" value={formData.fullName} onChange={handleChange} required />
            {errors.fullNameError && <p className="error">{errors.fullNameError}</p>}

            <label>Email:</label>
            <input type="email" name="email" placeholder="yourname@gmail.com" value={formData.email} onChange={handleChange} required />
            {errors.emailError && <p className="error">{errors.emailError}</p>}

            <label>Username:</label>
            <input type="text" name="username" placeholder="Enter your username." value={formData.username} onChange={handleChange} required />
            {errors.usernameError && <p className="error">{errors.usernameError}</p>}

            <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
          </div>
        )}
        {currentStep === 2 && (
          <div className="formsep">
            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" placeholder="07XXXXXXXX or 01XXXXXXXX" value={formData.phoneNumber} onChange={handleChange} required />
            {errors.phoneNumberError && <p className="error">{errors.phoneNumberError}</p>}

            <label>Password:</label>
            <input type="password" name="password" placeholder="Enter your Password" value={formData.password} onChange={handleChange} required />
            {errors.passwordError && <p className="error">{errors.passwordError}</p>}

            <label>Confirm Password:</label>
            <input type="password" name="confirmPassword" placeholder="Confirm Password." value={formData.confirmPassword} onChange={handleChange} required />
            {errors.confirmPasswordError && <p className="error">{errors.confirmPasswordError}</p>}

            <button type="button" onClick={previousStep}>Back</button>
            <button type="button" onClick={nextStep} disabled={!isNextEnabled}>Next</button>
          </div>
        )}
        {currentStep === 3 && (
          <div className="formsep">
            <label>Date of Birth:</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            {errors.dateOfBirthError && <p className="error">{errors.dateOfBirthError}</p>}

            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.genderError && <p className="error">{errors.genderError}</p>}

            <label>Category:</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select category</option>
              <option value="Seller">Seller</option>
              <option value="Salesperson">Salesperson</option>
            </select>
            {errors.categoryError && <p className="error">{errors.categoryError}</p>}

            <button type="button" onClick={previousStep}>Back</button>
            <button type="submit">Register</button>
          </div>
        )}
      </form>
      {message && <p className="message">{message}</p>}
      <p>If you have an account <Link to="/">Login</Link></p>
    </div>
  );
};

export default Register;
