import { InterestZone, Status } from '../../models/zone.model';
import { InterestZoneProviderContext } from '../Providers/ZoneProvider';

import { Box, Button, Container, createStyles, Group, Stack, Sx, Text } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { ModalContext } from '../Providers/ModalProvider';

interface Props {
  interestZone: InterestZone;
}

const useStyles = createStyles((theme) => ({
  container: {
    outline: '2px solid #DBDBDB',
    borderRadius: '7px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.gray[2],
      outline: '5px solid  #DBDBDB',
    },
    transition: 'all 0.1s ease-in-out',
  },
  button: {
    width: '130px',
    fontSize: '13px',
    borderRadius: '10px',
    border: '2px solid black',
  },
}));

const InterestZoneElement = ({ interestZone }: Props) => {
  const { setInterestZone } = useContext(InterestZoneProviderContext);
  const { setModal } = useContext(ModalContext);
  const { classes } = useStyles();
  const { address, noUnsterilizedCats, status, sterilizedCats, unsterilizedCats, volunteerName } =
    interestZone;

  const statusColor: Record<Status, string> = {
    [Status.DONE]: '#B0EF8F',
    [Status.INPROGRESS]: '#FFDB3C',
    [Status.TODO]: '#EF8F8F',
  };

  return (
    <Container
      m='md'
      p='xs'
      className={classes.container}
      onClick={() => {
        setInterestZone(interestZone);
        setModal({ type: 'VIEW_ZONE' });
      }}>
      <Group position='apart' align='flex-start'>
        <Box sx={{ width: '55%' }}>
          <Group sx={{ width: '100%' }}>
            <Image src='/icon/location-icon.png' width={16} height={23} alt='location-icon'></Image>
            <Stack spacing={0} sx={{ width: '80%' }}>
              <Text weight={400} sx={{ maxWidth: '100%' }}>
                {address.name}
              </Text>
              <Text color='gray' size='xs'>
                {address.lat} {address.lng}
              </Text>
            </Stack>
          </Group>
          <Group mt='xs'>
            <Group spacing='xs'>
              <Image
                src='/icon/sterilized-cat-icon.png'
                width={25}
                height={25}
                alt='cat-icon'></Image>
              <Text weight={400}>{sterilizedCats.length}</Text>
            </Group>
            <Group spacing='xs'>
              <Image
                src='/icon/unsterilized-icon.png'
                width={25}
                height={25}
                alt='cat-icon'></Image>
              <Text weight={400}>{unsterilizedCats.length}</Text>
            </Group>
          </Group>
          {volunteerName && (
            <Text mt='md' color='gray'>
              {' '}
              Volunteer{' '}
            </Text>
          )}
          {volunteerName && <Text> {volunteerName} </Text>}
          {!volunteerName && (
            <Button mt='md' color='dark' variant='outline' className={classes.button}>
              {' '}
              ASSIGN TO ME{' '}
            </Button>
          )}
        </Box>
        <Stack spacing={0} sx={{ width: '35%', textAlign: 'center' }}>
          <Text
            weight={500}
            mb='xs'
            sx={{ background: statusColor[status], textAlign: 'center', borderRadius: '7px' }}>
            {status}
          </Text>
          <Box>
            <Image
              src='/icon/unsterilized-cat-icon-big.png'
              width='73px'
              height='70px'
              alt='cat-icon'></Image>
          </Box>
          <Text color='gray'>around {noUnsterilizedCats ?? 0} cats</Text>
        </Stack>
      </Group>
    </Container>
  );
};

export default InterestZoneElement;
