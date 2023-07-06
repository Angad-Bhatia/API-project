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

    const dec = spot.price.indexOf('.');
    let floats = '';
    if (dec !== -1) {
        floats = spot.price.slice(dec + 1);
    }

    if (spot.price === '' || spot.price < 0 || isNaN(Number(spot.price)) || floats.length > 2) {
        errs.price = 'Price must be a valid amount greater than 0'
        errs.flag = true;
    }

    return errs;
}

export const isValidUrl = urlString=> {
    try {
        return Boolean(new URL(urlString));
    }
    catch(e){
        return false;
    }
}
