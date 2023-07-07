import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkDeleteSpot, thunkLoadUserSpots } from '../../store/spots';

import "./DeleteSpotModal.css";

function DeleteSpotModal({ spot }) {
    const yes = 'Yes (Delete Spot)'
    const no ='No (Keep Spot)'
    console.log(spot);
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const onDelete = async (e) => {
        e.preventDefault();
        console.log('deleteClick')
        return dispatch(thunkDeleteSpot(spot.id))
            .then(closeModal)
            // .then(dispatch(thunkLoadUserSpots()));

    }
    return (
        <>
        <h2>Confirm Delete</h2>
        <p id="Del-confirmation-text">Are you sure you want to remove this spot from the listings?</p>
        <button onClick={onDelete}>{yes}</button>
        <button>{no}</button>
        </>
    )
}

export default DeleteSpotModal;
