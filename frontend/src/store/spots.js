const LOAD_SPOTS = "spots/loadSpots"
const RECEIVE_SPOT = "spots/receiveSpot"

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
    const { country, address, city, state, description, name, price } = spot
    const reqBody = { address, city, state, country, lat: 90, lng: 90, name, description, price }
    const res = await fetch ('/api/spots', {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(reqBody)
    });
    if (res.ok) {
        const newSpot = await res.json();
        console.log('thunkcreate, newSpot: ', spot);
        dispatch(receiveSpot(newSpot));
        return newSpot;
    } else {
        const err = await res.json();
        console.log('IN thunkCreateSpot, err: ', err);
        return err;
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
        default:
            return state;
    }
}

export default spotsReducer;
