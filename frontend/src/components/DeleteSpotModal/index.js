import React from 'react';
import { useDispatch } from 'react-redux';

import { useModal } from '../../context/Modal';
import { thunkDeleteSpot } from '../../store/spots';
import "./DeleteSpot.css";

function DeleteSpotModal({ spot }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const yes = 'Yes (Delete Spot)'
    const no ='No (Keep Spot)'

    const onDelete = async (e) => {
        e.preventDefault();
        return dispatch(thunkDeleteSpot(spot.id))
            .then(closeModal)
    }

    const onNo = (e) => {
        e.preventDefault();
        closeModal();
    }
    return (
        <div id='delete-spot-modal-cont'>
            <h2>Confirm Delete</h2>
            <p id="del-confirmation-text">Are you sure you want to remove this spot from the listings?</p>
            <div id='del-spot-y-n-cont'>
                <button id="yes-del-spot-btn" className="y-n-del-spot-btns" onClick={onDelete}>{yes}</button>
                <button id="no-del-spot-btn" className="y-n-del-spot-btns" onClick={onNo}>{no}</button>
            </div>
        </div>
    )
}

export default DeleteSpotModal;
