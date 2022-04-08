import { MediaQuery, Paper, Stack } from '@mantine/core';
import { InterestZone } from '../../models/zone.model';
import InterestZoneElement from '../InterestZonesOverview/InterestZoneElement';

interface Drawer {
  zones: InterestZone[];
}
export default function DesktopDrawer({ zones }: Drawer) {
  return (
    <MediaQuery smallerThan='md' styles={{ display: 'none' }}>
      <Paper
        sx={{
          marginTop: '50px',
          position: 'fixed',
          left: 0,
          top: 0,
          height: 'calc(100vh - 50px)',
          width: '400px',
          zIndex: '200',
        }}>
        <Stack mt='xs' spacing={0} sx={{ overflowY: 'scroll', height: '100%' }}>
          {zones.map((zone) => (
            <InterestZoneElement interestZone={zone} key={zone._id} />
          ))}
        </Stack>
      </Paper>
    </MediaQuery>
  );
}
