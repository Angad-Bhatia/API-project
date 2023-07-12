import React from 'react';

import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReviewModal from '../DeleteReviewModal';
import "./SpotReviewsIndexItem.css";

function SpotReviewsIndexItem ({ reviewObj, user, spotId }) {
    const { id, User, userId, createdAt, review, stars } = reviewObj;
    const year = createdAt.slice(0, 4);
    const day = createdAt.slice(8, 10);
    const monthNum = Number(createdAt.slice(5, 7));
    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', { month: 'long' });
    }

    const month = getMonthName(monthNum);

    return (
        <li key={reviewObj ? reviewObj.id: null} className="review-li">
            <h3>{user && user.id === userId ? user.firstName : User ? User.firstName : ''} &nbsp; &nbsp; &nbsp; Rating:&nbsp;{stars}</h3>
            <h4>{month} {day}, {year}</h4>
            <p>{review}</p>
            {user && user.id === userId && <button id="delete-review-btn">
                <OpenModalMenuItem
                    itemText="Delete"
                    modalComponent={<DeleteReviewModal
                        id={id}
                        spotId={spotId}
                    />}
                />
            </button>}
        </li>
    )
}

export default SpotReviewsIndexItem;
