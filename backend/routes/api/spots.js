// backend/routes/api/spots.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Op = Sequelize.Op;

const router = express.Router();

const { Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const reviewsNum = async id => {
    const count = await Review.count({
        where: {
            spotId: id
        }
    });
    return count
}

//averagerating middleware func
const avgRating = async id => {
    const sum = await Review.sum('stars', {
        where: { spotId: id }
    });

    const total = await reviewsNum(id)
    return sum / total;
}

//validate POST middleware func
const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid (Must be within range -90 to 90)'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid (Must be within range -180 to 180)'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Name is required'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .isLength({ min: 30 })
        .withMessage('Description needs a minimum of 30 characters'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price is required'),
    handleValidationErrors
];

//validate POST reviews middleware
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

//validate POST bookings middleware
const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .isISO8601().toDate()
        .withMessage('Start Date must be in correct format yyyy-mm-dd'),
    check('endDate')
        .exists({ checkFalsy: true })
        .isISO8601().toDate()
        .withMessage('End Date must be in correct format yyyy-mm-dd'),
    handleValidationErrors
];

//validate search params middleware
const validateQuery = [

];

// GET /api/spots (Get all Spots)
router.get('/', async (req, res, next) => {
    let { page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice } = req.query

    let errFlag = false;
    const queryErr = new Error('Bad Request');
    queryErr.title = 'Bad Request'
    queryErr.errors = {};
    queryErr.status = 400;

    let search = {
        where: {}
    }

    if (page !== undefined && (isNaN(Number(page)) || Number(page) < 1)) {
        queryErr.errors.page = 'Page must be greater than or equal to 1'
        errFlag = true;
    } else if (Number(page) > 10) {
        queryErr.errors.page = 'Page must be less than or equal to 10';
        errFlag = true;
    }

    if (size !== undefined && (isNaN(Number(size)) || Number(size) < 1)) {
        queryErr.errors.size = 'Size must be greater than or equal to 1'
        errFlag = true;
    } else if (Number(size) > 20) {
        queryErr.errors.size = 'Size must be less than or equal to 20';
        errFlag = true;
    }

    if (!isNaN(Number(maxLat)) && Number(maxLat) <= 90 && Number(maxLat) >= -90) {
        search.where.lat = { [Op.lte]: maxLat }
    } else if (maxLat !== undefined) {
        queryErr.errors.maxLat = 'Maximum latitude is invalid';
        errFlag = true;
    }

    if (!isNaN(Number(minLat)) && Number(minLat) <= 90 && Number(minLat) >= -90) {
        search.where.lat = { [Op.gte]: minLat }
    } else if (minLat !== undefined) {
        queryErr.errors.minLat = 'Minimum latitude is invalid';
        errFlag = true;
    }

    if (!isNaN(Number(maxLng)) && Number(maxLng) <= 180 && Number(maxLng) >= -180) {
        search.where.lng = { [Op.lte]: maxLng }
    } else if (maxLng !== undefined) {
        queryErr.errors.maxLng = 'Maximum longitude is invalid';
        errFlag = true;
    }

    if (!isNaN(Number(minLng)) && Number(minLng) <= 180 && Number(minLng) >= -180) {
        search.where.lng = { [Op.gte]: minLng }
    } else if (minLng !== undefined) {
        queryErr.errors.minLng = 'Minimum longitude is invalid';
        errFlag = true;
    }

    if (!isNaN(Number(minPrice)) && Number(minPrice) >= 0) {
        search.where.price = { [Op.gte]: minPrice }
    } else if (minPrice !== undefined) {
        queryErr.errors.minPrice = 'Minimum price must be greater than or equal to 0';
        errFlag = true;
    }

    if (!isNaN(Number(maxPrice)) && Number(maxPrice) >= 0) {
        search.where.price = { [Op.lte]: maxPrice }
    } else if (maxPrice !== undefined) {
        queryErr.errors.maxPrice = 'Maximum price must be greater than or equal to 0';
        errFlag = true;
    }

    if (errFlag) {
        return next(queryErr);
    }

    if (page === undefined) {
        page = 1
    } else {
        parseInt(page)
    }

    if (size === undefined) {
        size = 20
    } else {
        parseInt(size)
    }

    const pagination = {};


    if (page >= 1 && size >= 1 && page <= 10 && size <= 20) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }

    const allSpots = await Spot.findAll({
        include: [
            {
                model: SpotImage,
                as: 'SpotImages',
                attributes: ['url', 'preview']
            }
        ],
        ...search,
        ...pagination
    });

    const response = [];
    let images;
    for (let i = 0; i < allSpots.length; i++) {
        //reset preview image array
        images = [];
        //convert each spot to POJO
        const spotPojo = allSpots[i].toJSON();
        const newId = allSpots[i].id;
        //assign each spot POJO and avg rating
        spotPojo.avgStarRating = await avgRating(newId);

        const spotImgArr = spotPojo.SpotImages;
        for (let j = 0; j < spotImgArr.length; j++) {
            if (spotImgArr[j].preview) {
                images.push(spotImgArr[j].url);
            }
        }
        if (images.length > 0) {
            spotPojo.previewImage = images[images.length - 1]
        } else {
            spotPojo.previewImage = 'null'
        }

        delete spotPojo.SpotImages;
        response.push(spotPojo);
    }

    res.json({
        Spots: response,
        page,
        size
    });
});

