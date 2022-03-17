import {Client} from '@googlemaps/google-maps-services-js';


const client = new Client({});

// function calls not to be abused
export const convertAddressToLocation = async (address: string) => {
    let location = {
        lat: 0,
        lng: 0
    }

    try{
        const output = await client.geocode({
            params: {
            address: address,
            key: process.env.GOOGLE_API_KEY_BE!,
            language: 'ro',
            region: 'ro'
            },
        });
        location = output.data.results[0].geometry.location;
      
    } catch(error) {
        console.log(error);
    }
    

    return location;
}