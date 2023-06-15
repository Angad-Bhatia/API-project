// backend/routes/api/spots.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const { Spot } = require('../../db/models');

// GET all Spots
router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll();
    res.json(allSpots);
});

//GET /api/spots/:spotId
router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        const err = new Error()
    }
    res.json(spot);
})

module.exports = router;
