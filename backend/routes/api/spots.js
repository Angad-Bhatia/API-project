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
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
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
        .withMessage('Name is required'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
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

// GET /api/spots (Get all Spots)
router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll({
        include: [
            {
                model: SpotImage,
                as: 'SpotImages',
                attributes: ['url', 'preview']
            }
        ]
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
        //
        const spotImgArr = spotPojo.SpotImages;
        for (let j = 0; j < spotImgArr.length; j++) {
            if (spotImgArr[j].preview) {
                images.push(spotImgArr[j].url);
            }
        }
        if (images.length > 0) spotPojo.previewImage = images[images.length - 1];
        else spotPojo.previewImage = 'null';
        delete spotPojo.SpotImages;
        response.push(spotPojo);
    }

    res.json(response);
});

// POST /api/spots (Create a Spot)
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { user } = req;
    const ownerId = user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });

    res.status(201);
    return res.json(spot);
});

//GET /api/spots/current (Get all Spots owned by the Current User)
router.get('/current', requireAuth, async (req, res) => {
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
        console.log(pojo);
        return res.json(pojo);
    }
    // const bookingsArr =
    // for (let i = 0;)
    // const bookingsUser = await Booking.findAll({
    //     where: {
    //         spotId: req.params.spotId
    //     },
    //     include: [
    //         {
    //             model: User,
    //             attributes: ['id', 'firstName', 'lastName']
    //         }
    //     ]
    // })

    res.json('hi');
});

//GET /api/spots/:spotId/reviews (Get all Reviews by a Spot's id)
router.get('/:spotId/reviews', async (req, res) => {
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
        res.statusCode = 404;
        res.json({ message: err.message });
    }
    res.json(spotReviews);
});

//POST /api/spots/:spotId/reviews (Create a Review for a Spot based on the Spot's id)
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
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
        err.statusCode = 404;
        res.statusCode = 404;
        return res.json({ message: err.message });
    }

    const { user } = req;
    const userId = user.id;
    console.log(spotFlag.Reviews);
    for (let i = 0; i < spotFlag.Reviews.length; i++) {
        if (spotFlag.Reviews[i].userId == user.id) {
            const err = new Error('User already has a review for this spot');
            err.statusCode = 500;
            res.statusCode = err.statusCode || 500;
            return res.json({ message: err.message });
        }
    }


    const { review, stars } = req.body;
    const newReview = await Review.create({ userId, spotId, review, stars });

    res.status(201);
    res.json(newReview);
});

//POST /api/spots/:spotId/images (Add an Image to a Spot based on the Spot's id)
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { user } = req;
    const spotId = req.params.spotId;
    const { url, preview } = req.body;
    const flag = await Spot.findByPk(spotId);
    console.log(flag.id);
    if (!flag) {
        const err = new Error("Spot couldn't be found");
        err.statusCode = 404;
        res.statusCode = err.statusCode || 404;
        return res.json({ message: err.message });
    }

    if (flag.ownerId !== user.id) {
        const err = new Error('Forbidden');
        err.statusCode = 403;
        res.statusCode = err.statusCode || 403;
        return res.json({ message: err.message });
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
router.get('/:spotId', async (req, res) => {
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
        res.statusCode = 404;
        res.json({ message: err.message });
    }
    const spotObj = spot.toJSON();
    spotObj.numReviews = await reviewsNum(req.params.spotId);
    spotObj.avgStarRating = await avgRating(req.params.spotId);
    const { id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt, SpotImages, Owner, numReviews, avgStarRating } = spotObj;
    const orderedSpot = { id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt, numReviews, avgStarRating, SpotImages, Owner };
    res.json(orderedSpot);
});

//PUT /api/spots/:spotId (Edit a Spot)
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.statusCode = 404;
        res.statusCode = 404 || err.statusCode;
        res.json({ message: err.message });
    }

    if (spot.ownerId !== user.id) {
        res.status(403);
        res.json({ message: 'Forbidden' });
    }

    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    spot.set({ address, city, state, country, lat, lng, name, description, price });
    await spot.save();
    res.json(spot);
});

//DELETE /api/spots/:spotId (Delete a Spot)
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.statusCode = 404;
        res.statusCode = 404 || err.statusCode;
        res.json({ message: err.message });
    }

    if (spot.ownerId !== user.id) {
        res.status(403);
        res.json({ message: 'Forbidden' });
    }

    await spot.destroy();
    res.json({ message: 'Successfully deleted' });
});

module.exports = router;
