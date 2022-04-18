import { Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import React from 'react';
import { Phone } from 'tabler-icons-react';
import { InterestZone } from '../../models/zone.model';

interface FormValues {
  adress: string;
  volunteerName: string;
  contact: string;
  phone: string;
}

export default function InterestZoneForm({ zone }: { zone: Partial<InterestZone> }) {
  console.log(zone);
  const form = useForm<FormValues>({
    initialValues: {
      adress: zone.address?.name || '',
      volunteerName: zone.volunteerName || '',
      contact: zone.contactPerson?.name || '',
      phone: zone.contactPerson?.phone || '',
    },
  });
  return (
    <Stack
      p='md'
      sx={(theme) => ({ backgroundColor: theme.colors.yellow[2], borderRadius: theme.radius.md })}>
      <TextInput placeholder='Your adress' label='Adress' required />
      <TextInput placeholder='My volunteer' label='Volunteer' required />
      <TextInput placeholder='Contact' label='Adress' required />
      <TextInput icon={<Phone />} placeholder='Contact' required />
    </Stack>
  );
}
