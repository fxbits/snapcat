import { Box, Header } from '@mantine/core';
import React, { ReactNode } from 'react';
import Modal from '../Modal/Modal';
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Modal />
      <Header height={60} sx={(theme) => ({ backgroundColor: theme.colors.yellow[6] })}>
        <Box />
      </Header>
      <main>{children}</main>
    </>
  );
};

export default Layout;
