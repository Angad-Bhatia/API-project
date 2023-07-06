// frontend/src/components/SpotIndex/index.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SpotIndexItem from "../SpotIndexItem"

import { thunkLoadSpots } from '../../store/spots';
import './SpotIndex.css';

function SpotIndex () {
    const spotsObj = useSelector((state) => state.spots.allSpots ? state.spots.allSpots : []);
    const spots = Object.values(spotsObj);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkLoadSpots());
    }, [dispatch])


    if (!spots.length) {
        return null;
    };

    return (
        <>
            <section>
                <ul id="spots-list">
                    {spots.map(spot => (
                        <SpotIndexItem
                            spot={spot}
                            key={spot.id}
                        />
                    ))}
                </ul>
            </section>
        </>
    );
}

export default SpotIndex;
