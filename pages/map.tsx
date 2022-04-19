import { InterestZone } from '../models/zone.model';
import { InterestZoneProviderContext } from '../components/Providers/ZoneProvider';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { GoogleMap, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import MobileDrawer from '../components/Drawer/MobileDrawer';
import DesktopDrawer from '../components/Drawer/DesktopDrawer';
import { ModalContext } from '../components/Providers/ModalProvider';

import HeaderGoogle from '../components/HeaderGoogle/HeaderGoogle';
import SvgComponentMarker from '../components/Icons/IconMarker';
import { Box, Center, Text, ThemeIcon } from '@mantine/core';
import useSWR from 'swr';
import { SterilizedCatIcon, UnsterilizedCatIcon } from '../components/Icons/Icons';
import { useStatusColorMantine } from '../components/hooks/useStatusColor';

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

const center = {
  lat: 46.7677528,
  lng: 23.5763875,
};

const CLUJ_NAPOCA_BOUNDS: Bounds = {
  north: parseFloat(process.env.NEXT_PUBLIC_NORTH!),
  south: parseFloat(process.env.NEXT_PUBLIC_SOUTH!),
  west: parseFloat(process.env.NEXT_PUBLIC_WEST!),
  east: parseFloat(process.env.NEXT_PUBLIC_EAST!),
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
  const [map, setMap] = useState<google.maps.Map>();
  const { data: interestZones } = useSWR<InterestZone[]>('/api/interest-zones/');

  const onLoad = useCallback((map: google.maps.Map) => {
    map.panTo(new google.maps.LatLng(46.7554537, 23.5671444));
    setMap(map);
    setUsername(user?.name!);
  }, []);

  const { setInterestZone, setPartialInterestZone } = useContext(InterestZoneProviderContext);
  const { setModal } = useContext(ModalContext);
  //make zone service as hooks

  //TODO: remove useCallback usage with the exception of large component lists
  const addZone = (e: google.maps.MapMouseEvent) => {
    const geocoder = new google.maps.Geocoder();
    const location = {
      lat: e.latLng!.lat(),
      lng: e.latLng!.lng(),
    };

    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results) {
        const zone: Partial<InterestZone> = {
          address: {
            name: results[0].formatted_address,
            lat: location.lat,
            lng: location.lng,
          },
          volunteerName: username,
        };
        setModal({ type: 'ADD_ZONE' });
        setInterestZone(undefined);
        setPartialInterestZone(undefined);
        setPartialInterestZone(zone);
        map?.panTo(new google.maps.LatLng(location.lat, location.lng));
      }
    });
  };

  const displayZoneMarker = ({ lat, lng }: { lat: number; lng: number }): void => {
    setModal({ type: 'VIEW_ZONE' });
    if (!interestZones) return;
    const interestZone = interestZones.find((zone: InterestZone) => {
      return zone.address.lat === lat && zone.address.lng === lng;
    });
    setInterestZone(interestZone!);
  };

  const searchPlace = (address: string): void => {
    const geocoder = new google.maps.Geocoder();
    const markerSearch = new google.maps.Marker();

    address = `${address}, ${process.env.NEXT_PUBLIC_CITY_LOCATION}`;

    geocoder.geocode({ address, bounds: CLUJ_NAPOCA_BOUNDS }, (results: any, status: any) => {
      if (status === 'OK' && results) {
        markerSearch.setPosition(results[0].geometry.location);
        markerSearch.setMap(map as any);
        map!.setCenter(markerSearch.getPosition() as any);
        map!.setZoom(16);
      } else {
        alert('Nu exista locatia data');
      }
    });
  };

  const statusColor = useStatusColorMantine;
  if (!isLoaded) {
    return <></>;
  }

  return (
    <>
      <HeaderGoogle searchPosition={searchPlace}></HeaderGoogle>
      <MobileDrawer zones={interestZones || []} />
      <DesktopDrawer zones={interestZones || []} />

      <GoogleMap
        zoom={11}
        onLoad={onLoad}
        mapContainerStyle={{ height: 'calc(100vh - 60px)' }}
        onRightClick={addZone}>
        {interestZones?.map((zone) => {
          const position = {
            lat: zone.address.lat,
            lng: zone.address.lng,
          };

          return (
            <OverlayView
              position={position}
              key={zone._id}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
              <Center
                sx={(theme) => ({
                  width: 60 + zone.noUnsterilizedCats * 10,
                  borderRadius: '50%',
                  height: 60 + zone.noUnsterilizedCats * 10,
                  fill: theme.colors[statusColor[zone.status]][5],
                  backgroundColor: theme.colors[statusColor[zone.status]][2] + '80',
                  zIndex: 50,
                })}
                onClick={() => displayZoneMarker(position)}>
                <Box sx={{ width: '50%', height: '50%' }}>
                  <UnsterilizedCatIcon />
                </Box>
              </Center>
            </OverlayView>
          );
        })}
      </GoogleMap>
      <Text
        sx={(theme) => ({
          [theme.fn.smallerThan('md')]: {
            position: 'absolute',
            bottom: '60px',
            left: 'calc(50% - 172px / 2)',
          },
          [theme.fn.largerThan('md')]: {
            position: 'absolute',
            bottom: '0px',
            left: 'calc(50% - 172px / 2)',
          },
        })}>
        Made with &#10084; by fxbits
      </Text>
    </>
  );
}

export default withPageAuthRequired(Map);
