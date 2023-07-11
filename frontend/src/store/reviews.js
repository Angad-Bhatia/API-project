import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = "reviews/loadReviews";
const RECEIVE_SPOTREVIEW = "reviews/receiveSpotReview";
const DELETE_SPOTREVIEW = "reviews/deleteSpotReview"

const loadReviews = (reviews, spotId) => {
    return {
        type: LOAD_REVIEWS,
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

const deleteSpotReview = (reviewId, spotId) => {
    return {
        type: DELETE_SPOTREVIEW,
        reviewId,
        spotId
    }
}

export const thunkLoadSpotReviews = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);
    if (res.ok) {
        const data = await res.json();
        dispatch(loadReviews(data.Reviews, spotId))
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

export const thunkDeleteSpotReview = (reviewId, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
    if (res.ok) {
        const data = await res.json();
        dispatch(deleteSpotReview(reviewId, spotId));
        return data;
    }
}

const initialState = { allReviews: null };

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_REVIEWS:
            newState = Object.assign({}, state);
            newState.allReviews = {};
            (action.reviews).forEach(review => {
                newState.allReviews[review.id] = review;
            })
            return newState;
            // const loadSpotReviewsState = { allReviews: { ...state.allReviews } }
            // const spotId = action.spotId;
            // const loadReviewsArr = action.reviews;
            // if (!loadSpotReviewsState.allReviews) {
            //     loadSpotReviewsState.allReviews = {};
            // }
            // loadSpotReviewsState.allReviews[`spot${spotId}`] = {};
            // loadReviewsArr.forEach(review => {
            //     const reviewId = review.id;
            //     loadSpotReviewsState.allReviews[`spot${spotId}`][reviewId] = review;
            // })
            // return loadSpotReviewsState;
        case RECEIVE_SPOTREVIEW:
            const receiveSpotReviewState = { allReviews: { ...state.allReviews } };
            const newReview = action.review;

            if (receiveSpotReviewState.allReviews === null) {
                receiveSpotReviewState.allReviews = {};
            }

            if (!receiveSpotReviewState.allReviews[`spot${action.spotId}`]) {
                receiveSpotReviewState.allReviews[`spot${action.spotId}`] = {};
            };
            const currSpotReviews = receiveSpotReviewState.allReviews[`spot${action.spotId}`];
            currSpotReviews[newReview.id] = newReview;
            return receiveSpotReviewState;
        case DELETE_SPOTREVIEW:
            const deleteSpotReviewState = { allReviews: {[`spot${action.spotId}`]: { ...state.allReviews[`spot${action.spotId}`] }} };
            const delId = action.reviewId;
            if (deleteSpotReviewState.allReviews && deleteSpotReviewState.allReviews[`spot${action.spotId}`] && deleteSpotReviewState.allReviews[`spot${action.spotId}`][delId]) {
                delete deleteSpotReviewState.allReviews[`spot${action.spotId}`][delId];
            }
            return deleteSpotReviewState;
        default:
            return state;
    }
}

export default reviewsReducer;
