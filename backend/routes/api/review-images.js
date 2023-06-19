const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Op = Sequelize.Op;

const router = express.Router();

const { Review, ReviewImage } = require('../../db/models');

//DELETE (delete review-images)
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const id = req.params.imageId;
    const image = await ReviewImage.findByPk(id, {
        include: [
            {
                model: Review,
                attributes: ['userId']
            }
        ]
    });

    if (!image) {
        const err = new Error("Review Image couldn't be found");
        err.title = 'Resource Not Found';
        err.status = 404;
        return next(err);
    }

    if (user.id !== image.Review.userId) {
        const err = new Error('Review Image does not belong to user');
        err.title = 'Forbidden'
        err.status = 403;
        return next(err);
    }

    await image.destroy();
    res.json({ message: 'Successfully deleted' });
});

module.exports = router;
