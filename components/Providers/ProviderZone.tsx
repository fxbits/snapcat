import { InterestZone } from '../../models/zone.model';
import React, { ReactNode, useState } from 'react';

export interface ContextType {
  interestZone: InterestZone | undefined;
  setInterestZone: (interestZone: InterestZone | undefined) => void;
  partialInterestZone: Partial<InterestZone> | undefined;
  setPartialInterestZone: (zone: Partial<InterestZone> | undefined) => void;
}

const defaultContext: ContextType = {
  interestZone: undefined,
  setInterestZone: (interestZone: InterestZone | undefined) => undefined,
  partialInterestZone: undefined,
  setPartialInterestZone: (zone: Partial<InterestZone> | undefined) => undefined,
};

export const InterestZoneProviderContext = React.createContext(defaultContext);

const ProviderZone = ({ children }: { children: ReactNode }) => {
  const [interestZone, setInterestZone] = useState<InterestZone | undefined>(undefined);
  const [partialInterestZone, setPartialInterestZone] = useState<Partial<InterestZone>>();
  return (
    <InterestZoneProviderContext.Provider
      value={{ interestZone, partialInterestZone, setPartialInterestZone, setInterestZone }}>
      {children}
    </InterestZoneProviderContext.Provider>
  );
};

export default ProviderZone;
