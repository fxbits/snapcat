import React, { ReactNode } from 'react';
import HeaderGoogle from '../HeaderGoogle/HeaderGoogle';
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
