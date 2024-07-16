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
    const isPasswordValid = await bcrypt.compare("@Kinyijr1", "$2a$10$YNOaWFuBhUUU7ALgUAN7hOyUxsmc5TFyaMjy5ApFNmgBSF6Qs99hy");

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
