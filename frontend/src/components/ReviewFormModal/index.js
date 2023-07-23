import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useModal } from '../../context/Modal';
import { thunkCreateSpotReview } from '../../store/reviews';
import { thunkUpdateSpotReview } from '../../store/reviews';
import './ReviewForm.css';

function ReviewFormModal({ id, spotId, name, oldText, oldStars }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [reviewText, setReviewText] = useState(oldText ? oldText : "");
    const [stars, setStars] = useState(oldStars ? Number(oldStars) : 0);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (oldText) {
            await dispatch(thunkUpdateSpotReview(id, reviewText, stars, spotId))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors({ ...data.errors, message : data.message, flag: true });
                    }
                });
        } else {
            await dispatch(thunkCreateSpotReview(spotId, reviewText, stars))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors({ ...data.errors, message : data.message, flag: true });
                    }
                });
        }
        if (!errors.flag) {
            closeModal();
        }
    }


    return (
        <form id='review-form-cont' onSubmit={handleSubmit}>
            <h2 id="review-form-header">How was your stay{name ? ` at ${name}` : ""}?</h2>
            <textarea
                id="review-form-textarea"
                value={reviewText}
                name="custom-radio"
                placeholder='Leave your review here...'
                onChange={(e) => setReviewText(e.target.value)}
                required
            ></textarea>
            {errors.review && (
                <p>{errors.review}</p>
            )}
            <div id='star-row'>
                {[1, 2, 3, 4, 5].map(num => (
                        <input
                            type="radio"
                            key={`custom-radio${num}`}
                            name="custom-radio"
                            value={num}
                            onClick={(e) => setStars(e.target.value)}
                            className="custom-radio"
                            defaultChecked={stars === num}
                        />
                ))}
                &nbsp;&nbsp; Stars
            </div>
            {errors.stars && (
                <p>{errors.stars}</p>
            )}
            <button id="submit-review-btn" type="submit" disabled={!stars || reviewText.length < 10}>Submit Your Review</button>
            {errors.message && (
                <p>{errors.message}</p>
            )}
        </form>
    )
}

export default ReviewFormModal;
