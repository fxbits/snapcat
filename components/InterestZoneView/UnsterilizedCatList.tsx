import { UnsterilizedCat } from '../../models/cat.model';
import { Gender } from '../../models/cat.model';

import { faMars, faVenus, faCalendarDays, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Box, Group, Stack, Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

interface Props{
    isEditable: boolean,
    cat?: UnsterilizedCat
}

const UnsterilizedCatsList = (props: Props) => {
    return (
        <Box>
            <Group sx={{width: '100%'}}>
                {props.cat?.gender === Gender.MALE && <FontAwesomeIcon icon={faMars}/> }
                {props.cat?.gender === Gender.FEMALE && <FontAwesomeIcon icon={faVenus}/> }
                {props.cat?.gender === Gender.UNKNOWN && <FontAwesomeIcon icon={faQuestion}/> }
                <Image src='/icon/unsterilized-cat-icon.png' alt='unsterilized cat' width={25} height={25} />
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