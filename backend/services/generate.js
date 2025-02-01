const generateVerificationCode = (length) => {
    let code = '';
    const possible = '0123456789';
  
    for (let i = 0; i < length; i++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    return code;
  };
  
  
  const code = generateVerificationCode(6);
  console.log(code); // Example output: "573829"