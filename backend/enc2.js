const bcrypt = require('bcryptjs');

// Function to hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Function to compare passwords
const comparePasswords = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

// Register user (hashing password)
const registerUser = async (password) => {
  const hashedPassword = await hashPassword(password);
  // Save hashedPassword to the database
  console.log('Hashed Password:', hashedPassword);
  return hashedPassword;  // Return hashed password to use it in login example
};

// Login user (comparing password)
const loginUser = async (enteredPassword, storedHashedPassword) => {
  const isMatch = await comparePasswords(enteredPassword, storedHashedPassword);
  if (isMatch) {
    console.log('Login successful');
  } else {
    console.log('Invalid password');
  }
};

// Example usage
const plainPassword = 'mysecretpassword';
registerUser(plainPassword).then((hashedPassword) => {
  loginUser(plainPassword, hashedPassword);
});