// POST /api/spots (Create a Spot)
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { user } = req;
    const ownerId = user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });
    res.status(201);
    return res.json(spot);
});

//GET /api/spots/current (Get all Spots owned by the Current User)
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const currUser = await User.findByPk(user.id, {
        attributes: [],
        include: [
            {
                model: Spot,
                include: [
                    {
                        model: SpotImage,
                        as: 'SpotImages',
                        attributes: ['preview', 'url']
                    }
                ]
            }
        ]
    });

    const response = []
    let images;
    for (let i = 0; i < currUser.Spots.length; i++) {
        images = [];
        const spotPojo = currUser.Spots[i].toJSON();
        const newId = currUser.Spots[i].id;
        spotPojo.avgStarRating = await avgRating(newId);
        const imgArr = spotPojo.SpotImages;
        for (let j = 0; j < imgArr.length; j++) {
            if (imgArr[j].preview) {
                images.push(imgArr[j].url);
            }
        }
        if (images.length > 0) spotPojo.previewImage = images[images.length - 1];
        else spotPojo.previewImage = 'null';
        delete spotPojo.SpotImages;
        response.push(spotPojo);
    }

    res.json({ Spots: response });
});

//GET /api/spots/:spotId/bookings (Get all Bookings for a Spot based on the Spot's id)
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { user } = req;
    const spotBookings = await Spot.findByPk(req.params.spotId, {
        attributes: ['ownerId'],
        include: [
            {
                model: Booking,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            }
        ]
    });

    if (!spotBookings) {
        const err = new Error("Spot couldn't be found");
        err.title = 'Resource Not Found';
        err.errors = { message: err.message };
        err.status = 404;
        return next(err);
    }

    const pojo = spotBookings.toJSON();

    if (user.id == spotBookings.ownerId) {
        delete pojo.ownerId;
        return res.json(pojo);
    } else {
        delete pojo.ownerId;
        for (let i = 0; i < pojo.Bookings.length; i++) {
            delete pojo.Bookings[i].User;
            delete pojo.Bookings[i].id;
            delete pojo.Bookings[i].userId
            delete pojo.Bookings[i].createdAt;
            delete pojo.Bookings[i].updatedAt;
        }

        return res.json(pojo);
    }
});

// POST /api/spots/:spotId/bookings (Create a Booking from a Spot based on the Spot's id)
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    const { startDate, endDate } = req.body;

    const yearS =  startDate.getFullYear()
    const monthS = ('0' + (startDate.getMonth() + 1)).slice(-2);
    const dayS = ('0' + (startDate.getDate() + 1)).slice(-2);
    const start = `${yearS}-${monthS}-${dayS}`;

    const yearE =  endDate.getFullYear()
    const monthE = ('0' + (endDate.getMonth() + 1)).slice(-2);
    const dayE = ('0' + (endDate.getDate() + 1)).slice(-2);
    const end = `${yearE}-${monthE}-${dayE}`;

    if (end <= start) {
        const err = new Error('Bad Request');
        err.title = 'Bad Request';
        err.errors = { endDate: 'endDate cannot be on or before startDate' };
        err.status = 400;
        return next(err);
    }

    const today = new Date().toISOString().slice(0, 10);
    if (start < today) {
        const err = new Error('Bad Request');
        err.title = 'Bad Request';
        err.errors = { startDate: 'startDate cannot be before today' };
        err.status = 400;
        return next(err);
    }

    const { user } = req;
    const userId = user.id;
    const spotId = req.params.spotId;
    const flagSpot = await Spot.findByPk(spotId, {
        attributes: ['ownerId'],
        include: [
            {
                model: Booking
            }
        ]
    });

    if (!flagSpot) {
        const err = new Error("Spot couldn't be found");
        err.title = 'Resource Not Found';
        err.errors = { message: err.message };
        err.status = 404;
        return next(err);
    }

    if (flagSpot.ownerId == userId) {
        const err = new Error('Cannot book spot owned by user');
        err.title = 'Forbidden';
        err.errors = { message: err.message };
        err.status = 403;
        return next(err);
    }


    let errFlag = false;
    const newErr = new Error('Sorry, this spot is already booked for the specified dates');
    newErr.title = 'Forbidden'
    newErr.errors = {};
    newErr.status = 403;

    const bookingsArr = flagSpot.Bookings;

    for (let i = 0; i < bookingsArr.length; i++) {
        if ((bookingsArr[i].startDate) == start ||
            (bookingsArr[i].endDate) == start ||
            ((bookingsArr[i].startDate) < start && (bookingsArr[i].endDate) > start)
        ) {
            errFlag = true;
            newErr.errors.startDate = 'Start date conflicts with an existing booking';
        }

        if (bookingsArr[i].startDate == end ||
            bookingsArr[i].endDate == end ||
            (bookingsArr[i].startDate < end && bookingsArr[i].endDate > end)
        ) {
            errFlag = true;
            newErr.errors.endDate = 'End date conflicts with an existing booking';
        }
    }

    if (errFlag) {
        return next(newErr);
    }

    const newBooking = await Booking.create({ spotId, userId, startDate: start, endDate: end });
    const bookingResponse = await Booking.findOne({
        where: { spotId, userId, startDate: start, endDate: end }
    });

    res.json(bookingResponse);
});

