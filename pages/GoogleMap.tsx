import React, { useEffect, useState } from "react";
import { GoogleMap, GoogleMapProps, Marker, useJsApiLoader } from "@react-google-maps/api";
// import AutoComplete, { usePlacesWidget } from "react-google-autocomplete";
// import usePlacesAutocomplete, {
//   getGeocode,
//   getLatLng,
// } from "use-places-autocomplete";
// import LocationSearchInput from "./LocationSearchInput";
// import { version } from "os";
// import { geocodeByAddress } from "react-places-autocomplete";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 46.7554536,
  lng: 23.5671444,
};

const marker1 = {
  lat: 46.7554536,
  lng: 23.5671444,
};

const marker2 = {
  lat: 46.7546919,
  lng: 23.5604183,
};

const marker3 = {
  lat: 46.7576919,
  lng: 23.5634183,
};

const marker4 = {
  lat: 46.7606919,
  lng: 23.5604183,
};

const marker5 = {
  lat: 46.7636919,
  lng: 23.5624183,
};

const marker6 = {
  lat: 46.7676919,
  lng: 23.5664183,
};

const marker7 = {
  lat: 46.7776919,
  lng: 23.5624183,
};

const marker8 = {
  lat: 46.7616919,
  lng: 23.5644183,
};

const marker9 = {
  lat: 46.7626919,
  lng: 23.5624183,
};


type GoogleLatLng = google.maps.LatLng;

const yellowPin =  "/icon/in-progress.png";  
const greenPin =  "/icon/done.png"; 
const redPin =  "/icon/to-do.png";



function GoogleMaps() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY as any,
    libraries:["places"] 
  });


  const [map, setMap] = useState<GoogleMap>();

  const onLoad = (map: any) =>  {
    const bounds = new window.google.maps.LatLngBounds();
    //map.fitBounds(bounds);
    map.panTo(new google.maps.LatLng( 46.7554537,23.5671444))
    setMap(map);
    console.log(center)
  };
  let autocomplete: any;

  useEffect(() => {
    if (map) {
      google.maps.event.addListener(map, "click", (e: any) => {
        const geocoder = new google.maps.Geocoder();
        const location= e.latLng as GoogleLatLng;

        geocoder.geocode({ location }, (results, status) => {
            if (status === "OK" && results) {
              const position = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());

                new google.maps.Marker({
                  position,
                  map: map as any,
                  icon: {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    fillColor: "#000000",
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 7,
                  },
                });
              }
            }
        );
      });
      // const input = document.getElementById("pac-input") as HTMLInputElement;
      // autocomplete = new google.maps.places.Autocomplete(input);
    }
  }, [map]);


  // const options = {
  //   fields: ["formatted_address", "geometry", "name"],
  //   strictBounds: false,
  //   types: ["establishment"],
  // };

  // if (autocomplete) {

  //   autocomplete.addListener("place_changed", () => {
  
  //     const place = autocomplete.getPlace();
  
  //     if (!place.geometry || !place.geometry.location) {
  //       // User entered the name of a Place that was not suggested and
  //       // pressed the Enter key, or the Place Details request failed.
  //       window.alert("No details available for input: '" + place.name + "'");
  //       return;
  //     }
  //     console.log(place.formatted_address)
  //   });
  // }

 
  return isLoaded ? (
    <div className="map-container">
       
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={new google.maps.LatLng(center.lat, center.lng)}
        zoom={17}
        onLoad={onLoad}
      >
        
        <Marker position={marker1} title="In Progress" icon={yellowPin}></Marker>
        <Marker position={marker2} title="Done" icon={greenPin}></Marker>
        <Marker position={marker3} title="To Do" icon={redPin}></Marker>

        <Marker position={marker4} title="In Progress" icon={yellowPin}></Marker>
        <Marker position={marker5} title="Done" icon={greenPin}></Marker>
        <Marker position={marker6} title="To Do" icon={redPin}></Marker>

        <Marker position={marker7} title="In Progress" icon={yellowPin}></Marker>
        <Marker position={marker8} title="Done" icon={greenPin}></Marker>
        <Marker position={marker9} title="To Do" icon={redPin}></Marker>

        <></>
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
  }

export default React.memo(GoogleMaps);


