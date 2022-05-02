import { Select, SelectItem } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { InterestZone, Status } from '../../models/zone.model';
import { useTranslation } from 'next-i18next';

export default function FilterMenu({
  zones,
  setZones,
}: {
  zones: InterestZone[];
  setZones: (zones: InterestZone[]) => void;
}) {
  const { t } = useTranslation('common');
  const [status, setStatus] = useState<Status | 'All'>(Status.DONE);
  useEffect(() => {
    if (status === 'All') return setZones(zones);
    const newZones = zones.filter((a) => a.status === status);
    setZones(newZones);
  }, [status, zones, setZones]);

  const data: Array<SelectItem> = [
      {value: Status.TODO, label: t('To Do')},
      {value: Status.INPROGRESS, label: t('In Progress')},
      {value: Status.DONE, label: t('Done')},
      {value: 'All', label: t('components.filterMenu.all')}
    ];
  
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
