import { createContext, ReactNode, useState } from 'react';

export type ModalConfig = {
  state: 'view' | 'edit' | 'add';
  type: 'cat' | 'zone';
  back?: ModalConfig | undefined;
};

export interface ContextModal {
  modal: ModalConfig | undefined;
  setModal: (modal: ModalConfig | undefined) => void;
}
const defaultContext: ContextModal = {
  modal: undefined,
  setModal: () => undefined,
};

export const ModalContext = createContext(defaultContext);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalConfig | undefined>(undefined);

  return <ModalContext.Provider value={{ modal, setModal }}>{children}</ModalContext.Provider>;
};
