import React from 'react';
import { ActionIcon, Button, Group, MediaQuery, Select, Stack, Text, Title } from '@mantine/core';
import { InterestZone, Status } from '../../models/zone.model';
import { ModalConfig } from '../Providers/ModalProvider';
import { ArrowLeft, BrandStackoverflow, Edit, Plus, Trash } from 'tabler-icons-react';
import useZoneActions from './hooks/useZoneActions';
import { FormValues } from './InterestZoneView';
import { UseForm } from '@mantine/hooks/lib/use-form/use-form';
export default function ZoneModalHeader({
  modal,
  zone,
  setModal,
  addZone,
  updateZone,
  deleteZone,
  form,
}: {
  modal: ModalConfig;
  zone: InterestZone | Partial<InterestZone>;
  setModal: (modal: ModalConfig | undefined) => void;
  addZone: () => void;
  updateZone: () => void;
  deleteZone: () => void;
  form: UseForm<FormValues>;
}) {
  const { AddZone } = useZoneActions(zone._id!);
  return (
    <Group p='md' position='apart' align='center' sx={{ width: '100%' }}>
      <Group spacing='sm' sx={{ height: '100%' }}>
        <ActionIcon size='xl' onClick={() => setModal(undefined)} variant='filled' color='yellow'>
          <ArrowLeft size={50} />
        </ActionIcon>
        <Title sx={{ fontWeight: '600' }} order={5}>
          Back
        </Title>
      </Group>
      {modal.type === 'VIEW_ZONE' ? (
        <Stack spacing={0} align='center'>
          <Text size='sm'>Status</Text>
          <Text size='lg' inline sx={{ textTransform: 'uppercase' }}>
            {zone?.status}
          </Text>
        </Stack>
      ) : (
        <Select
          {...form.getInputProps('status')}
          onChange={(e) => form.setFieldValue('status', e as Status)}
          data={[
            { value: Status.TODO, label: 'To Do' },
            { value: Status.INPROGRESS, label: 'In Progress' },
            { value: Status.DONE, label: 'Done' },
          ]}
          defaultValue={zone?.status}></Select>
      )}
      <Group spacing='xs'>
        {modal.type === 'VIEW_ZONE' && (
          <ActionIcon
            color='indigo'
            onClick={() => setModal({ ...modal, type: 'EDIT_ZONE' })}
            size='lg'
            radius='md'
            variant='filled'>
            <Edit size={40} />
          </ActionIcon>
        )}
        {modal.type === 'EDIT_ZONE' && (
          <ActionIcon
            onClick={() => updateZone()}
            size='lg'
            color='indigo'
            radius='md'
            variant='filled'>
            <BrandStackoverflow size={40} />
          </ActionIcon>
        )}
        {modal.type === 'ADD_ZONE' && (
          <ActionIcon
            onClick={() => addZone()}
            size='lg'
            color='indigo'
            radius='md'
            variant='filled'>
            <Plus size={40} />
          </ActionIcon>
        )}
        <ActionIcon onClick={() => deleteZone()} size='lg' radius='md' color='red' variant='filled'>
          <Trash size={40} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
