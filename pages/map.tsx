import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { zoneServiceUi } from "../ui/ZoneServices"
import { InterestZone } from "../models/zone.model";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getColorMarkerByStatus } from "../utils/iconcolors.utils";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 46.7554536,
  lng: 23.5671444,
};

type GoogleLatLng = google.maps.LatLng;

const libraries:("places")[] = ["places"];
function Map() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY as any,
    libraries,
  });

  const [map, setMap] = useState<GoogleMap>();
  const [interestZones, setInterestZones] = useState<InterestZone[]>([]);

  const onLoad = useCallback((map: any) =>  {
    map.panTo(new google.maps.LatLng( 46.7554537,23.5671444))
    setMap(map);
  },[]);
 
  useEffect(()=>{
    zoneServiceUi.findAll().then((zones)=>{
      setInterestZones(zones);
    })   
  },[map])

  const addZone = useCallback((e:google.maps.MapMouseEvent) =>{
    const geocoder = new google.maps.Geocoder();
    const location= e.latLng as GoogleLatLng;

    geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results) {
          // to do open modal
        }  
    });
  },[])

  if (!isLoaded) {
    return <></>;
  }
  
  return  (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={new google.maps.LatLng(center.lat, center.lng)}
        zoom={12}
        onLoad={onLoad}
        onRightClick={addZone}
      >        
        {
          interestZones.map(zone => {
            const position ={
              lat: zone.address.lat,
              lng: zone.address.lng,
            };
            return <Marker position={position} title={zone.status} key={zone._id} icon={getColorMarkerByStatus(zone.status)} ></Marker>
          })
        }   
        <></>
      </GoogleMap>
    </div>
  )
  }

export default withPageAuthRequired(Map);


