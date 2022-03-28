import { InterestZone } from '../../models/zone.model';
import DetailsForm from './DetailsForm';
import SterilizedCatsList from './SterilizedCatList';
import UnsterilizedCatsList from './UnsterilizedCatList';
import styles from './InterestZoneView.module.css';

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

const InterestZoneView = (props: Props) => {
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
    };

    const handleSave = () => {
        setIsEditable(!isEditable);
    };

    const handleClose = useCallback(() => {
        props.onClose();
    }, []);

    const handleSterilizedCatInputChange = () => {

    };

    const handleUnsterilizedCatInputChange = () => {
        
    };

    const handleZoneInputChange = () => {
        
    };

    const sterilizedCatsList = props.zone?.sterilizedCats.map((cat, cnt) => 
        <ListItem key={cnt}>
            <Accordion style={{width: "100%"}}>
                <AccordionSummary expandIcon={<FontAwesomeIcon icon={faShieldCat}/>}>
                    <Typography>
                        Pisica nr.{cnt + 1}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <SterilizedCatsList onChange={handleSterilizedCatInputChange} cat={cat} isEditable={isEditable}/>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </ListItem>    
        );

    const unsterilizedCatsList = props.zone?.unsterilizedCats.map((cat, cnt) =>
    <ListItem key={cnt}>
        <Accordion style={{width: "100%"}}>
            <AccordionSummary expandIcon={<FontAwesomeIcon icon={faShieldCat}/>}>
                <Typography>
                    Pisica nr.{cnt + 1}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    <UnsterilizedCatsList onChange={handleUnsterilizedCatInputChange} cat={cat} isEditable={isEditable}/>
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
                    <DetailsForm onChange={handleZoneInputChange} zone={props.zone} isEditable={isEditable}/>
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
                        {!isEditable && <Button variant="contained" color="success" className={styles.button} onClick={handleEdit} style={{margin: "10px"}} >Edit</Button>}
                        {isEditable && <Button variant="contained" color="success" className={styles.button} onClick={handleSave}>Save</Button>}
                        <Button variant="outlined" color="error" className={styles.button} onClick={handleClose}>Cancel</Button>
                    </div>
                </Box>
            </div>
        </Modal>
    );
}

export default InterestZoneView;
