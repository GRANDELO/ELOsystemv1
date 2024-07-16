/**
 * Function to generate a random numeric verification code
 * @param {number} length - Length of the verification code
 * @returns {string} - Generated verification code
 */
function generateVerificationCode(length) {
    let code = '';
    const possible = '0123456789';
  
    for (let i = 0; i < length; i++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    return code;
  }
  
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
  
  // Export the functions
  module.exports = {
    generateVerificationCode,
    generateAlphanumericVerificationCode,
  };
  