import { Box, Button, Header } from '@mantine/core';
import React, { ReactNode, useContext } from 'react';
import ModalManager from '../ModalManager/ModalManager';
import { ModalContext } from '../Providers/ModalProvider';
const Layout = ({ children }: { children: ReactNode }) => {
  const { setModal } = useContext(ModalContext);
  return (
    <>
      <ModalManager />

      <main>{children}</main>
    </>
  );
};

export default Layout;
