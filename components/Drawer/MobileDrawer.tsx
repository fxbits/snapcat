import { useState } from 'react';
import { Box, Stack, Text, ActionIcon, Portal, Paper, MediaQuery } from '@mantine/core';
import { SwipeEventData, useSwipeable } from 'react-swipeable';
import { Compass } from 'tabler-icons-react';
import { InterestZone } from '../../models/zone.model';
import InterestZoneElement from '../InterestZonesOverview/InterestZoneElement';

interface Drawer {
  zones: InterestZone[];
}
export default function MobileDrawer({ zones }: Drawer) {
  const [index, setIndex] = useState(0);
  const drawerStates = ['60px', '60%', '100%'];

  const handleChange = (e: SwipeEventData) => {
    switch (e.dir) {
      case 'Up':
        index === 2 ? setIndex(0) : setIndex(index + 1);
        break;
      case 'Down': {
        index === 1 && setIndex(0);
        break;
      }
    }
  };
  const handler = useSwipeable({
    onSwipeStart: (e) => handleChange(e),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <MediaQuery largerThan='md' styles={{ display: 'none' }}>
      <Portal zIndex={100}>
        <Paper
          sx={(theme) => ({
            width: '100%',
            position: 'fixed',
            bottom: 0,
            borderRadius: theme.spacing.sm,
            height: drawerStates[index],
            transition: 'height 0.2s ',
            transitionTimingFunction: 'ease',
          })}>
          <Stack
            sx={{ width: '100%', gap: 0, height: '60px' }}
            {...handler}
            align='center'
            justify='center'>
            <Box
              sx={(theme) => ({
                width: '90px',
                height: '5px',
                backgroundColor: theme.primaryColor,
                borderRadius: theme.radius.xl,
              })}
            />
            {index === 0 && (
              <Text size='lg' color='gray'>
                {zones.length} zones
              </Text>
            )}
          </Stack>
          <Stack spacing={0} sx={{ overflowY: 'scroll', height: '100%' }}>
            {zones.map((zone) => (
              <InterestZoneElement interestZone={zone} key={zone._id} />
            ))}
          </Stack>
          {index >= 1 && (
            <ActionIcon
              variant='light'
              size='xl'
              m='xl'
              color='orange'
              sx={{ position: 'absolute', bottom: 0, right: 0 }}
              onClick={() => setIndex(0)}>
              <Compass size={100} />
            </ActionIcon>
          )}
        </Paper>
      </Portal>
    </MediaQuery>
  );
}
