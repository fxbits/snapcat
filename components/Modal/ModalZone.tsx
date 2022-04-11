import React, { useContext } from 'react';
import { ActionIcon, Box, Button, Group, MediaQuery, Select, Text, Title } from '@mantine/core';
import { InterestZone, Status } from '../../models/zone.model';
import { Modal } from '../Providers/ModalProvider';
import { ArrowBarLeft, BrandStackoverflow, Edit, Trash } from 'tabler-icons-react';
import { InterestZoneProviderContext } from '../Providers/ProviderZone';
import InterestZoneView from '../InterestZoneView/InterestZoneView';
import InterestZoneAdd from '../InterestZoneAdd/InterestZoneAdd';
import zoneSchema from '../../data/zone.schema';

interface StatusColor {
  [Status.DONE]: string;
  [Status.INPROGRESS]: string;
  [Status.TODO]: string;
}
const HeaderModal = ({
  modal,
  zone,
  onClose,
  setModal,
}: {
  modal: Modal;
  zone: InterestZone;
  onClose: () => void;
  setModal: (modal: Modal | undefined) => void;
}) => {
  const statusColor: StatusColor = {
    [Status.DONE]: '#B0EF8F',
    [Status.INPROGRESS]: '#FFDB3C',
    [Status.TODO]: '#EF8F8F',
  };
  return (
    <Group p='md' position='apart' align='center' sx={{ width: '100%' }}>
      <Group spacing={0}>
        <ActionIcon size='xl' onClick={onClose} variant='transparent'>
          <ArrowBarLeft size={50} />
        </ActionIcon>
        <Title sx={{ fontWeight: '600' }} order={4}>
          Back
        </Title>
      </Group>
      {modal.state === 'view' ? (
        <Button sx={{ backgroundColor: statusColor[zone.status] }}>
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
};

export default function ModalZone({
  zone,
  modal,
  onClose,
  setModal,
}: {
  zone: InterestZone;
  modal: Modal;
  onClose: () => void;
  setModal: (modal: Modal | undefined) => void;
}) {
  const { interestZone, partialInterestZone } = useContext(InterestZoneProviderContext);

  return (
    <>
      <HeaderModal zone={zone} modal={modal} onClose={onClose} setModal={setModal} />
      {modal.state === 'view' && interestZone && (
        <InterestZoneView
          zone={interestZone}
          isVisible={true}
          onClose={() => setModal(undefined)}
        />
      )}
      {modal.state === 'add' && partialInterestZone && (
        <InterestZoneAdd
          zone={partialInterestZone}
          onClose={() => setModal(undefined)}
          isVisible={true}
        />
      )}
    </>
  );
}
