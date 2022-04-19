import { InterestZone } from '../../models/zone.model';
import React, { ReactNode, useEffect, useState } from 'react';
import { Cat } from '../../models/cat.model';
import useSWR from 'swr';

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

const ZoneProvider = ({ children }: { children: ReactNode }) => {
  const [interestZone, setInterestZone] = useState<InterestZone | undefined>(undefined);
  const [partialInterestZone, setPartialInterestZone] = useState<Partial<InterestZone>>();
  const { data: zone } = useSWR<InterestZone>(
    interestZone?._id ? `/api/interest-zones/${interestZone?._id}` : null
  );

  useEffect(() => {
    if (zone !== undefined) {
      setInterestZone(zone);
      setPartialInterestZone(undefined);
    }
  }, [zone]);

  return (
    <InterestZoneProviderContext.Provider
      value={{ interestZone, partialInterestZone, setPartialInterestZone, setInterestZone }}>
      {children}
    </InterestZoneProviderContext.Provider>
  );
};

export default ZoneProvider;
