import { createContext, ReactNode, useState } from 'react';

export type Modal = {
  state: 'view' | 'edit' | 'add';
  type: 'cat' | 'zone';
  back: Modal | undefined;
};

export interface ContextModal {
  modal: Modal | undefined;
  setModal: (modal: Modal | undefined) => void;
}
const defaultContext: ContextModal = {
  modal: undefined,
  setModal: () => undefined,
};

export const ModalContext = createContext(defaultContext);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<Modal | undefined>(undefined);

  return <ModalContext.Provider value={{ modal, setModal }}>{children}</ModalContext.Provider>;
};