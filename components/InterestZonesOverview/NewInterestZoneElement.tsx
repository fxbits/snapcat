import { InterestZone, Status } from '../../models/zone.model';
import { InterestZoneProviderContext } from '../Providers/ProviderZone';
import styles from './InterestZoneElement.module.css';

import { Image, Button } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';

interface Props {
    interestZone: InterestZone;
}

const InterestZoneElement = (props: Props) => {
    const {setInterestZone} = useContext(InterestZoneProviderContext);

    const [statusColor, setStatusColor] = useState<string>('');

    useEffect(() => {
        if (props.interestZone.status === Status.DONE) setStatusColor('#B0EF8F');
        else if (props.interestZone.status === Status.INPROGRESS) setStatusColor('#FFDB3C');
        else setStatusColor('#EF8F8F');
    }, []);

    return (
        <div className={styles.container} onClick={() => {setInterestZone(props.interestZone);}}>
            
            <div className={styles.locationIcon}>
                <Image src='/icon/location-icon.png'></Image>
            </div>
            <div className={styles.addressContainer}>
                {props.interestZone.address.name} 
            </div>
            <div className={styles.coordinatesContainer}>
                {props.interestZone.address.lat}&nbsp;{props.interestZone.address.lng}   
            </div>
            <div className={styles.statusContainer} style={{background: statusColor}}>
                <div className={styles.statusTextContainer}>
                    {props.interestZone.status}
                </div>
            </div>
            {props.interestZone.volunteerName && <div className={styles.volunteerNameContainer}>
                {props.interestZone.volunteerName}
            </div>}
            {props.interestZone.volunteerName && 
            <div className={styles.volunteerContainer}>
                Volunteer
            </div>}
            {!props.interestZone.volunteerName && 
            <Button compact className={styles.assignVolunteerButton} variant="outline" radius={10}>
                ASSIGN TO ME
            </Button>}
           <div className={styles.noSterilizedCats}>
                {props.interestZone.sterilizedCats.length}
            </div>
            <div className={styles.sterilizedCatIconContainer}>
                <Image src='/icon/sterilized-icon.png'></Image>
                <div className={styles.checkedIconContainer}>
                    <Image src='/icon/check-mark 1.png'></Image>
                </div>
            </div>
            <div className={styles.unsterilizedCatIconContainer}>
                <Image src='/icon/unsterilized-icon.png'></Image>
            </div>
            <div className={styles.noUnsterilizedCats}>
                {props.interestZone.unsterilizedCats.length}
            </div>
            <div className={styles.unsterilizedCatEstimateIconContainer}>
                <Image src='/icon/unsterilized-icon-big.png'></Image>
                <div className={styles.questionMarkContainer}>
                    ?
                </div>
            </div>
            <div className={styles.noUnsterilizedCatsEstimate}>
                around {props.interestZone.noUnsterilizedCats??0} cats
            </div>
        </div>
    );
};

export default InterestZoneElement;
