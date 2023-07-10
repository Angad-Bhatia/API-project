import React, { useState, useEffect } from 'react';

import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReviewModal from '../DeleteReviewModal';
import "./SpotReviewsIndexItem.css";

function SpotReviewsIndexItem ({ reviewObj, userId, spotId }) {
    const { id, User, createdAt, review } = reviewObj;
    const year = createdAt.slice(0, 4);
    const monthNum = Number(createdAt.slice(5, 7));
    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', { month: 'long' });
    }
    const [delFlag, setDelFlag] = useState(false);


    useEffect(() => {
        if (userId === User.id) {
            setDelFlag(true)
        }
    }, [userId, User.id]);



    const month = getMonthName(monthNum);
    if (!reviewObj || !User) {
        return null
    }
    return (
        <li key={reviewObj.id}>
            <h5>{User.firstName}</h5>
            <h6>{month} {year}</h6>
            <p>{review}</p>
            {delFlag && <button id="delete-review-btn">
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
