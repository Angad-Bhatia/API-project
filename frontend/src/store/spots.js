import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/loadSpots";
const RECEIVE_SPOT = "spots/receiveSpot";
const RECEIVE_SPOT_IMAGES = "spots/receiveSpotImages";

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    };
};

const receiveSpot = (spot) => {
    return {
        type: RECEIVE_SPOT,
        spot
    }
}

const receiveSpotImages = (images, spotId) => {
    return {
        type: RECEIVE_SPOT_IMAGES,
        images,
        spotId
    };
};

export const thunkLoadSpots = () => async (dispatch) => {
    const res = await fetch("/api/spots");
    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpots(data.Spots));
        console.log('thunk, spotsArr:', data.Spots);
        return data.Spots;
    }
}

export const thunkShowSpot = (spotId) => async (dispatch) => {
    const res = await fetch (`/api/spots/${spotId}`);
    if (res.ok) {
        const spot = await res.json();
        dispatch(receiveSpot(spot));
        return spot;
    } else {
        const err = await res.json();
        return err
    }
}

export const thunkCreateSpot = (spot) => async (dispatch) => {
    const { country, address, city, state, description, name, price, image1, image2, image3, image4, image5 } = spot;
    const reqBody = { address, city, state, country, lat: 90, lng: 90, name, description, price };
    const imageInputs = { image1, image2, image3, image4, image5 }
    const imageArr = [];
    const res = await csrfFetch ("/api/spots", {
        method: "POST",
        // headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(reqBody)
    });

    const errs = {};
    let errFlag = false;
    if (res.status < 400) {
        const newSpot = await res.json();
        console.log('thunkcreate, newSpot: ', newSpot);
        let previewFlag = false;

        for (let image in imageInputs) {
            if (imageInputs[image]) {
                if (image === 'image1') {
                    previewFlag = true;
                }
                const reqImageBody = { url: imageInputs[image], preview: previewFlag }
                const imagesRes = await csrfFetch (`/api/spots/${newSpot.id}/images`, {
                    method: "POST",
                    body: JSON.stringify(reqImageBody)
                });

                if (imagesRes.ok) {
                    const newImage = await imagesRes.json();
                    if (newImage.preview === true) {
                        imageArr.unshift(newImage);
                    } else {
                        imageArr.push(newImage);
                    }
                } else {
                    errs.imageErrs[image] = await imagesRes.json();
                    errFlag = true;
                }
            }
        }

        if (!errFlag) {
            dispatch(receiveSpot(newSpot));
            dispatch(receiveSpotImages(imageArr, newSpot.id));
            return newSpot;
        } else {
            return errs;
        }
    } else {
        const err = await res.json();
        console.log('IN thunkCreateSpot, err: ', errs);
        return {errs, ...err};
    }
}

const initialState = { allSpots: null };

const spotsReducer = (state = initialState, action) => {
    // let newState;
    switch (action.type) {
        case LOAD_SPOTS:
            const loadSpotsState = { ...state };
            if (!loadSpotsState.allSpots) {
                loadSpotsState.allSpots = {};
            }
            const spotsArr = action.spots;
            spotsArr.forEach(spot => {
                const spotId = spot.id;
                loadSpotsState.allSpots[spotId] = spot;
            });
            return loadSpotsState;
        case RECEIVE_SPOT:
            const receiveSpotState = { ...state };
            // console.log('action.spot:', action.spot)
            const id = action.spot.id;
            if (receiveSpotState.allSpots) {
                receiveSpotState.allSpots[id] = action.spot;
                console.log('case receivespot, spot: ', receiveSpotState.allSpots[id])
            }
            console.log('case showspot, receiveSpotState', receiveSpotState);
            return receiveSpotState;
        case RECEIVE_SPOT_IMAGES:
            const receiveSpotImageState = { ...state };
            const spotIdForImage = action.spotId;
            if (receiveSpotImageState.allSpots[spotIdForImage]) {
                receiveSpotImageState.allSpots[spotIdForImage].SpotImages = action.images;
            }

            return receiveSpotImageState;
        default:
            return state;
    }
}

export default spotsReducer;
