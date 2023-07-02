
const LOAD_SPOTREVIEWS = "reviews/loadSpotReviews"

const loadSpotReviews = (reviews) => {
    return {
        type: LOAD_SPOTREVIEWS,
        reviews
    };
};

export const thunkLoadSpotReviews = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);
    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpotReviews(data.Reviews))
        console.log('IN: reviewsReducer(reviews.js), data.Reviews:', data.Reviews)
        return data.Reviews;
    }
}

const initialState = { allReviews: null };

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTREVIEWS:
            const loadSpotReviewsState = { ...state }
            if (!loadSpotReviewsState.allReviews) {
                loadSpotReviewsState.allReviews = {};
            }
            const loadReviewsArr = action.reviews;
            loadReviewsArr.forEach(review => {
                const reviewId = review.id;
                loadSpotReviewsState.allReviews[reviewId] = review;
            })
            console.log('reviewsreducer, review 1:', action.reviews[0]);
            return loadSpotReviewsState;
        default:
            return state;
    }
}

export default reviewsReducer;
