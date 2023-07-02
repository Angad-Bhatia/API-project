import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

import { thunkShowSpot } from "../../store/spot";

import "./SpotShow.css";

function SpotShow() {
    const dispatch = useDispatch()
    const { spotId } = useParams();

    const spot = useSelector(state => state.spot.spots[spotId]);

    const { Owner, SpotImages, address, avgStarRating, city, country, description, name, numReviews, price, state } = spot;

    console.log('SPOTSHOW component, spot:', spot);
    useEffect(() => {
        dispatch(thunkShowSpot(spotId));
    }, [dispatch])
    return (
        <>
            <h3>{name}</h3>
            <h4>{city}, {state}, {country}</h4>
        </>
    )
}

export default SpotShow;
