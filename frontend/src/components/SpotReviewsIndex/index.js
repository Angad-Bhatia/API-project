import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SpotReviewsIndexItem from "../SpotReviewsIndexItem";

import { thunkLoadSpotReviews } from "../../store/reviews";
import "./SpotReviewsIndex.css";

function SpotReviewsIndex({ spotId }) {
    const reviewsObj = useSelector((state) => state.reviews.allReviews ? state.reviews.allReviews : []);
    const reviews = Object.values(reviewsObj);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkLoadSpotReviews(spotId));
    }, [dispatch, spotId]);

    // console.log('ShowReviews comp, reviews', reviews)


    return (
        <ul id="reviews-list">
            {reviews.map(review => (
                <SpotReviewsIndexItem
                    reviewObj={review}
                    key={review.id}
                />
            ))}
        </ul>
    )
}

export default SpotReviewsIndex;
