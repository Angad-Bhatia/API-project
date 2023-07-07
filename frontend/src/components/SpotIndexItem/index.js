import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import './SpotIndexItem.css';

function SpotIndexItem ({ spot }) {
    const history = useHistory();
    const { city, state, price, avgStarRating, numReviews, previewImage } = spot;
    let stars = avgStarRating;
    if (numReviews < 1) {
        stars = 'New';
    }
    // console.log("indexItem, spot:", spot);
    const onClick = (e) => {
        e.preventDefault();
        history.push(`/spots/${spot.id}`);

    }
    return (
        // <Link to={`/spots/${spot.id}`}>
        <button onClick={onClick}>
            <li className="spot-li">
                <div className='image-container'>
                    <img className="preview" src={previewImage} alt="No Preview Image Available"></img>
                </div>
                <div className='address-rating'>
                    <p className='address'>{city}, {state}</p>
                    <p className='rating'>
                        <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                        {stars}
                    </p>
                </div>
                <div className="price-container">
                    <p className='price-text'>${price}&nbsp;</p>
                    <p className='night'>night</p>
                </div>
            </li>
        </button>
        // </Link>
    )
}

export default SpotIndexItem;
