const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.delete('/delete', authController.deleteUser);

// Delete with password confirmation
router.delete('/delete-with-password', authController.deleteUserWithPassword);

module.exports = router;