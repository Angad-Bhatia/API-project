import React from 'react';

import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import ReviewFormModal from '../ReviewFormModal';
import DeleteReviewModal from '../DeleteReviewModal';
import "./ReviewsIndexItem.css";

function ReviewsIndexItem ({ reviewObj, user, spotId, name, manage }) {
    const { id, User, userId, createdAt, review, stars } = reviewObj;
    if (!createdAt) {
        return null;
    };

    const year = createdAt.slice(0, 4);
    const day = createdAt.slice(8, 10);
    const monthNum = Number(createdAt.slice(5, 7));
    console.log('stars', stars);
    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', { month: 'long' });
    }

    const month = getMonthName(monthNum);

    return (
        <li key={reviewObj ? reviewObj.id: null} className="review-li">
            {!manage && <h3>{user && user.id === userId ? user.firstName : User ? User.firstName : ''} &nbsp; &nbsp; &nbsp; {stars}&nbsp;
                <i className="fa-solid fa-star" style={{"color": "#00040a"}}></i>
            </h3>}
            {manage && <h3>{name}</h3>}
            <h4>{month} {day}, {year}</h4>
            <p>{review}</p>
            {user && user.id === userId &&
            <div id="manage-review-btn-cont">
                <button id="delete-review-btn" className='manage-review-btns'>
                    <OpenModalMenuItem
                        itemText="Delete"
                        modalComponent={<DeleteReviewModal
                            id={id}
                            spotId={spotId}
                        />}
                    />
                </button>
                <button id="update-review-btn" className='manage-review-btns'>
                    <OpenModalMenuItem
                        itemText="Update"
                        modalComponent={<ReviewFormModal
                            id={id}
                            spotId={spotId}
                            name={name}
                            oldText={review}
                            oldStars={stars}
                        />}
                    />
                </button>
            </div>}
        </li>
    )
}

export default ReviewsIndexItem;
