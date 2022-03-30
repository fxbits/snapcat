import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { zoneServiceUi } from "../ui/ZoneServices"
import { InterestZone, Status } from "../models/zone.model";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 46.7554536,
  lng: 23.5671444,
};

type GoogleLatLng = google.maps.LatLng;

const yellowPin =  "/icon/in-progress.png";  
const greenPin =  "/icon/done.png"; 
const redPin =  "/icon/to-do.png";

const libraries:("places")[] = ["places"];
function GoogleMaps() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY as any,
    libraries,
  });

  const [map, setMap] = useState<GoogleMap>();
  const [interestZones, setInterestZones] = useState<InterestZone[]>([]);

  const getColorMarkerByStatus = (status:Status): string => {
    let selectedPin = '';
    switch (status) {
      case Status.TODO:
        selectedPin = redPin;
        break;
      case Status.INPROGRESS: 
        selectedPin = yellowPin;
        break;
      case Status.DONE:
        selectedPin = greenPin;
        break;
      default: break;
    }
    return selectedPin;
  }

  const onLoad = (map: any) =>  {
    map.panTo(new google.maps.LatLng( 46.7554537,23.5671444))
    setMap(map);
  };

  const loadAllPoints = async () => {   
    return (await zoneServiceUi.findAll())
   }
 
  useEffect(()=>{
    loadAllPoints().then((zones)=>{
      setInterestZones(zones);
    })   
  },[map])

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
                });
              }
            }
        );
      });
    }    
  }, [map]);

  return isLoaded ? (
    <div className="map-container">
       
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={new google.maps.LatLng(center.lat, center.lng)}
        zoom={12}
        onLoad={onLoad}
      >        
        {
          interestZones.map(zone => {
            const markerBD ={
              lat: zone.address.lat,
              lng: zone.address.lng,
            };
            return <Marker position={markerBD} title={zone.status} key={zone.id} icon={getColorMarkerByStatus(zone.status)}></Marker>
          })
        }   
        <></>
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
  }

export default withPageAuthRequired(GoogleMaps);


