const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const Op = Sequelize.Op;

const router = express.Router();

const { Spot, SpotImage } = require('../../db/models');

//DELETE (delete spot-images)
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const id = req.params.imageId;
    const image = await SpotImage.findByPk(id, {
        include: [
            {
                model: Spot,
                attributes: ['ownerId']
            }
        ]
    });

    if (!image) {
        const err = new Error("Spot Image couldn't be found");
        err.title = 'Resource Not Found';
        err.status = 404;
        return next(err);
    }

    if (user.id !== image.Spot.ownerId) {
        const err = new Error('Spot does not belong to user');
        err.title = 'Forbidden'
        err.status = 403;
        return next(err);
    }

    await image.destroy();
    res.json({ message: 'Successfully deleted' });
});


module.exports = router;
