export const spotValidation = (spot) => {
    const errs = { flag: false }
    if (spot.country.length < 4) {
        errs.country = 'Country is required';
        errs.flag = true;
    }
    if (spot.address.length < 2) {
        errs.address = 'Street Address is required';
        errs.flag = true;
    }
    if (spot.city.length < 2) {
        errs.city = 'City is required';
        errs.flag = true;
    }
    if (spot.state.length < 4) {
        errs.state = 'State is required';
        errs.flag = true;
    }
    if (spot.description.length < 30) {
        errs.description = 'Description needs a minimum of 30 characters';
        errs.flag = true;
    }
    if (spot.name.length < 2) {
        errs.name = 'Name is required';
        errs.flag = true;
    }

    let dec = 0;
    if (spot.price) {
        dec = spot.price.toString().indexOf('.');
    }
    let floats = '';
    if (dec !== -1 && spot.price) {
        floats = spot.price.toString().slice(dec + 1);
    }

    if (spot.price === '' || spot.price < 0 || isNaN(Number(spot.price)) || floats.length > 2) {
        errs.price = 'Price must be a valid number greater than 0'
        errs.flag = true;
    }

    return errs;
}

export const imageValidation = (imagesObj) => {
    const isValidUrl = urlString=> {
        try {
            return Boolean(new URL(urlString));
        }
        catch(e){
            return false;
        }
    }
    const imgErr = { flag: false }
    const { image1 } = imagesObj;
    if (!image1) {
        imgErr.image1 = 'Preview image is required.'
        imgErr.flag = true;
    }
    for (let key in imagesObj) {
        if (imagesObj[key] &&
            (!imagesObj[key].endsWith('.png') &&
            !imagesObj[key].endsWith('.jpg') &&
            !imagesObj[key].endsWith('.jpeg'))
            )
            {
                imgErr[key] = 'Image URL must end in .png, .jpg, or .jpeg';
                imgErr.flag = true;
            } else if (imagesObj[key] && !isValidUrl(imagesObj[key])) {
                imgErr[key] = 'Image URL must be a valid URL that starts with "https://"';
                imgErr.flag = true;
            }
        }

    return imgErr;
}

export const getMonthName = monthNumber => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', { month: 'long' });
}
