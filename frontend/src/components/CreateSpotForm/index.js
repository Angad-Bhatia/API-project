import SpotForm from "../SpotForm";

const CreateSpotForm = () => {
    const spot = {
        country: '',
        address: '',
        city: '',
        state: '',
        description: '',
        name: '',
        price: ''
    }

    const images = {
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: ''
    }
    return (
        <SpotForm
            spot={spot}
            images={images}
            formType="Create a new Spot"
        />
    )
}

export default CreateSpotForm;
