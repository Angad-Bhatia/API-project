import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

import SpotReviewsIndex from "../SpotReviewsIndex";
import { thunkShowSpot } from "../../store/spots";
import "./SpotShow.css";

function SpotShow() {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector((state) => state.spots.allSpots ? state.spots.allSpots[spotId] : {});
    const { Owner, SpotImages, avgStarRating, city, country, description, name, numReviews, price, state } = spot;
    useEffect(() => {
        dispatch(thunkShowSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot || !spot.Owner) {
        return null;
    }
    let numReviewsText;
    let stars;
    if (numReviews > 1) {
        stars = Math.round(avgStarRating * 10) / 10;
        numReviewsText = `${numReviews} reviews`
    } else if (numReviews === 0) {
        numReviewsText = ''
        stars = 'New'
    } else if (numReviews === 1) {
        numReviewsText = '1 review'
    }

    const previewImg = SpotImages.find(img => img.preview).url;
    const otherArr = SpotImages.slice(1);

    return (
        <>
            <h2>{name}</h2>
            <p>{city}, {state}, {country}</p>
            <div id="images-cont">
                <div id="main-image">
                    <img id="preview" src={previewImg} alt="Preview Not Available"></img>
                </div>
                <div id="other-images-cont">
                    {otherArr.length ?
                        otherArr.map(image => (
                            <img id={`other-${image.id}`} src={image.url} alt="Not Available" className="other-images"></img>
                        )) : null
                    }
                </div>
            </div>
            <div id="all-info-cont">
                <div id="details-cont">
                    <h3>Hosted by {Owner.firstName} {Owner.lastName}</h3>
                    <p>{description}</p>
                </div>
                <div id="reserve-cont">
                    <div id="reserve-info">
                        <div id="reserve-price">
                            <div id="actual-price">${price}</div>
                            <p id="night">night</p>
                        </div>
                        <div id="reserve-reviews">
                        <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                        {stars} &nbsp;&nbsp; {numReviewsText}
                        </div>
                    </div>
                    <button id="reserve-btn">Reserve</button>
                </div>
            </div>
            <div id="reviews-cont">
                <h2>
                    <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                    {stars} &nbsp;&nbsp; {numReviewsText}
                </h2>
                {numReviews ? <SpotReviewsIndex
                    spotId={spotId}
                    numReviews={numReviews}
                /> : null
                }
            </div>
        </>
    )
}

export default SpotShow;
