import { UnsterilizedCat } from '../../models/cat.model';

import { faMars, faVenus, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Box, Group, Stack, Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

interface Props{
    isEditable: boolean,
    cat?: UnsterilizedCat
    onChange: () => void
}

const UnsterilizedCatsList = (props: Props) => {
    const onChange = () => {
        props.onChange();
    };

    return (
        <Box>
            <Group sx={{width: '100%'}}>
                {props.cat?.gender === 'male' && <FontAwesomeIcon icon={faMars}/> }
                {props.cat?.gender === 'female' && <FontAwesomeIcon icon={faVenus}/> }
                <Image src='/icon/sterilized-cat-icon.png ' width={25} height={25} />
                <Stack>
                    <Group sx={{width: '100%'}}> 
                        <Text> Note: </Text>
                        {props.cat?.observations}
                    </Group>
                    <Group sx={{width: '100%'}}>  
                        <FontAwesomeIcon icon={faCalendarDays}/>
                    </Group>
                </Stack>
            </Group>
        </Box>
    );
}

export default UnsterilizedCatsList;