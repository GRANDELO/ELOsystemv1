const bcrypt = require('bcrypt');

const run = async () => {
  try {
    const plaintextPassword = 'user-input-password'; // Plain text password provided by the user

    // Simulate retrieving the hashed password from the database
    const hashedPassword = '$2b$10$123456789012345678901eJvU2Gz6s7ZDg.QSVMDS7E6oFZ83nDg2';

    // Compare plaintext password with hashed password
    const isPasswordValid = await bcrypt.compare(plaintextPassword, hashedPassword);

    if (isPasswordValid) {
      console.log('Password is valid');
    } else {
      console.log('Invalid password');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

run();
