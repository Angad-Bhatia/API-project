import { csrfFetch } from "./csrf";

const LOAD_SPOTREVIEWS = "reviews/loadSpotReviews";
const RECEIVE_SPOTREVIEW = "reviews/receiveSpotReview";
const DELETE_SPOTREVIEW = "reviews/deleteSpotReview"

const loadSpotReviews = (reviews, spotId) => {
    return {
        type: LOAD_SPOTREVIEWS,
        reviews,
        spotId
    };
};

const receiveSpotReview = (review, spotId) => {
    return {
        type: RECEIVE_SPOTREVIEW,
        review,
        spotId
    };
}

const deleteSpotReview = (reviewId) => {
    return {
        type: DELETE_SPOTREVIEW,
        reviewId
    }
}

export const thunkLoadSpotReviews = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);
    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpotReviews(data.Reviews, spotId))
        // console.log('IN: reviewsReducer(reviews.js), data.Reviews:', data.Reviews)
        return data.Reviews;
    }
}

export const thunkCreateSpotReview = (spotId, review, stars) => async (dispatch) => {
    const reqBody = { review, stars }
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reqBody)
    });

    if (res.status < 400) {
        const newReview = await res.json();
        dispatch(receiveSpotReview(newReview, spotId));
        return newReview;
    } else {
        const errs = await res.json();
        return errs;
    }
}

export const thunkDeleteSpotReview = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
    if (res.ok) {
        const data = await res.json();
        dispatch(deleteSpotReview(reviewId));
        return data;
    }
}

const initialState = { allReviews: null };

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTREVIEWS:
            const loadSpotReviewsState = { ...state }
            const spotId = action.spotId;
            const loadReviewsArr = action.reviews;

            if (!loadSpotReviewsState.allReviews) {
                loadSpotReviewsState.allReviews = {};
            }

            loadSpotReviewsState.allReviews[`spot${spotId}`] = {};

            loadReviewsArr.forEach(review => {
                const reviewId = review.id;
                loadSpotReviewsState.allReviews[`spot${spotId}`][reviewId] = review;
            })

            return loadSpotReviewsState;
        case RECEIVE_SPOTREVIEW:
            const receiveSpotReviewState = { ...state };
            const newReview = action.review;

            if (!receiveSpotReviewState.allReviews) {
                receiveSpotReviewState.allReviews = {};
            }

            if (!receiveSpotReviewState.allReviews[`spot${action.spotId}`]) {
                receiveSpotReviewState.allReviews[`spot${action.spotId}`] = {};
            };

            const currSpotReviews = receiveSpotReviewState.allReviews[`spot${action.spotId}`];
            currSpotReviews[newReview.id] = newReview;

            return receiveSpotReviewState;
        case DELETE_SPOTREVIEW:
            const deleteSpotReviewState = { ...state };
            const delId = action.reviewId;
            if (deleteSpotReviewState && deleteSpotReviewState[delId]) {
                delete deleteSpotReviewState[delId];
            }
            return deleteSpotReviewState;
        default:
            return state;
    }
}

export default reviewsReducer;
