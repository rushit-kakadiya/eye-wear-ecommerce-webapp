import React, {useState, useEffect} from 'react';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import {googleApiKey} from '../environment';

export default (props) => {
    const [value, setValue] = useState(null);
    // If intialValue come from parent
    useEffect(()=> {
        setValue(     props.intialValue ? {
                label: props.intialValue,
                value: {
                    description: props.intialValue,
                    matched_substrings: [],
                    place_id: null,
                    reference: null
                }
            } :  null)
    },[props.intialValue]);

    const setAddress = (address) => {
        setValue(address)
        geocodeByPlaceId(address.value.place_id)
        .then(results => {
            const addressDetail = results && results[0].address_components.reduce((fullAddress, row) => {
                if(row.types.includes("postal_code")){
                    fullAddress.zip_code = row.long_name;
                } else if(row.types.includes("country")){
                    fullAddress.country = row.short_name;
                } else if(row.types.includes("administrative_area_level_2")){
                    fullAddress.province = row.long_name;
                } else if(row.types.includes("administrative_area_level_1")){
                    fullAddress.city = row.long_name;
                }
                return fullAddress;
            },{
                city: '',
                province: '',
                country: '',
                zip_code: ''
            });
            props.setAddress({...addressDetail, address: address.label});
        })
        .catch(error => console.error(error));
    }
    
    return(
        <GooglePlacesAutocomplete
            apiKey={googleApiKey}
            selectProps={{
                placeholder: 'e.g:Floor/House/Block Number, RT/RW',
                value,
                onChange: setAddress,
            }}
            autocompletionRequest={{
                componentRestrictions: {
                country: ['id'],
                }
            }}
            getDefaultValue={() => 'Gandul, Depok City, West Java, Indonesia'}
        />
    )
}