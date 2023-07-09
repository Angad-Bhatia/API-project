import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useModal } from '../../context/Modal';
import { thunkCreateSpotReview } from '../../store/reviews';
import './CreateReview.css';

function CreateReviewModal({ spotId }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [reviewText, setReviewTest] = useState('');
    const [stars, setStars] = useState(1);
    const [errors, setErrors] = useState({});
    console.log('handlesubmit, spotId', reviewText.length);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const newReview = await dispatch(thunkCreateSpotReview(spotId, reviewText, stars))
            // .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors({ ...data.errors, message : data.message, flag: true });
                }
            });
        if (!errors.flag) {
            closeModal();
            history.push(`/spots/${spotId}`);
        }
    }


    return (
        <form id='review-form-cont' onSubmit={handleSubmit}>
            <h2>How was your stay?</h2>
            <textarea
                value={reviewText}
                placeholder='Just a quick review.'
                onChange={(e) => setReviewTest(e.target.value)}
                required
            ></textarea>
            {errors.review && (
                <p>{errors.review}</p>
            )}
            <div id='star-row'>
            <input type="radio" id="custom-radio1" onClick={(e) => setStars(e.target.value)} name="custom-radio1" className="custom-radio" value={1} />
                <label htmlFor="custom-radio1" className="custom-radio-label">1</label>

            <input type="radio" id="custom-radio2" onClick={(e) => setStars(e.target.value)} name="custom-radio2" className="custom-radio" value={1} />
                <label htmlFor="custom-radio2" className="custom-radio-label">2</label>
            {/* </input> */}
            <input type="radio" id="custom-radio3" onClick={(e) => setStars(e.target.value)} name="custom-radio3" className="custom-radio" value={1} />
                <label htmlFor="custom-radio3" className="custom-radio-label">3</label>
            {/* </input> */}
            <input type="radio" id="custom-radio4" onClick={(e) => setStars(e.target.value)} name="custom-radio4" className="custom-radio" value={1} />
                <label htmlFor="custom-radio4" className="custom-radio-label">4</label>
            {/* </input> */}
            <input type="radio" id="custom-radio5" onClick={(e) => setStars(e.target.value)} name="custom-radio5" className="custom-radio" value={1} />
                <label htmlFor="custom-radio5" className="custom-radio-label">5</label>
            {/* </input> */}
                {/* <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i> */}
                &nbsp;&nbsp; Stars
            </div>
            {errors.stars && (
                <p>{errors.stars}</p>
            )}
            <button type="submit">Submit Your Review</button>
            {errors.message && (
                <p>{errors.message}</p>
            )}
        </form>
    )
}

export default CreateReviewModal;
