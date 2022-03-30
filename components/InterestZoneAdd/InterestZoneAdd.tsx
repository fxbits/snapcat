import DetailsForm from '../InterestZoneView/DetailsForm';
import styles from '../InterestZoneView/InterestZoneView.module.css';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';

interface Props{
    onClose: () => void,
    isVisible: boolean,
    /// must have long and lat
}   

const InterestZoneAdd = (props: Props) => {

    const handleSave = () => {
    };

    const handleClose = useCallback(() => {
        props.onClose();
    }, []);

    const handleZoneInputChange = () => {
        
    };

    return (
        <Modal
          open={props.isVisible}
          onClose={handleClose}
          aria-labelledby="modal-modal-details"
          aria-describedby="modal-modal-zone-details"
        >
            <div className={styles.container}>
                <Box className={styles.box}>
                    <DetailsForm onChange={handleZoneInputChange} isEditable={true}/>
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
