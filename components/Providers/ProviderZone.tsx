import { InterestZone } from '../../models/zone.model';
import React, { ReactNode, useState } from 'react';

export interface ContextType {
    interestZone: InterestZone | undefined,
    setInterestZone: (interestZone: InterestZone | undefined) => void;
}

const defaultContext: ContextType = {
    interestZone: undefined,
    setInterestZone: (interestZone: InterestZone | undefined) => undefined
}

export const InterestZoneProviderContext = React.createContext(defaultContext);

const ProviderZone = ({children} : {children: ReactNode}) => {
    const [interestZone, setInterestZone] = useState<InterestZone | undefined>(undefined);

    return (
        <InterestZoneProviderContext.Provider value={{interestZone, setInterestZone}}>
            {children}
        </InterestZoneProviderContext.Provider>
    );
}

export default ProviderZone;
