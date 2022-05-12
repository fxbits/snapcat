import { useUser } from '@auth0/nextjs-auth0';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'next-i18next';
import { useContext, useRef } from 'react';
import { InterestZone } from '../../../models/zone.model';
import useInterestZones from '../../hooks/useInterestZones';
import { ModalContext } from '../../Providers/ModalProvider';
import { InterestZoneProviderContext } from '../../Providers/ZoneProvider';

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
const CLUJ_NAPOCA_BOUNDS: Bounds = {
  north: parseFloat(process.env.NEXT_PUBLIC_NORTH!),
  south: parseFloat(process.env.NEXT_PUBLIC_SOUTH!),
  west: parseFloat(process.env.NEXT_PUBLIC_WEST!),
  east: parseFloat(process.env.NEXT_PUBLIC_EAST!),
};

export default function useMapActions() {
  const { t } = useTranslation('errors');
  const { user } = useUser();
  const { setInterestZone, setPartialInterestZone } = useContext(InterestZoneProviderContext);
  const { setModal } = useContext(ModalContext);
  const { interestZones } = useInterestZones();
  const mapRef = useRef<google.maps.Map>();

  const searchOnMap = (cityAddress: string): boolean | undefined => {

    const map = mapRef.current;
    if (!map) return;

    const geocoder = new google.maps.Geocoder();
    const markerSearch = new google.maps.Marker();

    const address = `${cityAddress}, ${process.env.NEXT_PUBLIC_CITY_LOCATION}`;

    geocoder.geocode({ address, bounds: CLUJ_NAPOCA_BOUNDS }, (results: any, status: any) => {
      if (status === 'OK' && results) {
        markerSearch.setPosition(results[0].geometry.location);
        map.setCenter(markerSearch.getPosition() as any);
        map.setZoom(18);
        return true;
      } else {
        showNotification({
          title: t('notFound.location'),
          message: `${t('notFound.address')}${cityAddress}.`,
          color: 'red',
        });
        return false;
      }
    });
  };
  const onLoad = (map: google.maps.Map) => {
    map.panTo(new google.maps.LatLng(46.7554537, 23.5671444));
    map.setOptions({ disableDoubleClickZoom: true });
    map.setCenter({
      lat: 46.7677528,
      lng: 23.5763875,
    });
    map.setZoom(11);
    mapRef.current = map;
  };
  const addInterestZone = (e: google.maps.MapMouseEvent) => {
    const map = mapRef.current;
    if (!map) return;

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
          volunteerName: user?.name || 'no name',
        };
        setModal({ type: 'ADD_ZONE' });
        setInterestZone(undefined);
        setPartialInterestZone(undefined);
        setPartialInterestZone(zone);
        map.panTo(new google.maps.LatLng(location.lat, location.lng));
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
  return { mapRef, searchOnMap, onLoad, addInterestZone, displayZoneMarker };
}
