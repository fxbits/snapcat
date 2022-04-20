import { CSSObject, MediaQuery, Paper, ScrollArea } from '@mantine/core';
import { InterestZone } from '../../models/zone.model';
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
  width: '500px',
  zIndex: '200',
};

export default function DesktopDrawer({ zones }: Drawer) {
  return (
    <MediaQuery smallerThan='md' styles={{ display: 'none' }}>
      <Paper sx={styles}>
        <ScrollArea px='sm' py='md' sx={{ height: 'calc(100% - 10px)' }}>
          {zones.map((zone) => (
            <InterestZoneElement interestZone={zone} key={zone._id} />
          ))}
        </ScrollArea>
      </Paper>
    </MediaQuery>
  );
}
