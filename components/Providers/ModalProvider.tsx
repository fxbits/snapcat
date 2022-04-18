import { createContext, ReactNode, useState } from 'react';

export type ModalConfig = {
  type:
    | 'VIEW_CAT'
    | 'ADD_CAT'
    | 'EDIT_CAT'
    | 'STERILIZE_CAT'
    | 'VIEW_ZONE'
    | 'ADD_ZONE'
    | 'EDIT_ZONE';
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
