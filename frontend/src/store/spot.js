const LOAD_SPOTS = "spots/loadSpots"
const SHOW_SPOT = "spots/showSpot"

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        payload: spots
    };
};

const showSpot = (spot) => {
    return {
        type: SHOW_SPOT,
        payload: spot
    }
}

export const thunkLoadSpots = () => async (dispatch) => {
    const res = await fetch("/api/spots");
    const data = await res.json();
    const spotsArr = data.Spots;
    const spots = {};
    spotsArr.forEach(spot => spots[spot.id] = spot);
    dispatch(loadSpots(spots));
    // console.log('thunk, spotsArr:', spots);
    return spots;
}

export const thunkShowSpot = (spotId) => async (dispatch) => {
    const res = await fetch (`/api/spots/${spotId}`);
    const spot = await res.json();
    dispatch(showSpot(spot));
    return spot;
}

const initialState = { spots: null };

const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SPOTS:
            newState = Object.assign({}, state);
            newState.spots = action.payload;
            // console.log("LOADreducer, state.spots", newState.spots)
            return newState;
        case SHOW_SPOT:
            newState = Object.assign({}, state);
            newState.spots[action.payload.id] = action.payload;
            return newState;
        default:
            return state;
    }
}

export default spotReducer;
