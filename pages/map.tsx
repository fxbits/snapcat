import { zoneServiceUi } from '../ui/ZoneServices';
import { InterestZone } from '../models/zone.model';
import { InterestZoneProviderContext } from '../components/Providers/ProviderZone';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import MobileDrawer from '../components/Drawer/MobileDrawer';
import DesktopDrawer from '../components/Drawer/DesktopDrawer';
import { ModalContext } from '../components/Providers/ModalProvider';

import HeaderGoogle from '../components/HeaderGoogle/HeaderGoogle';
import SvgComponentMarker from "../components/Icons/IconMarker";
import { Text } from '@mantine/core';
import theme from '../styles/theme';

interface Bounds{
  north: number,
  south: number,
  east: number,
  west: number
}

const center = {
  lat: 46.7677528,
  lng: 23.5763875,
};

const CLUJ_NAPOCA_BOUNDS: Bounds= {
  north: parseFloat(process.env.NEXT_PUBLIC_NORTH!),
  south: parseFloat(process.env.NEXT_PUBLIC_SOUTH!),
  west: parseFloat(process.env.NEXT_PUBLIC_WEST!),
  east: parseFloat(process.env.NEXT_PUBLIC_EAST!),
};

const libraries:("places")[] = ["places"];
function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY as any,
    libraries,
    
  });

  const { user, error, isLoading } = useUser();
  const [username, setUsername] = useState<string>('');
  const [map, setMap] = useState<google.maps.Map>();
  const [interestZones, setInterestZones] = useState<InterestZone[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const onLoad = useCallback((map: google.maps.Map) =>  {
    map.panTo(new google.maps.LatLng(46.7554537, 23.5671444));
    setMap(map);
    setUsername(user?.name!);    
  }, []);

  const { setInterestZone, setPartialInterestZone } = useContext(InterestZoneProviderContext);
  const { setModal } = useContext(ModalContext);

  //make zone service as hooks
  useEffect(() => {
    zoneServiceUi.findAll().then((zones) => {
      setInterestZones(zones);
    });
  }, [map]);

  const addZone = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const geocoder = new google.maps.Geocoder();
      const location = {
        lat: e.latLng!.lat(),
        lng: e.latLng!.lng(),
      };

      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results) {
          new google.maps.Marker({
            position: new google.maps.LatLng(location),
            map: map as google.maps.Map,
          });

          const zone = {
            address: {
              name: results[0].formatted_address,
              lat: location.lat,
              lng: location.lng,
            },
            volunteerName: username,
          };

          setModal({ type: 'zone', state: 'add' });
          setPartialInterestZone(zone);
        }
      });
    },
    [map, setModal, setPartialInterestZone, username]
  );
 
  const displayZoneMarker = useCallback(( { lat, lng } ): void => {
      setModal({ type: 'zone', state: 'view' });

  const interestZone = interestZones.find((zone: InterestZone) => {
      return zone.address.lat === lat && zone.address.lng === lng;
      });
      setInterestZone(interestZone!);
    },[interestZones, setInterestZone, setModal]);

  const closeAddModal = useCallback(() => {
    setAddModalVisible(false);
  }, [addModalVisible]);

 
  const searchPlace = (address: string): void =>{
    const geocoder = new google.maps.Geocoder();
    const markerSearch = new google.maps.Marker;
  
    address = `${address}, ${process.env.NEXT_PUBLIC_CITY_LOCATION}`;
    
    geocoder.geocode({ address, bounds: CLUJ_NAPOCA_BOUNDS }, (results:any, status:any) => {
      if (status === "OK" && results) {
   
        markerSearch.setPosition(results[0].geometry.location);
        markerSearch.setMap(map as any);
        map!.setCenter(markerSearch.getPosition() as any);
        map!.setZoom(16);
      }
      else{
        alert("Nu exista locatia data");   
      } 
    });  
  }

  if (!isLoaded) {
    return <></>;
  }

  return (
    <>
      <HeaderGoogle searchPosition={searchPlace} ></HeaderGoogle>
      <MobileDrawer zones={interestZones} />
      <DesktopDrawer zones={interestZones} />
      
      <GoogleMap
        center={new google.maps.LatLng(center.lat, center.lng)}
        zoom={11}
        onLoad={onLoad}
        mapContainerStyle={{ width: '100%', height: 'calc(100vh - 60px)' }}
        onRightClick={addZone}
      >
          {
            interestZones.map((zone) => {
              const position = {
                lat: zone.address.lat,
                lng: zone.address.lng,
              };

            return(
              <OverlayView
                position={position}
                key={zone._id}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                  <SvgComponentMarker status={zone.status} location={position} displayZone={displayZoneMarker}></SvgComponentMarker>
              </OverlayView>
            );
          })}
      </GoogleMap>
        <Text
          sx={(theme) => ({
              [theme.fn.smallerThan("md")]: { position:"absolute", bottom:"60px", left:"calc(50% - 172px / 2)"},
              [theme.fn.largerThan("md")]: { position:"absolute", bottom:"0px", left:"calc(50% - 172px / 2)"},
              })}
      >Made with &#10084; by fxbits</Text>
     
      
    </>
  );
}


export default withPageAuthRequired(Map);
