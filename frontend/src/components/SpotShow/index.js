import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

import ReviewsIndex from "../ReviewsIndex";
import { thunkShowSpot } from "../../store/spots";
import "./SpotShow.css";

function SpotShow() {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector((state) => state.spots.allSpots ? state.spots.allSpots[spotId] : {});
    const reviewsObj = useSelector((state) => state.reviews.allReviews ? state.reviews.allReviews : null);
    const { Owner, SpotImages, city, country, description, name, price, state } = spot;

    const [numReviews, setNumReviews] = useState(0);
    const [numReviewsText, setNumReviewsText] = useState('');
    const [stars, setStars] = useState('');

    useEffect(() => {
        dispatch(thunkShowSpot(spotId));
    }, [dispatch, spotId]);

    useEffect(() => {
        const reviews = reviewsObj ? Object.values(reviewsObj) : [];
        if (reviews.length > 1) {
            const avgRating = reviews.reduce((acc, review) => acc + Number(review.stars), 0);
            setStars(parseFloat(avgRating / reviews.length).toFixed(1));
            setNumReviews(reviews.length);
            setNumReviewsText(`· ${reviews.length} reviews`);
        } else if (reviews.length === 1) {
            setStars(parseFloat(reviews[0].stars).toFixed(1));
            setNumReviews(1);
            setNumReviewsText('· 1 review');
        } else {
            setNumReviews(0);
            setNumReviewsText('');
            setStars('New');
        }
    }, [numReviews, reviewsObj]);

    const onClickReserve = (e) => {
        e.preventDefault();
        alert('Feature Coming Soon...');
    }

    if (!spot || !spot.Owner) {
        return null;
    }

    const previewImg = SpotImages.find(img => img.preview).url;
    const otherArr = SpotImages.slice(1);

    return (
        <>
            <h2>{name}</h2>
            <p id='city-state-country-text'>{city}, {state}, {country}</p>
            <div id="images-cont">
                <div id="preview-cont">
                    <img id="preview" src={previewImg} alt="Preview Not Available"></img>
                </div>
                <div id="other-images-cont">
                    {otherArr.length ?
                        otherArr.map(image => (
                            <img id={`other-${image.id}`} key={image.id} src={image.url} alt="Not Available" className="other-images"></img>
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
                            <p id="night">&nbsp;night</p>
                        </div>
                        <div id="reserve-reviews">
                            <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                            {stars} {numReviewsText}
                        </div>
                    </div>
                    <button id="reserve-btn" onClick={onClickReserve}>Reserve</button>
                </div>
            </div>
            <div id="reviews-cont">
                <h2>
                    <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
                    {stars} {numReviewsText}
                </h2>
                <ReviewsIndex
                    spotId={spotId}
                    numReviews={numReviews}
                />
            </div>
        </>
    )
}

export default SpotShow;
