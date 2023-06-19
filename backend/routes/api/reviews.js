// backend/routes/api/reviews.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Op = Sequelize.Op;

const router = express.Router();

const { Spot, Review, ReviewImage, SpotImage } = require('../../db/models');

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

//GET /api/reviews/current (Get all Reviews of the Current User)
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
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
            },
            {
                model: ReviewImage,
                as: 'ReviewImages',
                attributes: {
                    exclude: ['reviewId', 'createdAt', 'updatedAt']
                }
            }
        ]
    });
    const response = [];
    let images;
    for (let i = 0; i < reviews.length; i++) {
        images = [];
        const reviewObj = reviews[i].toJSON();
        const imgArr = reviewObj.Spot.SpotImages
        for (let j = 0; j < imgArr.length; j++) {
            if (imgArr[j].preview) {
                images.push(imgArr[j].url);
            }
        }
        if (images.length > 0) reviewObj.Spot.previewImage = images[images.length - 1];
        else {
            reviewObj.Spot.previewImage = 'null';
        }

        delete reviewObj.Spot.SpotImages;
        response.push(reviewObj);
    }


    res.json({ Reviews: response });
});

//POST /api/reviews/:reviewId/images (Add an Image to a Review based on the Review's id)
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { user } = req;
    const userId = user.id;
    const reviewId = req.params.reviewId;
    const { url } = req.body;
    const flagReview = await Review.findByPk(reviewId, {
        include: [
            {
                model: ReviewImage,
                as: 'ReviewImages'
            }
        ]
    });
    if (!flagReview) {
        const err = new Error("Review couldn't be found");
        err.title = 'Resource Not Found';
        err.errors = { message: err.message };
        err.status = 404;
        return next(err);
    }

    //check if max 10 images have already been added
    if (flagReview.ReviewImages.length >= 10) {
        const err = new Error('Maximum number of images for this resource was reached');
        err.title = 'Forbidden';
        err.errors = { message: err.message };
        err.status = 403;
        return next(err);
    }

    if (flagReview.userId !== user.id) {
        const err = new Error('Review does not belong to user');
        err.title = 'Forbidden'
        err.errors = { message: err.message }
        err.status = 403;
        return next(err);
    }

    const image = await ReviewImage.create({ reviewId, url });
    const imageResponse = await ReviewImage.findOne({
        where: {
            url
        },
        attributes: ['id', 'url']
    });
    res.json(imageResponse);
});

router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const { user } = req;
    const reviewId = req.params.reviewId;
    const userReview = await Review.findByPk(reviewId);
    if (!userReview) {
        const err = new Error("Review couldn't be found");
        err.title = 'Resource Not Found';
        err.errors = { message: err.message };
        err.status = 404;
        return next(err);
    }

    if (userReview.userId !== user.id) {
        const err = new Error('Review does not belong to user');
        err.title = 'Forbidden'
        err.errors = { message: err.message }
        err.status = 403;
        return next(err);
    }

    const { review, stars } = req.body;
    userReview.set({ review, stars });
    await userReview.save();
    res.json(userReview);
});

//DELETE /api/reviews/:reviewId
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const reviewId = req.params.reviewId;
    const userReview = await Review.findByPk(reviewId);

    if (!userReview) {
        const err = new Error("Review couldn't be found");
        err.title = 'Resource Not Found';
        err.errors = { message: err.message };
        err.status = 404;
        return next(err);
    }

    if (userReview.userId !== user.id) {
        const err = new Error('Forbidden');
        err.title = 'Forbidden'
        err.errors = { message: err.message }
        err.status = 403;
        return next(err);
    }

    await userReview.destroy();
    res.json({ message: 'Successfully deleted' });
})

module.exports = router;
