import { InterestZone } from '../../models/zone.model';
import { Phone } from 'tabler-icons-react';
import { Box, Group, Stack, Container, Text, useMantineTheme } from '@mantine/core';
import Image from 'next/image';
import useAdressName from '../hooks/useAdress';
import { useTranslation } from 'next-i18next';

interface Props {
  zone?: Partial<InterestZone>;
}

const ViewDetails = (props: Props) => {
  const theme = useMantineTheme();
  const newAdress = useAdressName(props.zone?.address!);

  const { t } = useTranslation('common');
  return (
    <Group
      p='md'
      spacing='xs'
      position='apart'
      align='flex-start'
      sx={(theme) => ({
        backgroundColor: theme.colors.yellow[2] + 'd6',
        backdropFilter: 'blur(15px)',
        borderRadius: theme.radius.md,
      })}>
      <Stack spacing={0}>
        <Group noWrap>
          <Image src='/icon/location-icon.png' alt='location icon' width={16} height={23}></Image>
          <Stack spacing={0}>
            <Text size='xl' weight={400}>
              {newAdress.street}
            </Text>
            <Text color='gray'>{newAdress.city}</Text>
          </Stack>
        </Group>
        <Group mt='xs'>
          <Group spacing='xs'>
            <Image
              src='/icon/sterilized-cat-icon.svg'
              alt='sterilized cat'
              width={45}
              height={45}></Image>
            <Text weight={600} size='xl'>
              {props.zone?.sterilizedCats?.length}
            </Text>
          </Group>
          <Group spacing='xs'>
            <Image
              src='/icon/unsterilized-cat-icon.svg'
              alt='unsterilized cat'
              width={45}
              height={45}></Image>
            <Text weight={600} size='xl'>
              {props.zone?.unsterilizedCats?.length}
            </Text>
          </Group>
        </Group>
        {props.zone?.volunteerName && (
          <>
            <Text mt='md' color='gray'>
              {t('components.interestZoneView.viewDetails.volunteer')}{' '}
            </Text>
            <Text size='sm'> {props.zone?.volunteerName} </Text>
          </>
        )}
      </Stack>
      <Stack
        spacing={0}
        sx={(theme) => ({
          [theme.fn.largerThan('sm')]: { alignItems: 'flex-end' },
          alignItems: 'flex-start',
        })}>
        <Text weight={500}>Contact</Text>
        {props.zone?.contactPerson?.name ? (
          <>
            <Text size='sm'>{props.zone.contactPerson.name}</Text>
            {props.zone?.contactPerson?.phone && (
              <Group noWrap spacing={0} mt='xs'>
                <Phone size={18} strokeWidth={2} color={'black'} />
                <Text size='sm'>{props.zone.contactPerson.phone}</Text>
              </Group> 
            )}
          </>
        ) : (
          <Text size='xs' color='gray'>
            {t('components.interestZoneView.viewDetails.noContactInformation')}
          </Text>
        ) }
      </Stack>
    </Group>
  );
};

export default ViewDetails;
