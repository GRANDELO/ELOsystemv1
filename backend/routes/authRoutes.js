const express = require('express');
const { registerUser, login, verifyUser, updateEmail, resendVerificationCode } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/verify', verifyUser)
router.post('/update-email', updateEmail);
router.post('/resendemail', resendVerificationCode);
module.exports = router;
