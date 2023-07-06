import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { thunkCreateSpot } from '../../store/spots';

import { spotValidation, isValidUrl } from '../../helpers';

import "./SpotForm.css";

const SpotForm = ({ spot, images, formType }) => {
    const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Minor Outlying Islands', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'U.S. Virgin Islands', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    const countries = ['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','The Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Democratic Republic of the Congo','Costa Rica','Côte d"Ivoire', 'Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','East Timor (Timor-Leste)','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','The Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Korea, North','Korea, South','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia, Federated States of','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar (Burma)','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Macedonia','Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','Spain','Sri Lanka','Sudan','Sudan, South','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States of America','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe']


    const history = useHistory();
    const dispatch = useDispatch();
    const imgErr = { flag: false };
    const [errors, setErrors] = useState({});
    const [imgErrors, setImgErrors] = useState({});
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

    const imagesObj = { image1, image2, image3, image4, image5 };

    let btnText = 'Create Spot';
    if (formType !== 'Create a new spot') {
        btnText = 'Update Spot';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ flag: false });
        setImgErrors({ flag: false })
        imgErr.flag = false;
        if (!image1) {
            imgErr.image1 = 'Preview image is required.'
            imgErr.flag = true;
        }
        for (let key in imagesObj) {
            if (imagesObj[key] &&
                ((!imagesObj[key].endsWith('.png') &&
                !imagesObj[key].endsWith('.jpg') &&
                !imagesObj[key].endsWith('.jpeg')) ||
                !isValidUrl(imagesObj[key]))
                ) {
                    imgErr[key] = 'Image URL must be a valid URL that ends in .png, .jpg, or .jpeg';
                    imgErr.flag = true;
                }
            }
            setImgErrors(imgErr);
        spot = { ...spot, country, address, city, state, description, name, price, image1, image2, image3, image4, image5 };
        const spotErrs = spotValidation(spot);
        setErrors(spotErrs);

        if (formType === 'Create a new Spot' && !imgErrors.flag&& !errors.flag) {
            console.log('hi');
            const newSpot = await dispatch(thunkCreateSpot(spot))
            .catch(async (res) => {
                const data = await res.json();
                console.log('data after dispatch, data: ', data);
                if (data && data.errors) {
                    setErrors({ ...data.errors, flag: true });
                } else {
                }
            });
            spot = newSpot;
            if (spot && spot.id && !imgErrors.flag&& !errors.flag) {
                history.push(`/spots/${spot.id}`);
            }
        }
        // console.log('successful sibmission, spot & newSpot:', spot)

    }

    return (
        <div id="form-cont">
            <form onSubmit={handleSubmit}>
                <ul id="form-list">
                <h2>{formType}</h2>
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
                                <select id='country' name='country'
                                    onChange={(e) => setCountry(e.target.value)}
                                >
                                    <option value="" selected>Select Country</option>
                                    {countries.map(country => (
                                        <option value={country}
                                        >{country}</option>
                                    ))}
                                </select>
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
                                </div>
                                <input type="text"
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
                                </div>
                                {country == 'United States of America' &&
                                <select
                                    id="state"
                                    name="state"
                                    onChange={(e) => setState(e.target.value)}
                                    className='state-inputs'
                                >
                                    <option value="" selected>Select State</option>
                                    {states.map(state => (
                                        <option value={state}>{state}</option>))}
                                </select>}
                                {country !== 'United States of America' && <input type="text"
                                    value={state}
                                    placeholder='State'
                                    onChange={(e) => setState(e.target.value)}
                                    className='state-inputs'
                                ></input>}
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
                                <div className='errors'>{imgErrors.prev}</div>
                                <div className="errors">{imgErrors.image1}</div>
                            </li>
                            <li id='photo-input-2' className='input-containers image-inputs'>
                                <input type="text"
                                    value={image2}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage2(e.target.value)}
                                ></input>
                                <div className="errors">{imgErrors.image2}</div>
                            </li>
                            <li id='photo-input-3' className='input-containers image-inputs'>
                                <input type="text"
                                    value={image3}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage3(e.target.value)}
                                ></input>
                                <div className="errors">{imgErrors.image3}</div>
                            </li>
                            <li id='photo-input-4' className='input-containers image-inputs'>
                                <input type="text"
                                    value={image4}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage4(e.target.value)}
                                ></input>
                                <div className="errors">{imgErrors.image4}</div>
                            </li>
                            <li id='photo-input-5' className='input-containers image-inputs'>
                                <input type="text"
                                    value={image5}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage5(e.target.value)}
                                ></input>
                                <div className="errors">{imgErrors.image5}</div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <button type="submit">Create Spot</button>
            </form>
        </div>
    )
}

// {country === 'United States of America' && <select id="state" name="state">
//                                     {states.map(state => (
//                                         <option value={state}>{state}</option>))}
//                                 </select>}

export default SpotForm;
