import { csrfFetch } from "./csrf";

const RECEIVE_SPOT_IMAGE = 'spots/receiveSpotImage'

const receiveSpotImage = (image, spotId) => {
    return {
        type: RECEIVE_SPOT_IMAGE,
        image,
        spotId
    };
};

const initialState = { allImages: null };

const imagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_SPOT_IMAGE:
            const receiveSpotImageState = { ...state };
            const id = action.spotId;
            
    }
}
