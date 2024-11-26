const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// Protected routes (require authentication)
router.get('/all', auth, profileController.getAllProfiles);
router.get('/active', auth, profileController.getActiveProfile);
router.get('/profile/:profileId', auth, profileController.getProfileById);
router.post('/create', auth, profileController.createProfile);
router.put('/update/:profileId', auth, profileController.updateProfile); // Changed to use profileId
router.post('/switch', auth, profileController.switchProfile);

// Public routes (no authentication required)
router.get('/public', profileController.getPublicProfiles);
router.get('/public/:urlSlug', profileController.getProfile);

module.exports = router;