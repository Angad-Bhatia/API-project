import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/loadSpots";
const RECEIVE_SPOT = "spots/receiveSpot";
const DELETE_SPOT = "spots/deleteSpot"
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

const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
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
        // console.log('thunk, spotsArr:', data.Spots);
        return data.Spots;
    }
}

export const thunkLoadUserSpots = () => async (dispatch) => {
    const res = await fetch("/api/spots/current");
    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpots(data.Spots));
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
        body: JSON.stringify(reqBody)
    });

    const errs = {};
    let errFlag = false;

    if (res.status < 400) {
        const newSpot = await res.json();
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
                    if (newImage.preview) {
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
            errFlag = true;
            return errs;
        }
    } else {
        const err = await res.json();
        return {errs, ...err};
    }
}

export const thunkUpdateSpot = (spot) => async (dispatch) => {
    const { country, address, city, state, description, name, price, image1, image2, image3, image4, image5 } = spot;
    const reqBody = { address, city, state, country, lat: 90, lng: 90, name, description, price };
    const imageInputs = { image1, image2, image3, image4, image5 }
    const imageArr = [];
    let spotImagesArr;
    // console.log('thunk update, spot: ', spot.SpotImages);


    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        body: JSON.stringify(reqBody)
    });

    const errs = {};
    let errFlag = false;

    if (res.status < 400) {
        const updatedSpot = await res.json();
        let previewFlag = false;
        // console.log('thunkUpdate, before if, spot, spot.SpotImages', spot, spot.SpotImages)
        if (spot && spot.SpotImages && spot.SpotImages.length) {
            spotImagesArr = spot.SpotImages;
            for (let i = 0; i < spotImagesArr.length; i++) {
                const img = spotImagesArr[i];
                // console.log('thunkUpdate, in delImg loop, img: ', img);
                await csrfFetch(`/api/spot-images/${img.id}`, { method: 'DELETE' });
            }
        }

        for (let image in imageInputs) {
            if (image === 'image1') {
                previewFlag = true;
            }
            const reqImageBody = { url: imageInputs[image], preview: previewFlag };
            // console.log('thunkUpdate, before imagePost, reqImageBody', reqImageBody);
            const imageRes = await csrfFetch(`/api/spots/${updatedSpot.id}/images`, {
                method: 'POST',
                body: JSON.stringify(reqImageBody)
            });

            if (imageRes.ok) {
                const updatedImage = await imageRes.json();
                if (updatedImage.preview) {
                    imageArr.unshift(updatedImage);
                } else {
                    imageArr.push(updatedImage);
                }
            } else {
                errs.imageErrs[image] = await imageRes.json();
                errFlag = true;
            }
        }

        if (!errFlag) {
            dispatch(receiveSpot(updatedSpot));
            dispatch(receiveSpotImages(imageArr, updatedSpot.id));
            return updatedSpot;
        } else {
            errFlag = true;
            return errs;
        }
    } else {
        const err = await res.json();
        return { errs, ...err };
    }
}

export const thunkDeleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, { method: 'DELETE' });
    if (res.ok) {
        // console.log('resOkay')
        const data = await res.json();
        dispatch(deleteSpot(spotId));
        return data;
    }
}

const initialState = { allSpots: null };

const spotsReducer = (state = initialState, action) => {
    // let newState;
    switch (action.type) {
        case LOAD_SPOTS:
            const loadSpotsState = { ...state };
            // if (!loadSpotsState.allSpots) {
                loadSpotsState.allSpots = {};
            // }
            const spotsArr = action.spots;
            spotsArr.forEach(spot => {
                const spotId = spot.id;
                loadSpotsState.allSpots[spotId] = spot;
            });
            return loadSpotsState;
        case RECEIVE_SPOT:
            const receiveSpotState = { ...state };
            const id = action.spot.id;
            if (!receiveSpotState.allSpots) {
                receiveSpotState.allSpots = {};
            }

            receiveSpotState.allSpots[id] = action.spot;
            return receiveSpotState;
        case DELETE_SPOT:
            const deleteSpotState = { ...state };
            const deleteId = action.spotId;
            if (deleteSpotState.allSpots && deleteSpotState.allSpots[deleteId]) {
                delete deleteSpotState.allSpots[deleteId];
            }
            return deleteSpotState;
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
