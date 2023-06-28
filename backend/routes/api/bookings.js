// backend/routes/api/bookings.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Op = Sequelize.Op;

const router = express.Router();

const { Booking, Spot, SpotImage } = require('../../db/models');

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

//GET api/bookings/current
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: SpotImage,
                        as: 'SpotImages'
                    }
                ]

            }
        ]
    });

    const response = [];
    let images;
    for (let i = 0; i < bookings.length; i++) {
        images = [];
        const bookingPojo = bookings[i].toJSON();
        const imgArr = bookingPojo.Spot.SpotImages;
        for (let j = 0; j < imgArr.length; j++) {
            if (imgArr[j].preview) {
                images.push(imgArr[j].url);
            }
        }
        if (images.length > 0) {
            bookingPojo.Spot.previewImage = images[images.length - 1];
        } else {
            bookingPojo.Spot.previewImage = 'null';
        }

        delete bookingPojo.Spot.SpotImages;
        response.push(bookingPojo);

    }
    res.json({ Bookings: response });
});

//PUT /api/bookings/:bookingId (Edit a Booking)
router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {
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
    const bookingId = req.params.bookingId;
    const userBooking = await Booking.findByPk(bookingId);

    if (!userBooking) {
        const err = new Error("Booking couldn't be found");
        err.title = 'Resource Not Found';
        err.status = 404;
        return next(err);
    }

    if (userBooking.userId !== user.id) {
        const err = new Error('Booking does not belong to user');
        err.title = 'Forbidden'
        err.status = 403;
        return next(err);
    }
    
    const bookingStart = userBooking.startDate
    if (bookingStart < today) {
        const err = new Error("Past bookings can't be modified");
        err.title = 'Forbidden'
        err.errors = { message: err.message }
        err.status = 403;
        return next(err);
    }

    const spotId = userBooking.spotId;
    const flagSpot = await Spot.findByPk(spotId, {
        attributes: [],
        include: [
            {
                model: Booking
            }
        ]
    });



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

    userBooking.set({ startDate: start, endDate: end });
    await userBooking.save();
    res.json(userBooking);
});

//DELETE /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const bookingId = req.params.bookingId;
    const userBooking = await Booking.findByPk(bookingId, {
        include: [
            {
                model: Spot
            }
        ]
    });

    if (!bookingId) {
        const err = new Error("Booking couldn't be found");
        err.title = 'Resource Not Found';
        err.status = 404;
        return next(err);
    }

    if (userBooking.userId !== user.id && userBooking.Spot.ownerId !== user.id) {
        const err = new Error('Booking does not belong to user');
        err.title = 'Forbidden';
        err.status = 403;
        return next(err);
    }

    const start = Date.parse(userBooking.startDate);
    if (start < Date.now()) {
        const err = new Error("Bookings that have been started can't be deleted");
        err.title = 'Forbidden'
        err.status = 403;
        return next(err);
    }

    await userBooking.destroy();
    res.json({ message: 'Successfully deleted' });
});



module.exports = router;
