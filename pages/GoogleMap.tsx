import React, { useEffect, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { eventNames } from 'process';


interface IMarker{
    address:string;
    latitude:number;
    longitude:number;
}
const containerStyle = {
    width: '1550px',
    height: '500px'
};

const center = {
    lat: 46.7554536,
    lng: 23.5671444
};

const marker1 ={
    lat: 46.7554536,
    lng: 23.5671444
}

const marker2 ={
    lat: 46.7546919, 
    lng: 23.5604183
  
}


// const marker3 = new google.maps.LatLng(46.7545548,23.558355);
type GoogleLatLng = google.maps.LatLng;

function MyComponent() {
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY as any,
  })

  const [marker, setMarker] = useState<IMarker>();

  const [map, setMap] = useState<GoogleMap>()

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  // const onUnmount = React.useCallback(function callback(map)  {
  //   return setMap(null);
  // }, [])

  const initEventListener = () : void =>{
    if(map){
      google.maps.event.addListener(map, 'click', function(e:any){
        console.log(e);
        coordinateToAddress(e.latLng);
        
      })
    }
  };
  useEffect(initEventListener,[map]);


const coordinateToAddress = async (coordinate:GoogleLatLng) =>{
  const geocoder = new google.maps.Geocoder();
        geocoder.geocode({location:coordinate}, function(results,status){
        if( status === 'OK'){
          console.log()
          if(results){
            console.log(results[0].formatted_address);
            setMarker({
              address:results[0].formatted_address,
              latitude: coordinate.lat(),
              longitude:coordinate.lng()
            })
          }
      }
      })
}

  
  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={new google.maps.LatLng(center.lat, center.lng)}
        zoom={17}
        onLoad={onLoad}
        // onUnmount={onUnmount}
      >
        
        <Marker 
          position={marker1}
          title="Primul marker"
        ></Marker>
        <Marker 
          position={marker2}
          title="Al doilea marker"
        ></Marker>
        

      
        <></>
      </GoogleMap>
    </div>
      
  ) : <></>
}

export default React.memo(MyComponent)