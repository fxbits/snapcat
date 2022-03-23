import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "1550px",
  height: "500px",
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

type GoogleLatLng = google.maps.LatLng;
type GoogleMarker = google.maps.Marker;

function GoogleMaps() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY as any,
  });

  const [map, setMap] = useState<GoogleMap>();

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

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
                    fillColor: "#0000000",
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 7,
                  },
                });
              }
            }
        );
      });
    }
  }, [map]);

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={new google.maps.LatLng(center.lat, center.lng)}
        zoom={16}
        onLoad={onLoad}
      >
        <Marker position={marker1} title="Primul marker"></Marker>
        <Marker position={marker2} title="Al doilea marker"></Marker>

        <></>
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(GoogleMaps);
