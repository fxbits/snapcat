import { Box, Header } from '@mantine/core';
import React, { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header
        height={50}
        sx={(theme) => ({
          backgroundColor: theme.primaryColor,
          alignItems: 'center',
          display: 'flex',
        })}>
        <Box />
      </Header>
      <main>{children}</main>
    </>
  );
};

export default Layout;
