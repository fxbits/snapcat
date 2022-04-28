import useSWR from 'swr';
import { InterestZone } from '../../models/zone.model';
import useSupercluster from 'use-supercluster';
import { useMemo, useState } from 'react';
import { PointFeature } from 'supercluster';

export default function useCluster() {
  const { data, error } = useSWR<InterestZone[]>('/api/interest-zones/');
  const zones = useMemo(() => (data && !error ? data : []), [data, error]);
  const [zoom, setZoom] = useState(11);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | undefined>();

  const points: PointFeature<{ zone: InterestZone } & GeoJSON.GeoJsonProperties>[] = useMemo(
    () =>
      zones.map((zone) => ({
        type: 'Feature' as GeoJSON.Feature['type'],
        properties: { zone: zone },
        geometry: {
          type: 'Point',
          coordinates: [zone.address.lng, zone.address.lat],
        },
      })),
    [zones]
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
    options: { maxZoom: 18, radius: 75 },
  });
  return { clusters, supercluster, setZoom, setBounds };
}
