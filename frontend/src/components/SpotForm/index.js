import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { thunkCreateSpot, thunkUpdateSpot } from '../../store/spots';

import { spotValidation, imageValidation } from '../../helpers';

import "./SpotForm.css";

const SpotForm = ({ spot, images, formType }) => {
    let states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Minor Outlying Islands', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'U.S. Virgin Islands', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    let countries = ['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','The Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Democratic Republic of the Congo','Costa Rica','Côte d"Ivoire', 'Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','East Timor (Timor-Leste)','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','The Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Korea, North','Korea, South','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia, Federated States of','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar (Burma)','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Macedonia','Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','Spain','Sri Lanka','Sudan','Sudan, South','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States of America','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe']

    let btnText = 'Create Spot';
    if (formType !== 'Create a new Spot') {
        btnText = 'Update Spot';
        const adjCountries = countries;
        const adjStates = states;
        const countryInd = countries.indexOf(spot.country);
        const stateInd = states.indexOf(spot.state);
        if (countryInd > -1) {
            adjCountries.splice(countryInd, 1);
            countries = adjCountries
        }
        if (stateInd > -1) {
            adjStates.splice(stateInd, 1);
            states = adjStates
        }
    }

    const history = useHistory();
    const dispatch = useDispatch();
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

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({ flag: false });
        setImgErrors({ flag: false })

        spot = { ...spot, country, address, city, state, description, name, price, image1, image2, image3, image4, image5 };
        const spotFrontErrors = spotValidation(spot);
        const imageFrontErrors = imageValidation(imagesObj);
        setErrors({ ...spotFrontErrors });
        setImgErrors({ ...imageFrontErrors });
        if (formType === 'Create a new Spot' && imageFrontErrors.flag === false && spotFrontErrors.flag === false) {
            const newSpot = await dispatch(thunkCreateSpot(spot))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors({ ...data.errors, flag: true });
                    spotFrontErrors.flag = true;
                }
            });
            spot = newSpot;
        } else if (formType === 'Update your Spot' && spot.id && imageFrontErrors.flag === false && spotFrontErrors.flag === false) {
            await dispatch(thunkUpdateSpot(spot))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors({ ...data.errors, flag: true });
                    spotFrontErrors.flag = true;
                }
            });
        }
        if (spot && spot.id && imageFrontErrors.flag === false && spotFrontErrors.flag === false) {
            history.push(`/spots/${spot.id}`);
        }
    }


    return (
        <div id="form-cont">
            <form onSubmit={handleSubmit} id="actual-spot-form">
                <ul id="form-list">
                <h2>{formType}</h2>
                    <li id="location-cont" className='spot-form-li-conts'>
                        <div id='prompt-location' className='prompt-containers'>
                            <h3 id='location-header' className='prompt-headers'>Where's your place located</h3>
                            <p id="location-text">Guests will only get your exact address once they booked a reservation.</p>
                        </div>
                        <div id="location-input" className='input-containers'>
                            <label>
                                <div id='country-errors' className='errors-cont'>
                                    Country&nbsp;&nbsp;
                                    <div className="errors">{errors.country}</div>
                                </div>
                                <select id='country' name='country' className='full-length-containers-spot-form'
                                    onChange={(e) => setCountry(e.target.value)}
                                >
                                    <option value={country} selected>{country}</option>
                                    {countries.map(countryEl => (
                                        <option value={countryEl} key={countryEl}>{countryEl}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <div id='address-errors' className='errors-cont'>
                                    Street Address&nbsp;&nbsp;
                                    <div className="errors">{errors.address}</div>
                                </div>
                                <input type="text"
                                    className='full-length-containers-spot-form'
                                    value={address}
                                    placeholder='Address'
                                    onChange={(e) => setAddress(e.target.value)}
                                ></input>
                            </label>
                            <div id="city-state-cont">
                                <label>
                                <div id='city-errors' className='errors-cont'>
                                    City&nbsp;&nbsp;
                                    <div className="errors">{errors.city}</div>
                                </div>
                                <input type="text"
                                    id='city-actual-input'
                                    value={city}
                                    placeholder='City'
                                    onChange={(e) => setCity(e.target.value)}
                                ></input>
                                </label>

                                <label>
                                <div id='state-errors' className='errors-cont'>
                                    State&nbsp;&nbsp;
                                    <div className="errors">{errors.state}</div>
                                </div>
                                {country === 'United States of America' &&
                                <select
                                    id="state"
                                    name="state"
                                    onChange={(e) => setState(e.target.value)}
                                    className='state-inputs'
                                >
                                    <option value={state} selected>{state}</option>
                                    {states.map(state => (
                                        <option value={state} key={state}>{state}</option>))}
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
                    <li id="description-cont" className='spot-form-li-conts'>
                        <div id='prompt-description' className='prompt-containers'>
                            <h3 id="description-header" className='prompt-headers'>Describe your place to guests</h3>
                            <p id='description-text'>Mention the best features of your space, any special amentities
                            like fast wifi or parking, and what you love about the neighborhood.</p>
                        </div>
                        <div id="description-input" className='input-containers'>
                            <textarea
                                className='full-length-containers-spot-form'
                                value={description}
                                placeholder='Please write at least 30 characters'
                                onChange={(e) => setDescription(e.target.value)}
                            >
                            </textarea>
                            <div className="errors">{errors.description}</div>
                        </div>
                    </li>
                    <li id="title-cont" className='spot-form-li-conts'>
                        <div id='prompt-title' className='prompt-containers'>
                            <h3 id='title-header' className='prompt-headers'>Create a title for your spot</h3>
                            <p id='title-text'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                        </div>
                        <div id='title-input' className='input-containers'>
                            <input type="text"
                                className='full-length-containers-spot-form'
                                value={name}
                                placeholder='Name of your spot'
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                            <div className="errors">{errors.name}</div>
                        </div>
                    </li>
                    <li id="price-cont" className='spot-form-li-conts'>
                        <div id='prompt-price' className='prompt-containers'>
                            <h3 id='price-header' className='prompt-headers'>Set a base price for your spot</h3>
                            <p id='price-text'>Competitive pricing can help your listing stand out and
                            rank higher in search results.</p>
                        </div>
                        <div id='price-input' className='input-containers'>
                            <label>
                                $
                                <input type="text"
                                    className='full-length-containers-spot-form'
                                    value={price}
                                    placeholder='Price per night (USD)'
                                    onChange={(e) => setPrice(e.target.value)}
                                ></input>
                                <div className="errors">{errors.price}</div>
                            </label>
                        </div>
                    </li>
                    <li id="photos-cont" className='spot-form-li-conts'>
                        <div id='prompt-photo' className='prompt-containers'>
                            <h3 id='photo-header' className='prompt-headers'>Liven up your spot with photos</h3>
                            <p id='photo-text'>Submit a link to at least one photo to publish your spot.</p>
                        </div>
                        <ul id='photo-list'>
                            <li id='photo-input-1' className='input-containers image-inputs'>
                                <input type="text"
                                    className='full-length-containers-spot-form'
                                    value={image1}
                                    placeholder='Preview Image URL'
                                    onInput={(e) => setImage1(e.target.value)}
                                ></input>
                                <div className='errors'>{imgErrors.prev}</div>
                                <div className="errors">{imgErrors.image1}</div>
                            </li>
                            <li id='photo-input-2' className='input-containers image-inputs'>
                                <input type="text"
                                    className='full-length-containers-spot-form'
                                    value={image2}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage2(e.target.value)}
                                ></input>
                                <div className="errors">{imgErrors.image2}</div>
                            </li>
                            <li id='photo-input-3' className='input-containers image-inputs'>
                                <input type="text"
                                    className='full-length-containers-spot-form'
                                    value={image3}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage3(e.target.value)}
                                ></input>
                                <div className="errors">{imgErrors.image3}</div>
                            </li>
                            <li id='photo-input-4' className='input-containers image-inputs'>
                                <input type="text"
                                    className='full-length-containers-spot-form'
                                    value={image4}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage4(e.target.value)}
                                ></input>
                                <div className="errors">{imgErrors.image4}</div>
                            </li>
                            <li id='photo-input-5' className='input-containers image-inputs'>
                                <input type="text"
                                    className='full-length-containers-spot-form'
                                    value={image5}
                                    placeholder='Image URL'
                                    onChange={(e) => setImage5(e.target.value)}
                                ></input>
                                <div className="errors">{imgErrors.image5}</div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <button type="submit" id="submit-spot-form-btn">{btnText}</button>
            </form>
        </div>
    )
}

export default SpotForm;
