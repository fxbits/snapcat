import React from 'react';
import { ActionIcon, Button, Group, MediaQuery, Select, Text, Title } from '@mantine/core';
import { InterestZone, Status } from '../../models/zone.model';
import { ModalConfig } from '../Providers/ModalProvider';
import { ArrowBarLeft, BrandStackoverflow, Edit, Trash } from 'tabler-icons-react';

export default function ZoneModalHeader({
  modal,
  zone,
  setModal,
}: {
  modal: ModalConfig;
  zone: InterestZone | Partial<InterestZone>;
  setModal: (modal: ModalConfig | undefined) => void;
}) {
  const statusColor: Record<Status, string> = {
    [Status.DONE]: '#B0EF8F',
    [Status.INPROGRESS]: '#FFDB3C',
    [Status.TODO]: '#EF8F8F',
  };
  return (
    <Group p='md' position='apart' align='center' sx={{ width: '100%' }}>
      <Group spacing={0} sx={{ height: '100%' }}>
        <ActionIcon size='xl' onClick={() => setModal(undefined)} variant='transparent'>
          <ArrowBarLeft size={50} />
        </ActionIcon>
        <Title sx={{ fontWeight: '600' }} order={5}>
          Back
        </Title>
      </Group>
      {modal.state === 'view' ? (
        <Button sx={{ backgroundColor: statusColor[zone.status || Status.TODO] }}>
          <Text size='lg'>{zone?.status}</Text>
        </Button>
      ) : (
        <Select data={['To Do', 'In Progress', 'Done']} defaultValue={zone?.status}></Select>
      )}
      <Group spacing='xs'>
        {modal.state === 'view' ? (
          <ActionIcon
            color='orange'
            onClick={() => setModal({ ...modal, state: 'edit' })}
            size='xl'
            radius='xl'
            variant='outline'>
            <Edit size={40} />
          </ActionIcon>
        ) : (
          modal.state === 'edit' && (
            <ActionIcon
              radius='xl'
              onClick={() => setModal({ ...modal, state: 'view' })}
              size='xl'
              variant='outline'>
              <BrandStackoverflow size={40} />
            </ActionIcon>
          )
        )}

        <ActionIcon size='xl' radius='xl' variant='outline'>
          <Trash size={40} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
