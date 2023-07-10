// frontend/src/components/SpotIndexUser/index.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, NavLink } from "react-router-dom";

import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from '../DeleteSpotModal';

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


    if (!spots.length) {
        return (
            <h1>User does not own any spots</h1>
        )
    };

    return (
        <>
            <h2>Manage Your Spots</h2>
            <button id='create-spot-user-index-btn'>
                <NavLink exact to="/spots/new" id="create-spot-user-index">Create a New Spot</NavLink>
            </button>
            <section>
                <ul id="spots-list">
                    {spots.map(spot => (
                        <div className='user-spot-conts'>
                            <SpotIndexItem
                                spot={spot}
                                key={spot.id}
                            />
                            <div className='user-crud-btn-conts'>
                                <button onClick={async (e) => {
                                    e.preventDefault();
                                    history.push(`/spots/${spot.id}/edit`);
                                }} className='update-btns'>Update</button>
                                <button className='delete-btns'>
                                    <OpenModalMenuItem
                                        itemText="Delete"
                                        modalComponent={<DeleteSpotModal
                                        spot={spot}
                                        key={spot.id}
                                        />}
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </ul>
            </section>
        </>
    );
}

export default SpotIndexUser;
