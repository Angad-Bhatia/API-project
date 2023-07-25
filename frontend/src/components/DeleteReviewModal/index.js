import React from 'react';
import { useDispatch } from 'react-redux';

import { useModal } from '../../context/Modal';
import { thunkDeleteSpotReview } from '../../store/reviews';
import "./DeleteReview.css"

function DeleteReviewModal({ id, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const yes = 'Yes (Delete Review)'
    const no = 'No (Keep Review)'

    const onClickYes = (e) => {
        e.preventDefault();
        return dispatch(thunkDeleteSpotReview(id, spotId))
        .then(closeModal)
    }

    const onClickNo = (e) => {
        e.preventDefault(e);
        closeModal();
    }

    return (
        <div id="delete-review-modal-cont">
            <h1>Confirm Delete</h1>
            <p id='del-review-confirmation-text'>Are you sure you want to delete this review?</p>
            <div id='del-review-btn-cont'>
                <button onClick={onClickYes} id="yes-del-review-btn" className='y-n-del-review-btns'>{yes}</button>
                <button onClick={onClickNo} id="no-del-review-btn" className='y-n-del-review-btns'>{no}</button>
            </div>
        </div>
    )
}

export default DeleteReviewModal;
