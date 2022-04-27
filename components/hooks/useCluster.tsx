import useSWR from 'swr';
import { InterestZone } from '../../models/zone.model';
import useSupercluster from 'use-supercluster';
import { useEffect, useMemo, useState } from 'react';

export default function useCluster() {
  const { data, error } = useSWR<InterestZone[]>('/api/interest-zones/');
  const zones = data && !error ? data : [];
  const [zoom, setZoom] = useState(11);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | undefined>();

  const points = useMemo(
    () =>
      zones.map((zone) => ({
        type: 'Feature',
        properties: { cluster: false, zone: zone },
        geometry: {
          type: 'Point',
          coordinates: [zone.address.lng, zone.address.lat],
        },
      })),
    [data]
  );

  const superclusterBounds: [number, number, number, number] = bounds
    ? [
        bounds.getSouthWest().lng(),
        bounds.getSouthWest().lat(),
        bounds.getNorthEast().lng(),
        bounds.getNorthEast().lat(),
      ]
    : [0, 0, 0, 0];

  const { clusters, supercluster } = useSupercluster({
    points,
    zoom,
    bounds: superclusterBounds,
    options: { maxZoom: 18 },
  });
  console.log(clusters);
  return { clusters, setZoom, setBounds };
}
