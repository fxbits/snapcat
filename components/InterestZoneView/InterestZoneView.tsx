import { InterestZone } from '../../models/zone.model';
import SterilizedCatsList from './SterilizedCatList';
import UnsterilizedCatsList from './UnsterilizedCatList';

import { useEffect, useState } from 'react';
import { Box, Grid, ScrollArea } from '@mantine/core';
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

    const sterilizedCatsList = props.zone?.sterilizedCats.map((cat, index) => 
        <SterilizedCatsList key={index} cat={cat} isEditable={isEditable}/>
    );

    const unsterilizedCatsList = props.zone?.unsterilizedCats.map((cat, index) =>
        <UnsterilizedCatsList key={index} cat={cat} isEditable={isEditable}/>
    );

    return (
        <Box sx={{width: "100%", height:"100%"}}>
            <Grid sx={{width: "100%"}}>
                <Grid.Col lg={6} sm={12}>
                    <ViewDetails zone={props.zone}/>
                </Grid.Col>
                <Grid.Col lg={6} sm={12}>
                    <Accordion disableIconRotation>
                        {/* TODO: translation keys */}
                        <Accordion.Item label= "Pisici sterilizate">
                            <ScrollArea style={{ height: 250 }}>
                                {sterilizedCatsList}
                            </ScrollArea>
                        </Accordion.Item>
                    </Accordion>
                    <Accordion disableIconRotation >
                        {/* TODO: translation keys */}
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
