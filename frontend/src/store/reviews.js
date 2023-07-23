import { csrfFetch } from "./csrf";
// import { thunkShowSpot } from "./spots";

const LOAD_REVIEWS = "reviews/loadReviews";
const RECEIVE_SPOTREVIEW = "reviews/receiveSpotReview";
const DELETE_SPOTREVIEW = "reviews/deleteSpotReview"

const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    };
};

const receiveSpotReview = (review) => {
    return {
        type: RECEIVE_SPOTREVIEW,
        review
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
        dispatch(receiveSpotReview(newReview));
        // dispatch(thunkShowSpot(spotId));
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
        dispatch(deleteSpotReview(reviewId));
        // dispatch(thunkShowSpot(spotId));
        return data;
    }
}

export const thunkUpdateSpotReview = (reviewId, review, stars, spotId) => async (dispatch) => {
    const reqBody = { review, stars }
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(reqBody)
    })
    if (res.status < 400) {
        const updatedReview = res.json();
        dispatch(receiveSpotReview(updatedReview));
        dispatch(thunkLoadSpotReviews(spotId))
        return updatedReview;
    } else {
        const errs = res.json();
        return errs;
    }
}

const initialState = { allReviews: null };

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_REVIEWS:
            newState = { ...state, allReviews: {} };
            action.reviews.forEach(review => {
                newState.allReviews[review.id] = review;
            });
            return newState;
        case RECEIVE_SPOTREVIEW:
            newState = { ...state, allReviews: { ...state.allReviews } };
            newState.allReviews[action.review.id] = action.review;
            return newState;
        case DELETE_SPOTREVIEW:
            newState = { ...state, allReviews: { ...state.allReviews } };
            delete newState.allReviews[action.reviewId];
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;
