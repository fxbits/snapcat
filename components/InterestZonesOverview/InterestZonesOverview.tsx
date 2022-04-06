import { InterestZone } from '../../models/zone.model';
import InterestZoneElement from './InterestZoneElement';
import styles from './InterestZonesOverview.module.css';

import { ScrollArea } from '@mantine/core';

interface Props {
    interestZones: InterestZone[]
}

const InterestZonesOverview = (props: Props) => {
    return (
        <ScrollArea style={{height: "100vh"}} className={styles.container}>
            {
                props.interestZones.map((zone) => <InterestZoneElement interestZone={zone} key={zone._id}/>)
            }
        </ScrollArea>
    );
};

export default InterestZonesOverview;
