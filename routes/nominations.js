const express = require('express');
const router = express.Router();
const NominationController = require('../controllers/nominationController');

// Create a new nomination
router.post('/', NominationController.createNomination);

// Get all nominations with pagination
router.get('/', NominationController.getAllNominations);

// Get nomination statistics
router.get('/stats', NominationController.getNominationStats);

// Get available domains
router.get('/domains', NominationController.getDomains);

// Get nominations by domain
router.get('/domain/:domain', NominationController.getNominationsByDomain);

// Get nomination by ID
router.get('/:id', NominationController.getNominationById);

// Update nomination
router.put('/:id', NominationController.updateNomination);

// Delete nomination
router.delete('/:id', NominationController.deleteNomination);

module.exports = router;
