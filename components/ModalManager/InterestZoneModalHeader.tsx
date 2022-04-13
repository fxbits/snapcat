import React from 'react';
import { ActionIcon, Button, Group, MediaQuery, Select, Text, Title } from '@mantine/core';
import { InterestZone, Status } from '../../models/zone.model';
import { ModalConfig } from '../Providers/ModalProvider';
import { ArrowBarLeft, BrandStackoverflow, Edit, Trash } from 'tabler-icons-react';
import { useStatusColor } from '../hooks/useStatusColor';
export default function ZoneModalHeader({
  modal,
  zone,
  setModal,
}: {
  modal: ModalConfig;
  zone: InterestZone | Partial<InterestZone>;
  setModal: (modal: ModalConfig | undefined) => void;
}) {
  const status = useStatusColor;
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
      {modal.type === 'VIEW_ZONE' ? (
        <Button sx={{ backgroundColor: status[zone.status || Status.TODO] }}>
          <Text size='lg'>{zone?.status}</Text>
        </Button>
      ) : (
        <Select data={['To Do', 'In Progress', 'Done']} defaultValue={zone?.status}></Select>
      )}
      <Group spacing='xs'>
        {modal.type === 'VIEW_ZONE' ? (
          <ActionIcon
            color='orange'
            onClick={() => setModal({ ...modal, type: 'EDIT_ZONE' })}
            size='xl'
            radius='xl'
            variant='outline'>
            <Edit size={40} />
          </ActionIcon>
        ) : (
          modal.type === 'EDIT_ZONE' && (
            <ActionIcon
              radius='xl'
              onClick={() => setModal({ ...modal, type: 'VIEW_ZONE' })}
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
