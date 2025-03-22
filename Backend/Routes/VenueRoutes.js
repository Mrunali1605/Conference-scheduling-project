const express = require('express');
const router = express.Router();
const venueController = require('../Controllers/VenueController');
const auth = require('../Middleswares/auth');
const adminMiddleware = require('../Middleswares/adminMiddleware');

router.get('/', auth, venueController.getAllVenues);
router.post('/', auth, adminMiddleware, venueController.createVenue);
router.get('/:id', auth, venueController.getVenueById);
router.put('/:id', auth, adminMiddleware, venueController.updateVenue);
router.delete('/:id', auth, adminMiddleware, venueController.deleteVenue);

module.exports = router;