const express = require('express');
const { getPackagesForDeliveryPerson, assignBoxToDeliveryPerson, registerUser, login, verifyUser, updateEmail, resendVerificationCode, newrecoverPassword, resetPassword,  changepassword, changephonenumber, changeemail, logout} = require('../controllers/deliverypersoncontroller');
const router = express.Router();


router.get('/packages/:deliveryPersonnumber', getPackagesForDeliveryPerson);
router.post('/acceptpackage', assignBoxToDeliveryPerson);
router.post('/register', registerUser);
router.post('/login', login);
router.post('/verify', verifyUser)
router.post('/update-email', updateEmail);
router.post('/resendemail', resendVerificationCode);
router.post('/recoverpassword', newrecoverPassword);
router.post('/reset-password', resetPassword);
router.post('/changepassword', changepassword);
router.post('/changephonenumber', changephonenumber);
router.post('/changeemail', changeemail);
router.post('/logout', logout);

module.exports = router;
