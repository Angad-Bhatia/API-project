// frontend/src/components/Navigation/index.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import SpotIndexItem from "../SpotIndexItem"

import { thunkLoadSpots } from '../../store/spot';
import './SpotIndex.css';

function SpotIndex () {
    const spots = useSelector(state => state.spot.spots);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(thunkLoadSpots());
    }, [dispatch])

    if (!spots) {
        return null
    };

    const spotsArr = Object.values(spots);
    console.log("SpotIndex spotsArr:", Object.values(spots));

    return (
        <>
            <section>
                <ul id="spots-list">
                    {spotsArr.map(spot => (
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
