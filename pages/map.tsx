import { zoneServiceUi } from "../ui/ZoneServices"
import { InterestZone } from "../models/zone.model";
import InteresZoneView from '../components/InterestZoneView/InterestZoneView';
import InterestZoneAdd from "../components/InterestZoneAdd/InterestZoneAdd";
import { getColorMarkerByStatus } from "../utils/iconcolors.utils";
import {mapContainer} from '../styles/map.module';

import React, { useCallback, useContext, useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { positions } from "@mui/system";
import { useUser } from '@auth0/nextjs-auth0';
import InterestZonesOverview from '../components/InterestZonesOverview/InterestZonesOverview';
import { MenuUnstyledContext } from '@mui/base';
import { InterestZoneProviderContext } from '../components/Providers/ProviderZone';

const center = {
  lat: 46.7677528,
  lng: 23.5763875,
};

const libraries:("places")[] = ["places"];
function Map() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY as any,
    libraries,
  });

  const { user, error, isLoading } = useUser();
  const [username, setUsername] = useState<string>("");
  const [map, setMap] = useState<GoogleMap>();
  const [interestZones, setInterestZones] = useState<InterestZone[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [partialZone, setPartialZone] = useState<Partial<InterestZone>>({});

  const onLoad = useCallback((map: any) =>  {
    map.panTo(new google.maps.LatLng( 46.7554537,23.5671444))
    setMap(map);
    setUsername(user?.name!);
  },[]);
  
  const { interestZone, setInterestZone } = useContext(InterestZoneProviderContext)

  useEffect(()=>{
    zoneServiceUi.findAll().then((zones)=>{
      setInterestZones(zones);
    })   
  },[map])

  useEffect(()=>{
    if (interestZone)
      setEditModalVisible(true);
  },[interestZone])

  const addZone = useCallback((e:google.maps.MapMouseEvent) =>{
      const geocoder = new google.maps.Geocoder();
      const location = {
        lat: e.latLng!.lat(),
        lng: e.latLng!.lng(),
      };
    
      geocoder.geocode({ location }, (results, status) => {
          if (status === "OK" && results) {
            new google.maps.Marker({
              position: new google.maps.LatLng(location),
              map: map as any,
            });
            
            setPartialZone({
              address: {
                name: results[0].formatted_address,
                lat: location.lat,
                lng: location.lng
              },
              volunteerName: username
            });
          }  
      });
      setAddModalVisible(true);
  }, [map]);

  const closeEditModal = useCallback(() => {
      setEditModalVisible(false);
      setInterestZone('disabled');
  }, [editModalVisible]);

  const openEditModal = useCallback(() => {
      setEditModalVisible(true);
  }, [editModalVisible]);

  const displayZoneMarker = useCallback((e: google.maps.MapMouseEvent): void => {
      const lat = e.latLng!.lat();
      const lng = e.latLng!.lng();

      const interestZone = interestZones.find((zone: InterestZone) => {
        return zone.address.lat === lat && zone.address.lng === lng;
      });;
      setInterestZone(interestZone!);
  }, [interestZones]);

  const displayAddModal = useCallback(() => {
      setAddModalVisible(true);
  }, [addModalVisible]);

  const closeAddModal = useCallback(() => {
      setAddModalVisible(false);
  }, [addModalVisible]);

  if (!isLoaded) {
      return <></>;
  }
  
  return  (
      <div className="map-container">
          {interestZone !== 'disabled'  && <InteresZoneView onClose={closeEditModal} isVisible={editModalVisible} zone={interestZone}/>}
          <InterestZoneAdd onClose={closeAddModal} isVisible={addModalVisible} zone={partialZone}/>
          <GoogleMap
            mapContainerStyle={mapContainer}
            center={new google.maps.LatLng(center.lat, center.lng)}
            zoom={11}
            onLoad={onLoad}
            onRightClick={addZone}
          >        
            {
              interestZones.map(zone => {
                const position ={
                  lat: zone.address.lat,
                  lng: zone.address.lng,
                };
                return <Marker position={position} title={zone.status} key={zone._id} icon={getColorMarkerByStatus(zone.status)} onClick={displayZoneMarker}></Marker>
              })
            }   
          </GoogleMap>
          <InterestZonesOverview interestZones={interestZones}/>
      </div>
  );
}

export default withPageAuthRequired(Map);