//GET /api/spots/:spotId/reviews (Get all Reviews by a Spot's id)
router.get('/:spotId/reviews', async (req, res, next) => {
    const spotReviews = await Spot.findByPk(req.params.spotId, {
        attributes: [],
        include: [
            {
                model: Review,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: ReviewImage,
                        as: 'ReviewImages',
                        attributes: ['id', 'url']
                    }
                ]
            }
        ]
    });
    if (!spotReviews) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        err.title = 'Resource Not Found'
        return next(err);
    }
    res.json(spotReviews);
});

//POST /api/spots/:spotId/reviews (Create a Review for a Spot based on the Spot's id)
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const spotId = req.params.spotId;
    const spotFlag = await Spot.findByPk(spotId, {
        include: [
            {
                model: Review
            }
        ]
    });

    if (!spotFlag) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        err.title = 'Resource Not Found'
        return next(err);
    }

    const { user } = req;
    const userId = user.id;

    for (let i = 0; i < spotFlag.Reviews.length; i++) {
        if (spotFlag.Reviews[i].userId == user.id) {
            const err = new Error('User already has a review for this spot');
            err.status = 500;
            err.title = 'Server Error'
            return next(err);
        }
    }


    const { review, stars } = req.body;
    const newReview = await Review.create({ userId, spotId, review, stars });

    res.status(201);
    res.json(newReview);
});

//POST /api/spots/:spotId/images (Add an Image to a Spot based on the Spot's id)
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { user } = req;
    const spotId = req.params.spotId;
    const { url, preview } = req.body;
    const flag = await Spot.findByPk(spotId);

    if (!flag) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        err.title = 'Resource Not Found'
        return next(err);
    }

    if (flag.ownerId !== user.id) {
        const err = new Error('Spot does not belong to user');
        err.status = 403;
        err.title = 'Forbidden';
        return next(err);
    }

    const image = await SpotImage.create({ spotId, url, preview });
    const spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                as: 'SpotImages',
                attributes: ['id', 'url', 'preview']
            }
        ]
    });

    const spotPojo = spot.toJSON();
    const imgArr = spotPojo.SpotImages;
    res.json(imgArr[imgArr.length - 1]);
});


//least specific start GET /api/spots/:spotId (Get details of a Spot from an id)
router.get('/:spotId', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: SpotImage,
                as: 'SpotImages',
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id','firstName', 'lastName']
            }
        ]
    });
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.title = 'Resource Not Found'
        err.status = 404;
        return next(err);
    }
    const spotObj = spot.toJSON();
    spotObj.numReviews = await reviewsNum(req.params.spotId);
    spotObj.avgStarRating = await avgRating(req.params.spotId);
    const { id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt, SpotImages, Owner, numReviews, avgStarRating } = spotObj;
    const orderedSpot = { id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt, numReviews, avgStarRating, SpotImages, Owner };
    res.json(orderedSpot);
});

//PUT /api/spots/:spotId (Edit a Spot)
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        err.title = 'Resource Not Found';
        return next(err);
    }

    if (spot.ownerId !== user.id) {
        const err = new Error('Spot does not belong to user');
        err.status = 403;
        err.title = 'Forbidden'
        return next(err);
    }

    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    spot.set({ address, city, state, country, lat, lng, name, description, price });
    await spot.save();
    res.json(spot);
});

//DELETE /api/spots/:spotId (Delete a Spot)
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        err.title = 'Resource Not Found'
        return next(err);
    }

    if (spot.ownerId !== user.id) {
        const err = new Error('Spot does not belong to user')
        err.status = 403;
        err.title = 'Forbidden';
        return next(err);
    }

    await spot.destroy();
    res.json({ message: 'Successfully deleted' });
});

module.exports = router;
