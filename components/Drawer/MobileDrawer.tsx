import { useState } from 'react';
import { Box, Stack, Text, ActionIcon, Portal, Paper, MediaQuery, ScrollArea } from '@mantine/core';
import { SwipeEventData, useSwipeable } from 'react-swipeable';
import { Compass, Map } from 'tabler-icons-react';
import { InterestZone } from '../../models/zone.model';
import InterestZoneElement from '../InterestZoneElement/InterestZoneElement';
import FilterMenu from '../FilterMenu/FilterMenu';
import { useTranslation } from 'next-i18next';

interface Drawer {
  zones: InterestZone[];
}
export default function MobileDrawer({ zones }: Drawer) {
  const [index, setIndex] = useState(0);
  const drawerStates = ['60px', '60%', 'calc(100% - 60px)'];
  const { t } = useTranslation('common');

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
  const [filteredZones, setFilteredZones] = useState(zones);

  return (
    <MediaQuery largerThan='md' styles={{ display: 'none' }}>
      <Portal>
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
            sx={{ width: '100%', gap: 0, height: index === 2 ? '0px' : '60px' }}
            {...handler}
            align='center'
            justify='center'>
            <Box
              sx={(theme) => ({
                width: '90px',
                height: '5px',
                backgroundColor: theme.colors.yellow[6],
                borderRadius: theme.radius.xl,
              })}
            />
            {index === 0 && (
              <Text size='lg' color='gray'>
                {zones.length} {t('components.drawer.mobileDrawer.zones')}
              </Text>
            )}
          </Stack>
          <FilterMenu zones={zones} setZones={setFilteredZones} />
          <ScrollArea pb='md' sx={{ height: 'calc(100% - 60px)' }}>
            {filteredZones.map((zone) => (
              <InterestZoneElement interestZone={zone} key={zone._id} />
            ))}
          </ScrollArea>
          {index >= 1 && (
            <ActionIcon
              variant='filled'
              size='xl'
              m='xl'
              radius='xl'
              p='xs'
              color='yellow'
              sx={{ position: 'absolute', bottom: 0, right: 0 }}
              onClick={() => setIndex(0)}>
              <Map size={200} />
            </ActionIcon>
          )}
        </Paper>
      </Portal>
    </MediaQuery>
  );
}
