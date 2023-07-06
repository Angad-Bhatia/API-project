// frontend/src/components/SpotIndexUser/index.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import SpotIndexItem from "../SpotIndexItem";

import { thunkLoadUserSpots } from "../../store/spots";
import "./SpotIndexUser.css";

const SpotIndexUser = () => {
    const spotsObj = useSelector((state) => state.spots.allSpots ? state.spots.allSpots : []);
    const spots = Object.values(spotsObj);
    const history = useHistory()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkLoadUserSpots());
    }, [dispatch])


    const onUpdate = (e, spot) => {
        e.preventDefault();
        history.push(`/spots/${spot.id}/edit`);
    }
    if (!spots.length) {
        return null;
    };

    return (
        <>
            <section>
                <ul id="spots-list">
                    {spots.map(spot => (
                        <div className='user-spot-conts'>
                            <SpotIndexItem
                                spot={spot}
                                key={spot.id}
                            />
                            <div className='user-crud-btn-conts'>
                                <button className='update-btns'>Update</button>
                                <button className='delete-btns'>Delete</button>
                            </div>
                        </div>

                    ))}
                </ul>
            </section>
        </>
    );
}

export default SpotIndexUser;
