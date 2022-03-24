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
import { faShieldCat} from '@fortawesome/free-solid-svg-icons';
import List from '@mui/material/List';
import { ListItem } from '@mui/material';

interface Props{
    onClose: () => void,
    isVisible: boolean,
    zone: InterestZone
}

const DetailsModal = (props: Props) => {
    const [isEditable, setIsEditable] = useState(false);
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
    
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

    const sterilizedCatsList = props.zone?.sterilizedCats.map((cat, cnt) => 
        <ListItem key={cnt}>
            <Accordion>
                <AccordionSummary expandIcon={<FontAwesomeIcon icon={faShieldCat}/>}>
                    <Typography>
                        Pisica nr.{cnt + 1}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <form className={styles.catListItem}>
                            <label>Data internare</label>
                            <input type="text" defaultValue={cat.hospitalizationDate} readOnly={!isEditable}></input>
                            <label>Data externare</label>
                            <input type="text" defaultValue={cat.releaseDate} readOnly={!isEditable}></input>
                            <label>Sex</label>
                            <input type="text" defaultValue={cat.sex} readOnly={!isEditable}></input>
                            <label>Voluntar</label>
                            <input type="text" defaultValue={cat.volunteerName} readOnly={!isEditable}></input>
                            <label>Media</label>
                            <input type="text" defaultValue={cat.mediaLinks} readOnly={!isEditable}></input>
                            <label>Observatii</label>
                            <input type="text" defaultValue={cat.observations} readOnly={!isEditable}></input>
                        </form>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </ListItem>    
        );

    const unsterilizedCatsList = props.zone?.unsterilizedCats.map((cat, cnt) => 
    <ListItem key={cnt}>
        <Accordion>
            <AccordionSummary expandIcon={<FontAwesomeIcon icon={faShieldCat}/>}>
                <Typography>
                    Pisica nr.{cnt + 1}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography>
                <label>Sex</label>
                <input type="text" defaultValue={cat.sex} readOnly={!isEditable}></input>
                <label>Voluntar</label>
                <input type="text" defaultValue={cat.mediaLinks} readOnly={!isEditable}></input>
                <label>Observatii</label>
                <input type="text" defaultValue={cat.observations} readOnly={!isEditable}></input>
            </Typography>
            </AccordionDetails>
        </Accordion>
    </ListItem>    
    );

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
                    </form>
                    <div className={styles.catsDisplayDiv}>
                        <Accordion className={styles.catTypeContent}  expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary>
                                <Typography>
                                    Pisici sterilizate
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails className={styles.catListContent}>
                                <div className={styles.catsDiv}>
                                    <List className={styles.catsList}>
                                        {sterilizedCatsList}
                                    </List>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion className={styles.catTypeContent}  expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                            <AccordionSummary>
                                <Typography>
                                    Pisici nesterilizate
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails className={styles.catListContent}>
                                <div className={styles.catsDiv}>
                                    <List className={styles.catsList}>
                                        {unsterilizedCatsList}
                                    </List>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className={styles.buttonsContainer}>
                        {!isEditable && <Button variant="contained" color="success" className={styles.button} onClick={handleEdit}>Edit</Button>}
                        {isEditable && <Button variant="contained" color="success" className={styles.button} onClick={handleSave}>Save</Button>}
                        <Button variant="outlined" color="error" className={styles.button} onClick={handleClose}>Cancel</Button>
                    </div>
                </Box>
            </div>
        </Modal>
    );
}

export default DetailsModal;
