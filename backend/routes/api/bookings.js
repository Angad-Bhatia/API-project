// backend/routes/api/bookings.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Op = Sequelize.Op;

const router = express.Router();

const { Booking, Spot, SpotImage } = require('../../db/models');

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




module.exports = router;
