import { CSSObject, MediaQuery, Paper, ScrollArea } from '@mantine/core';
import { useState } from 'react';
import { InterestZone } from '../../models/zone.model';
import FilterMenu from '../FilterMenu/FilterMenu';
import InterestZoneElement from '../InterestZoneElement/InterestZoneElement';

interface Drawer {
  zones: InterestZone[];
}

const styles: CSSObject = {
  marginTop: '60px',
  position: 'fixed',
  left: 0,
  top: 0,
  height: 'calc(100vh - 50px)',
  display: 'flex',
  flexDirection: 'column',
  width: '500px',
  zIndex: 200,
};

export default function DesktopDrawer({ zones }: Drawer) {
  const [filteredZones, setFilteredZones] = useState(zones);
  return (
    <MediaQuery smallerThan='md' styles={{ display: 'none' }}>
      <Paper sx={styles}>
        <FilterMenu zones={zones} setZones={setFilteredZones} />
        <ScrollArea px='sm' py='md' sx={{ height: '100%' }}>
          {filteredZones.map((zone) => (
            <InterestZoneElement interestZone={zone} key={zone._id} />
          ))}
        </ScrollArea>
      </Paper>
    </MediaQuery>
  );
}
