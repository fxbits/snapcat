import { InterestZone, Status } from '../../models/zone.model';
import { InterestZoneProviderContext } from '../Providers/ProviderZone';

import { Box, Button, Container, Group, Stack, Sx, Text } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';

interface Props {
  interestZone: InterestZone;
}

const styles: Record<string, Sx> = {
  container: {
    border: '2px solid #DBDBDB',
    borderRadius: '7px',
  },
  button: {
    width: '130px',
    fontSize: '13px',
    borderRadius: '10px',
    border: '2px solid black',
  },
};

const InterestZoneElement = ({ interestZone }: Props) => {
  const { setInterestZone } = useContext(InterestZoneProviderContext);
  const {
    _id,
    address,
    noUnsterilizedCats,
    observations,
    status,
    sterilizedCats,
    unsterilizedCats,
    volunteerName,
    contactPerson,
  } = interestZone;
  const [statusColor, setStatusColor] = useState<string>('#EF8F8F');

  useEffect(() => {
    if (status === Status.DONE) setStatusColor('#B0EF8F');
    else if (status === Status.INPROGRESS) setStatusColor('#FFDB3C');
    else setStatusColor('#EF8F8F');
  }, [status]);

  return (
    <Container
      mx='xs'
      mb='xs'
      p='xs'
      sx={styles.container}
      onClick={() => {
        setInterestZone(interestZone);
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
                src='/icon/sterilized-cat-icon.png '
                width={25}
                height={25}
                alt='cat-icon'></Image>
              <Text weight={400}>{sterilizedCats.length}</Text>
            </Group>
            <Group spacing='xs'>
              <Image
                src='/icon/unsterilized-icon.png '
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
            <Button mt='md' color='dark' variant='outline' sx={styles.button}>
              {' '}
              ASSIGN TO ME{' '}
            </Button>
          )}
        </Box>
        <Stack spacing={0} sx={{ width: '35%', textAlign: 'center' }}>
          <Text
            weight={500}
            mb='xs'
            sx={{ background: statusColor, textAlign: 'center', borderRadius: '7px' }}>
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
