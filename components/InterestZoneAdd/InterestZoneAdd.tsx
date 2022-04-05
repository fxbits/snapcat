import DetailsForm from '../InterestZoneView/DetailsForm';
import styles from '../InterestZoneView/InterestZoneView.module.css';
import { zoneServiceUi } from '../../ui/ZoneServices';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import { InterestZone } from '../../models/zone.model';

interface Props{
    onClose: () => void,
    isVisible: boolean,
    zone: Partial<InterestZone>
}   

const InterestZoneAdd = (props: Props) => {

    const [newZone, setNewZone] = useState<any>();

    const handleSave = () => {
        console.log(newZone);
        zoneServiceUi.addZone(newZone);
    };

    const handleClose = useCallback(() => {
        props.onClose();
    }, []);

    return (
        <Modal
          open={props.isVisible}
          onClose={handleClose}
        >
            <div className={styles.container}>
                <Box className={styles.box}>
                    <DetailsForm onChange={setNewZone} isEditable={true} zone={props.zone}/>
                    <div className={styles.buttonsContainer}>
                        <Button variant="contained" color="success" className={styles.button} onClick={handleSave} style={{margin: "10px"}}>Save</Button>
                        <Button variant="outlined" color="error" className={styles.button} onClick={handleClose}>Cancel</Button>
                    </div>
                </Box>
            </div>
        </Modal>
    );
}

export default InterestZoneAdd;
