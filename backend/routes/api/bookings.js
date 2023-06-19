// backend/routes/api/bookings.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Op = Sequelize.Op;

const router = express.Router();

const { Booking, Spot } = require('../../db/models');

//GET api/bookings/current
router.get('/current', requireAuth, (req, res, next) => {

});


module.exports = router;
