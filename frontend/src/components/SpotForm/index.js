import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { thunkCreateSpot } from '../../store/spots';

import "./SpotForm.css";

const SpotForm = ({ spot, images, formType }) => {
    console.log('IN SpotForm comp, from arg, spot: ', spot);
    const history = useHistory();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({ image1: 'hi' });
    const [country, setCountry] = useState(spot.country);
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [description, setDescription] = useState(spot.description);
    const [name, setName] = useState(spot.name);
    const [price, setPrice] = useState(spot.price);
    const [image1, setImage1] = useState(images.image1);
    const [image2, setImage2] = useState(images.image2);
    const [image3, setImage3] = useState(images.image3);
    const [image4, setImage4] = useState(images.image4);
    const [image5, setImage5] = useState(images.image5);

    let btnText = 'Create Spot';
    if (formType !== 'Create a new spot') {
        btnText = 'Update Spot';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        spot = { ...spot, country, address, city, state, description, name, price, image1, image2, image3, image4, image5 };

        if (formType === 'Create a new Spot') {
            const newSpot = await dispatch(thunkCreateSpot(spot));
            spot = newSpot;
        }

        if (spot.errors) {
            setErrors(spot.errors);
        } else {
            // history.push(`/spots/${spot.id}`);
        }
    }

    return (
        <div id="form-cont">
            <form onSubmit={handleSubmit}>
                <h2>{formType}</h2>
                <ul id="form-list">
                    <li id="location-cont">
                        <div id='prompt-location' className='prompt-containers'>
                            <h4 id='location-header'>Where's your place located</h4>
                            <p id="location-text">Guests will only get your exact address once they booked a reservation.</p>
                        </div>
                        <div id="location-input" className='input-containers'>
                            <label>
                                <div id='country-errors' className='errors-cont'>
                                    Country
                                    <div className="errors">{errors.country}</div>
                                </div>
                                <input type="text"
                                    value={country}
                                    placeholder='Country'
                                    onChange={(e) => setCountry(e.target.value)}
                                ></input>
                            </label>
                            <label>
                                <div id='address-errors' className='errors-cont'>
                                    Street Address
                                    <div className="errors">{errors.address}</div>
                                </div>
                                <input type="text"
                                    value={address}
                                    placeholder='Address'
                                    onChange={(e) => setAddress(e.target.value)}
                                ></input>
                            </label>
                            <div id="city-state-cont">
                                <label>
                                <div id='city-errors' className='errors-cont'>
                                    City
                                    <div className="errors">{errors.city}</div>
                                </div>                                    <input type="text"
                                    value={city}
                                    placeholder='City'
                                    onChange={(e) => setCity(e.target.value)}
                                ></input>
                                </label>
                                ,&nbsp;&nbsp;
                                <label>
                                <div id='state-errors' className='errors-cont'>
                                    State
                                    <div className="errors">{errors.state}</div>
                                </div>                                    <input type="text"
                                    value={state}
                                    placeholder='State'
                                    onChange={(e) => setState(e.target.value)}
                                ></input>
                                </label>
                            </div>
                        </div>
                    </li>
                    <li id="description-cont">
                        <div id='prompt-description' className='prompt-containers'>
                            <h4 id="description-header">Describe your place to guests</h4>
                            <p id='description-text'>Mention the best features of your space, any special amentities
                            like fast wifi or parking, and what you love about the neighborhood.</p>
                        </div>
                        <div id="description-input" className='input-containers'>
                            <textarea
                                value={description}
                                placeholder='Description'
                                onChange={(e) => setDescription(e.target.value)}
                            >
                            </textarea>
                            <div className="errors">{errors.description}</div>
                        </div>
                    </li>
                    <li id="title-cont">
                        <div id='prompt-title' className='prompt-containers'>
                            <h4 id='title-header'>Create a title for your spot</h4>
                            <p id='title-text'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                        </div>
                        <div id='title-input' className='input-containers'>
                            <input type="text"
                                value={name}
                                placeholder='Name of your spot'
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                            <div className="errors">{errors.name}</div>
                        </div>
                    </li>
                    <li id="price-cont">
                        <div id='prompt-price' className='prompt-containers'>
                            <h4 id='price-header'>Set a base price for your spot</h4>
                            <p id='price-text'>Competitive pricing can help your listing stand out and
                            rank higher in search results.</p>
                        </div>
                        <div id='price-input' className='input-containers'>
                            <label>
                                $
                                <input type="text"
                                    value={price}
                                    placeholder='Price per night (USD)'
                                    onChange={(e) => setPrice(e.target.value)}
                                ></input>
                                <div className="errors">{errors.price}</div>
                            </label>
                        </div>
                    </li>
                    <li id="photos-cont">
                        <div id='prompt-photo' className='prompt-containers'>
                            <h4 id='photo-header'>Liven up your spot with photos</h4>
                            <p id='photo-text'>Submit a link to at least one photo to publish your spot.</p>
                        </div>
                        <ul id='photo-list'>
                            <li id='photo-input-1' className='input-containers image-inputs'>
                                <input type="text"
                                    value={image1}
                                    placeholder='Preview Image URL'
                                    onChange={(e) => setImage1(e.target.value)}
                                ></input>
                                <div className="errors">{errors.image1}</div>
                            </li>
                            <li id='photo-input-2' className='input-containers image-inputs'>
                                <input type="text"
                                    value={image2}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage2(e.target.value)}
                                ></input>
                                <div className="errors">{errors.image2}</div>
                            </li>
                            <li id='photo-input-3' className='input-containers image-inputs'>
                                <input type="text"
                                    value={image3}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage3(e.target.value)}
                                ></input>
                                <div className="errors">{errors.image3}</div>
                            </li>
                            <li id='photo-input-4' className='input-containers image-inputs'>
                                <input type="text"
                                    value={image4}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage4(e.target.value)}
                                ></input>
                                <div className="errors">{errors.image4}</div>
                            </li>
                            <li id='photo-input-5' className='input-containers image-inputs'>
                                <input type="text"
                                    value={image5}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage5(e.target.value)}
                                ></input>
                                <div className="errors">{errors.image5}</div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <button type="submit">Create Spot</button>
            </form>
        </div>
    )
}

export default SpotForm;
