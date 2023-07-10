import React from 'react';
import { useHistory } from 'react-router-dom';

import './SpotIndexItem.css';

function SpotIndexItem ({ spot }) {
    const history = useHistory();
    const { city, state, price, name, avgStarRating, numReviews, previewImage } = spot;
    let starsIndex = Math.round(avgStarRating * 10) / 10;
    console.log('starratings', avgStarRating, starsIndex);
    if (numReviews < 1) {
        starsIndex = 'New';
    }

    const onClick = (e) => {
        e.preventDefault();
        history.push(`/spots/${spot.id}`);

    }
    return (
        <li className="spot-li">
            <button className="spot-show-btn" onClick={onClick}>
            <span className="tooltip">{name}</span>
                <div className='image-container-index'>
                    <img className="preview-images-index" src={previewImage} alt="No Preview Available"></img>
                </div>
                <div className='address-rating'>
                    <p className='address'>{city}, {state}</p>
                    <p className='rating'>
                        <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                        {starsIndex ? starsIndex : "New"}
                    </p>
                </div>
                <div className="price-container">
                    <p className='price-text'>${price}&nbsp;</p>
                    <p className='night'>night</p>
                </div>
            </button>
        </li>
    )
}

export default SpotIndexItem;
