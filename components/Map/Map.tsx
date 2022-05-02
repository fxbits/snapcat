import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, LoadScript, OverlayView } from '@react-google-maps/api';

import { Text } from '@mantine/core';
import CatMarker from '../Marker/Marker';
import { useLongPress } from 'react-use';
import useCluster from '../hooks/useCluster';
import useMapActions from './hooks/useMapActions';
import MarkerGroup from '../MarkerGroup/MarkerGroup';

function Map({ searchAdress }: { searchAdress: string | undefined }) {
  const ref = useRef(false);

  const { addInterestZone, mapRef, displayZoneMarker, onLoad, searchOnMap } = useMapActions();
  const { clusters, supercluster, setZoom, setBounds } = useCluster();

  useEffect(() => {
    if (searchAdress) searchOnMap(searchAdress);
  }, [searchAdress]);

  const onLongPress = (e: MouseEvent | TouchEvent) => {
    if (ref.current === true) return;
    addInterestZone(e as any as google.maps.MapMouseEvent);
  };

  const onlongPress = useLongPress(onLongPress, { isPreventDefault: true, delay: 300 });

  const onZoomChanged = () => {
    const map = mapRef.current;
    if (map) {
      setZoom(map.getZoom() || 11);
      setBounds(map.getBounds() || undefined);
    }
  };

  const onBoundsChanged = () => {
    const map = mapRef.current;
    if (map) {
      setBounds(map.getBounds() || undefined);
    }
  };
  const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -(height / 2),
  });
  const map = useMemo(() => {
    return (
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          {...onlongPress}
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
          onDblClick={addInterestZone}>
          {clusters?.map((cluster: any) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { properties } = cluster;
            const position = {
              lat: latitude,
              lng: longitude,
            };

            if ('cluster' in properties) {
              const { point_count: pointCount, cluster_id } = properties;
              if (properties.cluster)
                return (
                  <OverlayView
                    key={`cluster-${cluster.id}`}
                    position={{ lat: latitude, lng: longitude }}
                    getPixelPositionOffset={getPixelPositionOffset}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                    <MarkerGroup
                      points={pointCount}
                      onClick={() => {
                        const zoom = supercluster?.getClusterExpansionZoom(cluster_id);
                        mapRef.current?.setZoom(zoom || 11);
                        mapRef.current?.panTo(position);
                        setZoom(zoom || 11);
                      }}
                    />
                  </OverlayView>
                );
            } else
              return (
                <OverlayView
                  position={position}
                  key={properties.zone._id}
                  getPixelPositionOffset={getPixelPositionOffset}
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
    );
  }, [clusters, onLoad]);

  return (
    <>
      {map}
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
