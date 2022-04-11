import { Modal as WindowModal } from '@mantine/core';
import React, { useContext } from 'react';
import { ModalContext } from '../Providers/ModalProvider';

import { InterestZoneProviderContext } from '../Providers/ProviderZone';
import ModalZone from './ModalZone';

export default function ModalComponent() {
  const { modal, setModal } = useContext(ModalContext);
  const { interestZone, partialInterestZone } = useContext(InterestZoneProviderContext);

  return (
    <WindowModal
      centered
      size='100%'
      opened={modal !== undefined}
      sx={(theme) => ({
        '& .mantine-Modal-modal': {
          overflowY: "scroll",
          padding: 0,
          borderRadius: '15px',
          width: '100%',
          height: '100vh',
          [theme.fn.largerThan('md')]: {
            width: '55%',
            height: '70vh',
          },
        },
      })}
      styles={{ inner: { padding: 0 } }}
      onClose={() => setModal(undefined)}
      withCloseButton={false}>
      {modal && interestZone && (
        <ModalZone
          zone={interestZone}
          modal={modal}
          setModal={setModal}
          onClose={() => setModal(undefined)}
        />
      )}
    </WindowModal>
  );
}
