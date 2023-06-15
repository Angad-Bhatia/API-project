// backend/routes/api/reviews.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Op = Sequelize.Op;

const router = express.Router();

const { Spot, Review } = require('../../db/models');



module.exports = router;
