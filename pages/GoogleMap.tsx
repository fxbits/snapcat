import React, { useEffect, useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

  interface IMarker {
      address: string;
      latitude: number;
      longitude: number;
  }
  const containerStyle = {
      width: '1550px',
      height: '500px'
  };

  const center = {
      lat: 46.7554536,
      lng: 23.5671444
  };

  const marker1 = {
      lat: 46.7554536,
      lng: 23.5671444
  }

  const marker2 = {
      lat: 46.7546919, 
      lng: 23.5604183 
  }

  type GoogleLatLng = google.maps.LatLng;
  type GoogleMarker = google.maps.Marker;


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

    const initEventListener = () : void =>{
      if(map){
        google.maps.event.addListener(map, 'click', function(e:any){
          coordinateToAddress(e.latLng);  
        })
      }
    };
    useEffect(initEventListener,[map]);


  const coordinateToAddress = async (coordinate: GoogleLatLng) =>{
    const geocoder = new google.maps.Geocoder();
          geocoder.geocode({location: coordinate}, function(results, status){
          if (status === 'OK') {
            if (results) {
              setMarker({
                address:results[0].formatted_address,
                latitude: coordinate.lat(),
                longitude:coordinate.lng()
              })
            }
        }
        })
  }

  const addSingleMarker = ():void=>{
    if(marker) {
      addMarker(new google.maps.LatLng(marker.latitude,marker.longitude));
    }    
  };
  useEffect(addSingleMarker,[marker]);

  const image="https://www.dreamstime.com/cat-icon-vector-cat-icon-vector-logo-design-illustrator-image144752392";

  const addMarker = (location:GoogleLatLng): void =>{
    const marker:GoogleMarker = new google.maps.Marker({
      position: location,
      map: map as any,
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        fillColor: '#0000000',
        fillOpacity: 1,
        strokeWeight: 0,
        scale:7
      },   
    });
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle = {containerStyle}
        center = {new google.maps.LatLng(center.lat, center.lng)}
        zoom = {16}
        onLoad = {onLoad}
      >
        <Marker 
          position = {marker1}
          title = "Primul marker"
        ></Marker>
        <Marker 
          position = {marker2}
          title = "Al doilea marker"
        ></Marker>

        <></>
      </GoogleMap>
    </div>     
  ) : <></>
}

export default React.memo(MyComponent)