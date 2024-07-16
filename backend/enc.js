const bcrypt = require('bcrypt');

const run = async () => {
  try {
    // Plaintext password
    const password = '@Kinyijr1';
    console.log('Plaintext password:', password);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Simulate retrieving the hashed password from the database and validating it
    const newpass = password;
    const isPasswordValid = await bcrypt.compare(newpass, hashedPassword);

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
