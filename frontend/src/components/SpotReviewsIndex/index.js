import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SpotReviewsIndexItem from "../SpotReviewsIndexItem";
import CreateReviewModal from "../CreateReviewModal";
import { thunkLoadSpotReviews } from "../../store/reviews";
import "./SpotReviewsIndex.css";

function SpotReviewsIndex({ spotId, numReviews }) {
    const dispatch = useDispatch();
    const reviewsObj = useSelector((state) => state.reviews.allReviews && state.reviews.allReviews[`spot${spotId}`] ? state.reviews.allReviews : null);
    const user = useSelector((state) => state.session.user ? state.session.user : null);
    const spot = useSelector((state) => state.spots.allSpots ? state.spots.allSpots[spotId] : null);

    const [flag, setFlag] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState({});


    useEffect(() => {
        dispatch(thunkLoadSpotReviews(spotId));
    }, [dispatch, spotId]);

    useEffect(() => {
        if (reviewsObj) {
            setReviews(Object.values(reviewsObj[`spot${spotId}`]))
        }
    }, [reviewsObj, spotId]);

    useEffect(() => {
        const foundReview = reviews.find(review => review.userId === user.id)
        setUserReview(foundReview ? foundReview : null);
    }, [reviews, user.id]);

    useEffect(() => {
        const reviewsArr = reviews;
        const ind = reviews.indexOf(userReview);
        if (ind > -1) {
            setFlag(false);
            reviewsArr.unshift(reviewsArr.splice(ind, 1)[0]);
            setReviews(reviewsArr);
        }
    }, [userReview, reviews]);

    useEffect(() => {
        setFlag(true);
        if ((spot.id && spot.ownerId === user.id)) {
            setFlag(false);
        }
    }, [spot, user]);

    return (
        <div id="reviews-cont">
            {flag && <button id="review-btn">
                <OpenModalMenuItem
                    itemText="Post Your Review"
                    modalComponent={<CreateReviewModal
                        spotId={spotId}
                    />}
                />
            </button>}
            {numReviews && <ul id="reviews-list">
                {reviews.map(review => (
                    <SpotReviewsIndexItem
                        reviewObj={review}
                        userId={user.id}
                        spotId={spot.id}
                        key={review.id}
                    />
                ))}
            </ul>}
        </div>
    )
}

export default SpotReviewsIndex;
