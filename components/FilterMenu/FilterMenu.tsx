import { Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { InterestZone, Status } from '../../models/zone.model';

export default function FilterMenu({
  zones,
  setZones,
}: {
  zones: InterestZone[];
  setZones: (zones: InterestZone[]) => void;
}) {
  const [status, setStatus] = useState<Status | 'All'>(Status.DONE);
  useEffect(() => {
    if (status === 'All') return setZones(zones);
    const newZones = zones.filter((a) => a.status === status);
    setZones(newZones);
  }, [status, zones, setZones]);

  const data: Array<Status | 'All'> = [Status.TODO, Status.INPROGRESS, Status.DONE, 'All'];
  return (
    <Select
      withinPortal={false}
      m='sm'
      value={status}
      onChange={(e) => setStatus(e as Status)}
      data={data}
      label='Status'
    />
  );
}
