import { InterestZone } from '../../models/zone.model';
import { Phone } from 'tabler-icons-react';
import { Box, Group, Stack, Container, Text, useMantineTheme } from '@mantine/core';
import Image from 'next/image';

interface Props {
  zone?: Partial<InterestZone>;
}

const ViewDetails = (props: Props) => {
  const theme = useMantineTheme();
  return (
    <Group
      p='md'
      position='apart'
      align='flex-start'
      sx={(theme) => ({
        backgroundColor: theme.colors.yellow[2],
        borderRadius: theme.radius.md,
      })}>
      <Stack>
        <Group>
          <Image src='/icon/location-icon.png' alt='location icon' width={16} height={23}></Image>
          <Stack spacing={0}>
            <Text size='lg' weight={400}>
              {props.zone?.address?.name}
            </Text>
            <Text color='gray' size='xs'>
              {props.zone?.address?.lat} {props.zone?.address?.lng}
            </Text>
          </Stack>
        </Group>
        <Group mt='xs'>
          <Group spacing='xs'>
            <Image
              src='/icon/sterilized-cat-icon.svg'
              alt='sterilized cat'
              width={45}
              height={45}></Image>
            <Text weight={400}>{props.zone?.sterilizedCats?.length}</Text>
          </Group>
          <Group spacing='xs'>
            <Image
              src='/icon/unsterilized-cat-icon.svg'
              alt='unsterilized cat'
              width={45}
              height={45}></Image>
            <Text weight={400}>{props.zone?.unsterilizedCats?.length}</Text>
          </Group>
        </Group>
        <Text mt='md' color='gray'>
          Volunteer{' '}
        </Text>
        <Text weight={600}> {props.zone?.volunteerName} </Text>
      </Stack>

      {/* TODO: translation keys */}

      <Stack spacing={0} sx={{ width: '35%', textAlign: 'left' }}>
        <Text>Contact</Text>
        <Text weight={600}>{props.zone?.contactPerson?.name}</Text>
        <Group spacing={0}>
          <Phone size={18} strokeWidth={2} color={'black'} />
          <Text weight={600}>{props.zone?.contactPerson?.phone}</Text>
        </Group>
      </Stack>
    </Group>
  );
};

export default ViewDetails;
