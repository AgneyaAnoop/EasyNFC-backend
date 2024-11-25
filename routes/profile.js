const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.post('/create', auth, profileController.createProfile);
router.put('/update', auth, profileController.updateProfile);
router.post('/switch', auth, profileController.switchProfile);
router.get('/:urlSlug', profileController.getProfile);

router.get('/all', auth, profileController.getAllProfiles);
router.get('/active', auth, profileController.getActiveProfile);
router.get('/profile/:profileId', auth, profileController.getProfileById);
router.get('/public', profileController.getPublicProfiles);

module.exports = router;