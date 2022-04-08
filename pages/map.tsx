import { zoneServiceUi } from '../ui/ZoneServices';
import { InterestZone } from '../models/zone.model';
import InteresZoneView from '../components/InterestZoneView/InterestZoneView';
import InterestZoneAdd from '../components/InterestZoneAdd/InterestZoneAdd';
import { getColorMarkerByStatus } from '../utils/iconcolors.utils';
import { mapContainer } from '../styles/map.module';
import InterestZonesOverview from '../components/InterestZonesOverview/InterestZonesOverview';
import { InterestZoneProviderContext } from '../components/Providers/ProviderZone';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { positions } from '@mui/system';
import { useUser } from '@auth0/nextjs-auth0';
import Drawer from '../components/Drawer/MobileDrawer';
import MobileDrawer from '../components/Drawer/MobileDrawer';
import DesktopDrawer from '../components/Drawer/DesktopDrawer';
import { ModalContext } from '../components/Providers/ModalProvider';

const center = {
  lat: 46.7677528,
  lng: 23.5763875,
};

const libraries: 'places'[] = ['places'];
function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY as any,
    libraries,
  });

  const { user, error, isLoading } = useUser();
  const [username, setUsername] = useState<string>('');
  const [map, setMap] = useState<GoogleMap>();
  const [interestZones, setInterestZones] = useState<InterestZone[]>([]);

  const onLoad = useCallback((map: any) => {
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
            map: map as any,
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

  const displayZoneMarker = useCallback(
    (e: google.maps.MapMouseEvent): void => {
      const lat = e.latLng!.lat();
      const lng = e.latLng!.lng();
      setModal({ type: 'zone', state: 'view' });

      const interestZone = interestZones.find((zone: InterestZone) => {
        return zone.address.lat === lat && zone.address.lng === lng;
      });
      setInterestZone(interestZone!);
    },
    [interestZones, setInterestZone, setModal]
  );

  if (!isLoaded) {
    return <></>;
  }

  return (
    <>
      <MobileDrawer zones={interestZones} />
      <DesktopDrawer zones={interestZones} />
      <GoogleMap
        center={new google.maps.LatLng(center.lat, center.lng)}
        zoom={11}
        onLoad={onLoad}
        mapContainerStyle={{ width: '100%', height: 'calc(100vh - 60px)' }}
        onRightClick={addZone}>
        {interestZones.map((zone) => {
          const position = {
            lat: zone.address.lat,
            lng: zone.address.lng,
          };
          return (
            <Marker
              position={position}
              title={zone.status}
              key={zone._id}
              icon={getColorMarkerByStatus(zone.status)}
              onClick={displayZoneMarker}></Marker>
          );
        })}
      </GoogleMap>
      {/* <InterestZonesOverview interestZones={interestZones} /> */}
    </>
  );
}

export default withPageAuthRequired(Map);
