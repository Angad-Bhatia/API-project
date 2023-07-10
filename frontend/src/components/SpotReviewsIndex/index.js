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
    const [toggle, setToggle] = useState(true);


    useEffect(() => {
        dispatch(thunkLoadSpotReviews(spotId));
    }, [dispatch, spotId]);

    useEffect(() => {
        dispatch(thunkLoadSpotReviews(spotId));
    }, [dispatch, toggle]);

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
        setFlag(true);
        const reviewsArr = reviews;
        const ind = reviews.indexOf(userReview);
        if (ind > -1) {
            console.log('user review should not exist')
            setFlag(false);
            reviewsArr.unshift(reviewsArr.splice(ind, 1)[0]);
            setReviews(reviewsArr);
        }
        if ((spot.ownerId && spot.ownerId === user.id)) {
            setFlag(false);
            console.log('spot.ownerId does not equal user.id')
        }
    }, [userReview, reviews]);

    // useEffect(() => {
    //     setFlag(true);
    //     console.log('spotOwnerId and user.id', spot.ownerId, user.id)
    //     if ((spot.ownerId && spot.ownerId === user.id)) {
    //         setFlag(false);
    //         console.log('spot.ownerId does not equal user.id')
    //     }
    // }, [spot, user]);

    const buttonToggle = (e) => {
        e.preventDefault();
        setToggle(!toggle);
    }

    return (
        <div id="reviews-cont">
            {flag && <button id="review-btn" onClick={buttonToggle}>
                <OpenModalMenuItem
                    itemText="Post Your Review"
                    modalComponent={<CreateReviewModal
                        spotId={spotId}
                    />}
                />
            </button>}
            {numReviews ? <ul id="reviews-list">
                {reviews.map(review => (
                    <SpotReviewsIndexItem
                        reviewObj={review}
                        userId={user.id}
                        spotId={spot.id}
                        key={review.id}
                    />
                ))}
            </ul> : null}
        </div>
    )
}

export default SpotReviewsIndex;
