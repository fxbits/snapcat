import { createStyles, CSSObject, Modal as WindowModal } from '@mantine/core';
import React, { useContext, useState } from 'react';
import CatModalView from '../CatModal/CatModalView';
import InterestZoneView from '../InterestZoneModal/InterestZoneView';
import { ModalContext } from '../Providers/ModalProvider';

import { InterestZoneProviderContext } from '../Providers/ZoneProvider';
import { CatContext } from '../Providers/CatProvider';

const useStyles = createStyles((theme) => ({
  manager: {
    '& .mantine-Modal-modal': {
      backgroundColor: theme.colors.yellow[5],
      width: '100%',
      minHeight: '100vh',
      borderRadius: '0px',
      [theme.fn.largerThan('md')]: {
        width: '65%',
        minHeight: '650px',
        borderRadius: '15px',
      },
    },
    '& .mantine-Modal-body': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  },
}));

export default function ModalManager() {
  const { classes } = useStyles();
  const { modal, setModal } = useContext(ModalContext);
  const { cat } = useContext(CatContext);
  const { interestZone, partialInterestZone } = useContext(InterestZoneProviderContext);
  if (!modal) return <></>;

  const isZone =
    modal?.type === 'VIEW_ZONE' || modal?.type === 'EDIT_ZONE' || modal?.type === 'ADD_ZONE';
  const isCat =
    modal?.type === 'VIEW_CAT' ||
    modal?.type === 'ADD_CAT' ||
    modal?.type === 'EDIT_CAT' ||
    modal?.type === 'STERILIZE_CAT';

  return (
    <WindowModal
      centered
      opened={modal !== undefined}
      className={classes.manager}
      overlayOpacity={1}
      overlayColor='#FFFFFF30'
      styles={{
        inner: { padding: 0 },
        overlay: {
          backdropFilter: 'blur(5px)',
        },
      }}
      onClose={() => {
        setModal(undefined);
      }}
      withCloseButton={false}>
      {isZone && (interestZone || partialInterestZone) && (
        <>
          <InterestZoneView zone={interestZone} partialZone={partialInterestZone} />
        </>
      )}
      {isCat && interestZone && (
        <CatModalView zoneId={interestZone._id} modal={modal} cat={cat} setModal={setModal} />
      )}
    </WindowModal>
  );
}
