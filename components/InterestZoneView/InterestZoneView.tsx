import { InterestZone } from '../../models/zone.model';
import SterilizedCatsList from './SterilizedCatList';
import UnsterilizedCatsList from './UnsterilizedCatList';
import styles from './InterestZoneView.module.css';

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
        <Box sx={{width: "100%", height:"100%"}}>
            <Grid sx={{width: "100%"}}>
                <Grid.Col lg={6} sm={12}>
                    <ViewDetails zone={props.zone}/>
                </Grid.Col>
                <Grid.Col lg={6} sm={12}>
                    <Accordion disableIconRotation>
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
    );
}

export default InterestZoneView;
