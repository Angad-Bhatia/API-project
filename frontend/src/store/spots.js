const LOAD_SPOTS = "spots/loadSpots"
const SHOW_SPOT = "spots/showSpot"

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    };
};

const showSpot = (spot) => {
    return {
        type: SHOW_SPOT,
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
        console.log('thunkshow, spot: ', spot);
        dispatch(showSpot(spot));
        return spot;
    } else {
        const err = await res.json();
        return err
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
        case SHOW_SPOT:
            const showSpotState = { ...state };
            // console.log('action.spot:', action.spot)
            const id = action.spot.id;
            if (showSpotState.allSpots) {
                showSpotState.allSpots[id] = action.spot;
                console.log('case showspot, spot: ', showSpotState.allSpots[id])
            }
            console.log('case showspot, showSpotState', showSpotState);
            return showSpotState;
        default:
            return state;
    }
}

export default spotsReducer;
