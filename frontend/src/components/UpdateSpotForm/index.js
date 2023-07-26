import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { thunkShowSpot } from "../../store/spots";

import SpotForm from "../SpotForm";

const UpdateSpotForm = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots.allSpots ? state.spots.allSpots[spotId] : null);
    useEffect(() => {
        dispatch((thunkShowSpot(spotId)));
    }, [dispatch, spotId]);

    if (!spot || !spot.id || !spot.SpotImages) return null;
    const imagesArr = spot.SpotImages;


    const images = {};
    let imageNum = 2;

    for (let i = 0; i < imagesArr.length; i++) {
        const img = imagesArr[i];
        if (img.preview) {
            images['image1'] = img.url;
        } else {
            images[`image${imageNum}`] = img.url;
            imageNum += 1;
        }
    };

    return (
        <SpotForm
        spot={spot}
        images={images}
        formType='Update your Spot'
        />
    );
};

export default UpdateSpotForm;
