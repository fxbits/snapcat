import { ActionIcon, Box, Button, Group, Header, Portal, Select, Text, Title } from '@mantine/core';
import React, { useContext } from 'react';
import { ArrowBack, Backspace, Binary, Edit, Heading } from 'tabler-icons-react';
import { InterestZone } from '../../models/zone.model';
import InterestZoneAdd from '../InterestZoneAdd/InterestZoneAdd';
import InterestZoneView from '../InterestZoneView/InterestZoneView';
import { Modal, ModalContext } from '../Providers/ModalProvider';
import { InterestZoneProviderContext } from '../Providers/ProviderZone';

const HeaderModal = ({ modal, zone }: { modal: Modal; zone: InterestZone | undefined }) => {
  switch (modal.type) {
    case 'zone': {
      return (
        <Group px='xl' mx='lg' position='apart' sx={{ width: '100%' }}>
          <Group spacing='xs'>
            <ActionIcon size='xl' variant='transparent'>
              <ArrowBack size={50} />
            </ActionIcon>
            <Title order={4}>Back</Title>
          </Group>
          {modal.state === 'view' ? (
            <Text>
              Status
              <br />
              {zone?.status}
            </Text>
          ) : (
            <Select data={['To Do', 'In Progress', 'Done']}></Select>
          )}
          <Group>
            <ActionIcon>
              <Edit size={50} />
            </ActionIcon>
            <ActionIcon>
              <Binary size={50} />
            </ActionIcon>
          </Group>
        </Group>
      );
    }
  }
  return <></>;
};

export default function ModalComponent() {
  const { modal, setModal } = useContext(ModalContext);
  const { interestZone, partialInterestZone } = useContext(InterestZoneProviderContext);

  return (
    <>
      {modal && (
        <Portal zIndex={300}>
          <Box
            sx={(theme) => ({
              position: 'fixed',
              top: 0,
              width: '100%',
              height: '100vh',
              backgroundColor: theme.colors.yellow[6],
            })}>
            <Header height={60} sx={{ display: 'flex', alignItems: 'center' }}>
              <HeaderModal zone={interestZone} modal={modal} />
              <Button onClick={() => setModal(undefined)}>Clear Modal</Button>
            </Header>
            <Box>
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
            </Box>
          </Box>
        </Portal>
      )}
    </>
  );
}
