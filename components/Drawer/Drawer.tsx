import { useState } from 'react';
import { Drawer as MantineDrawer, Box, Stack, Text, ActionIcon } from '@mantine/core';
import { SwipeEventData, useSwipeable } from 'react-swipeable';
import { Compass } from 'tabler-icons-react';

export default function Drawer() {
  const [index, setIndex] = useState(0);
  const drawerStates = ['70px', '60%', '90%'];
  const handleChange = (e: SwipeEventData) => {
    if (e.dir === 'Up') {
      if (index === 0) setIndex(index + 1);
      else if (index !== 2) setIndex(index + 1);
    }
  };
  const handler = useSwipeable({
    onSwipeStart: (e) => handleChange(e),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const height = {
    in: {},
    out: {},
    common: { transformOrigin: 'top' },
    transitionProperty: 'height',
  };

  return (
    <>
      <MantineDrawer
        position='bottom'
        withOverlay={false}
        withCloseButton={false}
        size={drawerStates[index]}
        transition={height}
        opened={true}
        onClose={() => {}}
        styles={{ drawer: { borderRadius: '15px' } }}>
        <Stack sx={{ width: '100%' }} {...handler} align='center' spacing='xs'>
          <Box
            sx={(theme) => ({
              width: '90px',
              height: '5px',
              backgroundColor: theme.primaryColor,
              borderRadius: theme.radius.xl,
            })}
            mt='lg'
          />
          <Text size='xl' color='gray'>
            30 zones
          </Text>
        </Stack>

        {index === 2 && (
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
      </MantineDrawer>
    </>
  );
}
