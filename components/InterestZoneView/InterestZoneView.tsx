import { InterestZone } from '../../models/zone.model';
import SterilizedCatsList from './SterilizedCatList';
import UnsterilizedCatsList from './UnsterilizedCatList';
import styles from './InterestZoneView.module.css';

import Modal from '@mui/material/Modal';
import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mantine/core';
import { ArrowNarrowLeft, Trash, Pencil, DeviceFloppy } from 'tabler-icons-react';
import { Accordion } from '@mantine/core';
import ViewDetails from './ViewDetails';

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

    const sterilizedCatsList = props.zone?.sterilizedCats.map((cat) => 
        <SterilizedCatsList onChange={handleSterilizedCatInputChange} cat={cat} isEditable={isEditable}/>
    );

    const unsterilizedCatsList = props.zone?.unsterilizedCats.map((cat) =>
        <UnsterilizedCatsList onChange={handleSterilizedCatInputChange} cat={cat} isEditable={isEditable}/>
    );

    return (
        <Modal
          open={props.isVisible}
          onClose={handleClose}
          aria-labelledby="modal-modal-details"
          aria-describedby="modal-modal-zone-details"
        >
            <div className={styles.container}>
                <Box sx={theme => ({width: "100%", backgroundColor: "white", [theme.fn.largerThan("md")]: {width: "70%"} })}>
                    <div className={styles.buttonsContainer}>
                        <Button leftIcon={<ArrowNarrowLeft/>} variant="white" color="dark" onClick={handleClose}>Back</Button>
                        {!isEditable && <div className={styles.statusLabel}>Status {props.zone?.status}</div> }
                        {!isEditable && <Button leftIcon={<Pencil/>} onClick={handleEdit} styles={() => ({ root: { padding: 0 }})}/>}
                        {isEditable && <Button leftIcon={<DeviceFloppy/>} onClick={handleSave} styles={() => ({ root: { padding: 0 }})} />}
                        <Button leftIcon={<Trash/>} styles={() => ({ root: { padding: 0 }})}></Button>
                    </div>
                    <Grid>
                        <Grid.Col lg={6} sm={12}>
                            <ViewDetails zone={props.zone}/>
                        </Grid.Col>
                        <Grid.Col lg={6} sm={12}>
                            <Accordion disableIconRotation >
                                <Accordion.Item label= "Pisici sterilizate">
                                    {sterilizedCatsList}
                                </Accordion.Item>
                            </Accordion>
                            <Accordion disableIconRotation >
                                <Accordion.Item label= "Pisici nesterilizate">
                                    {unsterilizedCatsList}
                                </Accordion.Item>
                            </Accordion>
                        </Grid.Col>
                    </Grid>
                </Box>
            </div>
        </Modal>
    );
}

export default InterestZoneView;
