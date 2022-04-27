import { InterestZone } from '../models/zone.model';
import { InterestZoneProviderContext } from '../components/Providers/ZoneProvider';

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0';
import MobileDrawer from '../components/Drawer/MobileDrawer';
import DesktopDrawer from '../components/Drawer/DesktopDrawer';
import { ModalContext } from '../components/Providers/ModalProvider';

import HeaderGoogle from '../components/HeaderGoogle/HeaderGoogle';
import { Text } from '@mantine/core';
import useSWR from 'swr';
import CatMarker from '../components/Marker/Marker';
import { useLongPress } from 'react-use';
import useCluster from '../components/hooks/useCluster';

type i = typeof useLongPress;

interface useLongPressGoogle extends i {}

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
  const { user } = useUser();
  const [username, setUsername] = useState<string>('');
  const mapRef = React.useRef<google.maps.Map | undefined>();
  const { data: interestZones } = useSWR<InterestZone[]>('/api/interest-zones/');

  const onLoad = useCallback((map: google.maps.Map) => {
    map.panTo(new google.maps.LatLng(46.7554537, 23.5671444));
    map.setOptions({ disableDoubleClickZoom: true });
    map.setCenter(center);
    map.setZoom(11);
    mapRef.current = map;
    setUsername(user?.name!);
  }, []);

  const { setInterestZone, setPartialInterestZone } = useContext(InterestZoneProviderContext);
  const { setModal } = useContext(ModalContext);

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
        mapRef.current?.panTo(new google.maps.LatLng(location.lat, location.lng));
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
        mapRef.current!.setCenter(markerSearch.getPosition() as any);
        mapRef.current!.setZoom(18);
      } else {
        alert('Nu exista locatia data');
      }
    });
  };

  const onLongPress = (e: MouseEvent | TouchEvent) => {
    if (ref.current === true) return;
    addZone(e as any as google.maps.MapMouseEvent);
  };

  const longPressEvent = useLongPress(onLongPress, { isPreventDefault: true, delay: 300 });
  const ref = useRef(false);

  const { clusters, setZoom, setBounds } = useCluster();

  const onZoomChanged = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      setZoom(map.getZoom() || 11);
      setBounds(map.getBounds() || undefined);
    }
  }, []);

  const onBoundsChanged = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      setBounds(map.getBounds() || undefined);
    }
  }, []);

  return (
    <>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          {...longPressEvent}
          zoom={11}
          onLoad={onLoad}
          onZoomChanged={onZoomChanged}
          onBoundsChanged={onBoundsChanged}
          mapContainerStyle={{ height: 'calc(100vh - 60px)' }}
          onDragStart={() => {
            ref.current = true;
          }}
          onDragEnd={() => {
            ref.current = false;
          }}
          onDblClick={addZone}>
          {clusters?.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { properties } = cluster;

            const position = {
              lat: latitude,
              lng: longitude,
            };

            if ('cluster' in properties) {
              const { point_count: pointCount } = properties;
              if (properties.cluster)
                return (
                  <Marker
                    key={`cluster-${cluster.id}`}
                    position={{ lat: latitude, lng: longitude }}
                    label={{ text: `${pointCount}` }}
                  />
                );
            }
            return (
              <OverlayView
                position={position}
                key={properties.zone._id}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                <CatMarker
                  zone={properties.zone}
                  displayZoneMarker={() => displayZoneMarker(position)}
                />
              </OverlayView>
            );
          })}
        </GoogleMap>
      </LoadScript>
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
export default Map;
