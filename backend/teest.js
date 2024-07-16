/**
 * Function to generate a random alphanumeric verification code
 * @param {number} length - Length of the verification code
 * @returns {string} - Generated verification code
 */
function generateAlphanumericVerificationCode(length) {
    let code = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    return code;
  }
  
  // Example usage:
  const verificationCode = generateAlphanumericVerificationCode(6); // Generates a 6-character code
  console.log('Verification Code:', verificationCode);
  