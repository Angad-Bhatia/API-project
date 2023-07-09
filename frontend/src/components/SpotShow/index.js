import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

import SpotReviewsIndex from "../SpotReviewsIndex";
import { thunkShowSpot } from "../../store/spots";
import "./SpotShow.css";

function SpotShow() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const [flag, setFlag] = useState(true);

    const user = useSelector((state) => state.session.user ? state.session.user : null);
    const spot = useSelector((state) => state.spots.allSpots ? state.spots.allSpots[spotId] : {});

    useEffect(() => {
        dispatch(thunkShowSpot(spotId));
        // console.log(spot, user);
        setFlag(true);
        if (spot && user && spot.ownerId == user.id) {
            setFlag(false);
        }
    }, [dispatch, spotId, spot.ownerId, user.id]);

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
                <SpotReviewsIndex
                    spotId={spotId}
                    numReviews={numReviews}
                />
            </div>
        </>
    )
}

export default SpotShow;
