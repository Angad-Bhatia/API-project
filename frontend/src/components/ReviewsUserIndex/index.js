import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReviewsIndex from "../ReviewsIndex";
import "./ReviewsUserIndex.css";

function ReviewsUserIndex() {
    // const dispatch = useDispatch();

    // const reviewsObj = useSelector((state) => state.reviews.allReviews ? state.reviews.allReviews : null);

    // const [reviews, setReviews] = useState(reviewsObj ? Object.values(reviewsObj) : []);
    // useEffect(() => {
    //     dispatch();
    // }, [dispatch]);

    // useEffect(() => {
    //     setReviews(reviewsObj ? Object.values(reviewsObj) : []);
    // }, [reviewsObj])
    return (
        <div id="user-reviews-cont">
            <h2>Manage Reviews</h2>
            <ReviewsIndex
                spotId={0}
                numReviews={1}
            />
        </div>
    )
}

export default ReviewsUserIndex;
