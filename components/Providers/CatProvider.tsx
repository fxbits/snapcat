import React, { ReactNode, useState } from 'react';
import { Cat } from '../../models/cat.model';

export interface ContextType {
  cat: Cat | undefined;
  setCat: (cat: Cat | undefined) => void;
}

const defaultContext: ContextType = {
  cat: undefined,
  setCat: () => undefined,
};

export const CatContext = React.createContext(defaultContext);

const CatProvider = ({ children }: { children: ReactNode }) => {
  const [cat, setCat] = useState<Cat | undefined>(undefined);
  return <CatContext.Provider value={{ cat, setCat }}>{children}</CatContext.Provider>;
};

export default CatProvider;
