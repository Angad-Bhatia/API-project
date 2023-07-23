import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useModal } from "../../context/Modal";
import "./UpdateReview.css"

function UpdateReviewModal({ id, spotId, name, reviewObj }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [place, setPlace] = useState("");
    const [numStars, setNumStars] = useState(0);

    useEffect(() => {
        setPlace(reviewObj.review);
        setNumStars(reviewObj.stars)
    })

    return (
        <div>
            <h1>How was your stay at {name}?</h1>
            <h3></h3>
        </div>
    )
}

export default UpdateReviewModal;
