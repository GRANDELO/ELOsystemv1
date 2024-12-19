const express = require('express');
const { addOrderToAgentPackages, registerUser, login, verifyUser, updateEmail, resendVerificationCode, newrecoverPassword, resetPassword, changeusername, changepassword, changephonenumber, changeemail, logout} = require('../controllers/agentscontroller');
const router = express.Router();
const { addBoxToAgentPackages, getBoxesForAgent } = require('../controllers/boxcontroller');


router.post('/register', registerUser);
router.post('/login', login);
router.post('/verify', verifyUser)
router.post('/update-email', updateEmail);
router.post('/resendemail', resendVerificationCode);
router.post('/recoverpassword', newrecoverPassword);
router.post('/reset-password', resetPassword);
router.post('/changeusername', changeusername);
router.post('/changepassword', changepassword);
router.post('/changephonenumber', changephonenumber);
router.post('/changeemail', changeemail);
router.post('/logout', logout);
router.post('/add-order', addOrderToAgentPackages);
router.get("/:agentnumber/boxes", getBoxesForAgent);
router.post("/add-box", addBoxToAgentPackages);


module.exports = router;
