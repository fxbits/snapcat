import { InterestZone } from '../../models/zone.model';
import React, { ReactNode, useState } from 'react';

export interface ContextType {
    interestZone: InterestZone | 'disabled',
    setInterestZone: (interestZone: InterestZone | 'disabled') => void;
}

const defaultContext: ContextType = {
    interestZone: 'disabled',
    setInterestZone: (interestZone: InterestZone | 'disabled') => undefined
}

export const InterestZoneProviderContext = React.createContext(defaultContext);

const ProviderZone = ({children} : {children: ReactNode}) => {
    const [interestZone, setInterestZone] = useState<InterestZone | 'disabled'>('disabled');

    return (
        <InterestZoneProviderContext.Provider value={{interestZone, setInterestZone}}>
            {children}
        </InterestZoneProviderContext.Provider>
    );
}

export default ProviderZone;
