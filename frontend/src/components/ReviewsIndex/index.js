import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ReviewsIndexItem from "../ReviewsIndexItem";
import ReviewFormModal from "../ReviewFormModal";
import { thunkLoadSpotReviews, thunkLoadUserReviews } from "../../store/reviews";
import "./ReviewsIndex.css";

function ReviewsIndex({ spotId, numReviews }) {
    const dispatch = useDispatch();

    const reviewsObj = useSelector((state) => state.reviews.allReviews ? state.reviews.allReviews : null);
    const user = useSelector((state) => state.session.user ? state.session.user : null);
    const spot = useSelector((state) => state.spots.allSpots ? state.spots.allSpots[spotId] : null);

    const [flag, setFlag] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState({});
    const [name, setName] = useState(spot ? spot.name : '');
    const [manage, setManage] = useState(false);

    useEffect(() => {
        setFlag(true);
        if (spotId === 0 && numReviews === 1) {
            setFlag(false);
            setManage(true)
            dispatch(thunkLoadUserReviews());
        } else {
            dispatch(thunkLoadSpotReviews(spotId));
        }
    }, [dispatch]);

    useEffect(() => {
        if (reviewsObj) {
            const reviewsArr = Object.values(reviewsObj);

            if (reviewsArr.length > 1) {
                reviewsArr.sort((a, b) => b.id - a.id)
            }

            setReviews([...reviewsArr]);
        }
    }, [reviewsObj]);

    useEffect(() => {
        if (user && spotId !== 0) {
            const foundReview = reviews.find(review => review.userId === user.id)
            setUserReview(foundReview ? foundReview : null);
        }
    }, [user, reviews]);

    useEffect(() => {
        setFlag(true);

        setName(spot ? spot.name : "")
        if (!user || spotId === 0) {
            setFlag(false);
            return;
        }

        const reviewsArr = [...reviews];
        const ind = userReview ? reviews.findIndex(review => review.id === userReview.id) : -1;

        if (ind > -1) {
            setFlag(false);
            reviewsArr.unshift(reviewsArr.splice(ind, 1)[0]);
            setReviews(reviewsArr);
            return;
        } else if ((spot && user && spot.ownerId === user.id)) {
            setFlag(false);
            return;
        }
    }, [spot, user, userReview]);

    return (
        <div id="reviews-cont">
            {flag && <button id="review-btn">
                <OpenModalMenuItem
                    itemText="Post Your Review"
                    modalComponent={<ReviewFormModal
                        spotId={spotId}
                    />}
                />
            </button>}
            {flag && !numReviews && <p>Be the first to post a review!</p>}
            {reviews.length ? <ul id="reviews-list">
                {reviews.map(review => (
                    <ReviewsIndexItem
                        reviewObj={review}
                        user={user}
                        spotId={review.spotId ? review.spotId : spot.id}
                        key={review.id}
                        name={name ? name : review.Spot ? review.Spot.name : ""}
                        manage={manage}
                    />
                ))}
            </ul> : null}
        </div>
    )
}

export default ReviewsIndex;
