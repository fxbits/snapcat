import { ReactNode } from 'react';
import ModalManager from '../ModalManager/ModalManager';
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ModalManager />
      <main>{children}</main>
    </>
  );
};

export default Layout;
