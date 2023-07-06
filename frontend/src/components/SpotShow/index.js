import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

import { thunkShowSpot } from "../../store/spots";

import SpotReviewsIndex from "../SpotReviewsIndex";

import "./SpotShow.css";

function SpotShow() {
    const { spotId } = useParams();
    const spot = useSelector((state) =>
        state.spots.allSpots ? state.spots.allSpots[spotId] : null
    );

    // console.log("selected spot", spot);
    const dispatch = useDispatch();


    useEffect(() => {
        // console.log('SPOTSHOW component, spot:', spot);
        dispatch(thunkShowSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot || !spot.Owner) {
        return null;
    }
    const { Owner, SpotImages, address, avgStarRating, city, country, description, name, numReviews, price, state } = spot;
    let plural;
    let stars = avgStarRating;
    if (numReviews > 1) {
        plural = 's';
    } else if (numReviews < 1) {
        stars = 'New';
    }

    const previewImg = SpotImages.find(img => img.preview).url;


    return (
        <>
            <h2>{name}</h2>
            <p>{city}, {state}, {country}</p>
            <div id="images-cont">
                <div id="main-image">
                    <img id="previewImage" src={previewImg} alt="No Preview Available"></img>
                </div>
                <div id="other-images">** Other Images Goes Here **</div>
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
                        {stars} &nbsp;&nbsp; {numReviews} review{plural}
                        </div>
                    </div>
                    <button id="reserve-btn">Reserve</button>
                </div>
            </div>
            <div id="reviews-cont">
                <h2>
                    <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                    {stars} &nbsp;&nbsp;{numReviews} review{plural}
                </h2>
                <div id="review-btn">** Create Review btn if logged-in **</div>
                <SpotReviewsIndex
                    spotId={spotId}
                />
            </div>
        </>
    )
}

export default SpotShow;
