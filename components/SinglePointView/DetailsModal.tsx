import { InterestZone } from '../../models/zone.model';
import styles from './DetailsModal.module.css';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldCat} from '@fortawesome/free-solid-svg-icons'

interface Props{
    onClose: () => void,
    isVisible: boolean,
    zone: InterestZone
}

const DetailsModal = (props: Props) => {
    const [isEditable, setIsEditable] = useState(false);
    
    useEffect(() => {
        setIsEditable(false);  
    }, [props.isVisible])


    const handleEdit = () => {
        setIsEditable(!isEditable);
    }

    const handleSave = () => {
        setIsEditable(!isEditable);
    }

    const handleClose = useCallback(() => {
        props.onClose();
    },[])

    return (
        <Modal
          open={props.isVisible}
          onClose={handleClose}
          aria-labelledby="modal-modal-details"
          aria-describedby="modal-modal-zone-details"
        >
            <div className={styles.container}>
                <Box className={styles.box}>
                    <form className={styles.form}>
                        <label>Adresa</label>
                        <input type="text" defaultValue={props.zone?.address.name} readOnly={!isEditable}></input>
                        <label>Numar pisici nesterilizate</label>
                        <input type="text" defaultValue={props.zone?.unsterilizedCats.length} readOnly={!isEditable} ></input>
                        <label>Numar pisici sterilizate</label>
                        <input type="text" defaultValue={props.zone?.sterilizedCats.length} readOnly={!isEditable}></input>
                        <label>Status</label>
                        <input type="text" defaultValue={props.zone?.status} readOnly={!isEditable}></input>
                        <label>Nume persoana de contact</label>
                        <input type="text" defaultValue={props.zone?.contactPerson?.name} readOnly={!isEditable}></input>
                        <label>Observatii</label>
                        <input type="text" defaultValue={props.zone?.observations} readOnly={!isEditable}></input>


                        <Accordion>
                            <AccordionSummary
                                expandIcon={<FontAwesomeIcon icon={faShieldCat} />}
                            >
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                <label>Test</label>
                                <input type="text" defaultValue="test" readOnly={!isEditable}></input>
                            </Typography>
                            </AccordionDetails>
                        </Accordion>

                        {props.zone?.sterilizedCats.map((cat) => {
                        console.log(cat.sex);
                            
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<FontAwesomeIcon icon={faShieldCat} />}
                            >
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                <label>Data internare</label>
                                <input type="text" defaultValue={cat.hospitalizationDate} readOnly={!isEditable}></input>
                                <label>Data externare</label>
                                <input type="text" defaultValue={cat.releaseDate} readOnly={!isEditable}></input>
                                <label>Sex</label>
                                <input type="text" defaultValue={cat.sex} readOnly={!isEditable}></input>
                                <label>Voluntar</label>
                                <input type="text" defaultValue={cat.volunteerID} readOnly={!isEditable}></input>
                                <label>Media</label>
                                <input type="text" defaultValue={cat.mediaLinks} readOnly={!isEditable}></input>
                                <label>Observatii</label>
                                <input type="text" defaultValue={cat.observations} readOnly={!isEditable}></input>
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        })}
                    </form>
                    {!isEditable && <Button variant="contained" color="success" className={styles.button} onClick={handleEdit}>Edit</Button>}
                    {isEditable && <Button variant="contained" color="success" className={styles.button} onClick={handleSave}>Save</Button>}
                    <Button variant="outlined" color="error" className={styles.button} onClick={handleClose}>Cancel</Button>
                </Box>
            </div>
        </Modal>
    );
}

export default DetailsModal;
