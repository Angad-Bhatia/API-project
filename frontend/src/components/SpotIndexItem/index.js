import React from 'react';
import { Link } from 'react-router-dom'

import './SpotIndexItem.css';

function SpotIndexItem ({ spot }) {
    const { city, state, price, avgStarRating, previewImage } = spot;
    console.log("indexItem, previewImage:", spot);
    return (
        <Link to={`/spots/${spot.id}`}>
            <li className="spot-li">
                <div className='image-container'>
                    <img className="preview" src={previewImage}></img>
                </div>
                <div className='address-rating'>
                    <p className='address'>{city}, {state}</p>
                    <p className='rating'>
                        <i class="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                        {avgStarRating}
                    </p>
                </div>
                <div className="price-container">
                    <p className='price-text'>${price}&nbsp;</p>
                    <p className='night'>night</p>
                </div>
            </li>
        </Link>
    )
}

export default SpotIndexItem;
