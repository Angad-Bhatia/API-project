import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useModal } from '../../context/Modal';
import { thunkDeleteSpotReview } from '../../store/reviews';
import "./DeleteReview.css"

function DeleteReviewModal({ id, spotId }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal()
    const yes = 'Yes (Delete Review)'
    const no = 'No (Keep Review)'
    const onClickNo = (e) => {
        e.preventDefault(e);
        closeModal();
    }

    const onClickYes = (e) => {
        e.preventDefault();
        return dispatch(thunkDeleteSpotReview(id, spotId))
            .then(history.push(`/spots/${spotId}`))
            .then(closeModal)
    }
    return (
        <div id="delete-review-modal-cont">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={onClickYes}>{yes}</button>
            <button onClick={onClickNo}>{no}</button>
        </div>
    )
}

export default DeleteReviewModal;
