import { createStyles, CSSObject, Modal as WindowModal } from '@mantine/core';
import React, { useContext, useState } from 'react';
import CatModalView from '../CatModal/CatModalView';
import InterestZoneAdd from '../InterestZoneAdd/InterestZoneAdd';
import InterestZoneView from '../InterestZoneView/InterestZoneView';
import { ModalContext } from '../Providers/ModalProvider';

import { InterestZoneProviderContext } from '../Providers/ZoneProvider';
import CatModalHeader from '../CatModal/CatModalHeader';
import ZoneModalHeader from './InterestZoneModalHeader';

const useStyles = createStyles((theme) => ({
  manager: {
    '& .mantine-Modal-modal': {
      backgroundColor: theme.colors.yellow[5],
      borderRadius: '15px',
      width: '100%',
      [theme.fn.largerThan('md')]: {
        width: '55%',
        marginTop: '50px',
      },
    },
    '& .mantine-Modal-body': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  },
}));

export default function ModalComponent() {
  const { modal, setModal } = useContext(ModalContext);
  const { interestZone, partialInterestZone } = useContext(InterestZoneProviderContext);
  const { classes } = useStyles();
  return (
    <>
      {modal && (
        <WindowModal
          opened={modal !== undefined}
          className={classes.manager}
          styles={{ inner: { padding: 0 } }}
          onClose={() => setModal(undefined)}
          withCloseButton={false}>
          {modal.type === 'ADD_ZONE' && partialInterestZone && (
            <>
              <ZoneModalHeader zone={partialInterestZone} modal={modal} setModal={setModal} />
              <InterestZoneAdd
                zone={partialInterestZone}
                onClose={() => setModal(undefined)}
                isVisible={true}
              />
            </>
          )}
          {modal.type === 'VIEW_ZONE' && interestZone && (
            <>
              <ZoneModalHeader zone={interestZone} modal={modal} setModal={setModal} />
              <InterestZoneView
                zone={interestZone}
                isVisible={true}
                onClose={() => setModal(undefined)}
              />
            </>
          )}
          {(modal.type === 'VIEW_CAT' || modal.type === 'ADD_CAT' || modal.type === 'EDIT_CAT') &&
            interestZone && (
              <>
                <CatModalHeader modal={modal} setModal={setModal} />
                <CatModalView modal={modal} />
              </>
            )}
        </WindowModal>
      )}
    </>
  );
}
