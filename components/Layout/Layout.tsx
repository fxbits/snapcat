import React, { ReactNode } from 'react';
import Modal from '../Modal/Modal';
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Modal />
      <main>{children}</main>
    </>
  );
};

export default Layout;
