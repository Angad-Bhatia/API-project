import React from "react";

import ReviewsIndex from "../ReviewsIndex";
import "./ReviewsUserIndex.css";

function ReviewsUserIndex() {
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
