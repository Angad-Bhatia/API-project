import React from 'react';

import "./SpotReviewsIndexItem.css";

function SpotReviewsIndexItem ({ reviewObj }) {
    const { User, createdAt, review } = reviewObj;
    const firstName = User.firstName
    const year = createdAt.slice(0, 4);
    const monthNum = Number(createdAt.slice(5, 7));
    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', { month: 'long' });
    }

    const month = getMonthName(monthNum);
    if (!reviewObj) {
        return null
    }
    return (
        <li id="review-item">
            <h5>{User.firstName}</h5>
            <h6>{month} {year}</h6>
            <p>{review}</p>
        </li>
    )
}

export default SpotReviewsIndexItem;
