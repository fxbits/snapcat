import { InterestZone, Status } from '../../models/zone.model';
import { InterestZoneProviderContext } from '../Providers/ProviderZone';
import styles from './InterestZoneElement.module.css';

import { Box, Button, Container, Group, Stack, Text } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';

interface Props {
    interestZone: InterestZone;
}

const InterestZoneElement = ({interestZone}: Props) => {
    const {setInterestZone} = useContext(InterestZoneProviderContext);
    const {_id, address, noUnsterilizedCats, observations, status, sterilizedCats, unsterilizedCats, volunteerName, contactPerson} = interestZone;
    const [statusColor, setStatusColor] = useState<string>('');

    useEffect(() => {
        if (status === Status.DONE) setStatusColor('#B0EF8F');
        else if (status === Status.INPROGRESS) setStatusColor('#FFDB3C');
        else setStatusColor('#EF8F8F');
    }, []);

    return (
        <Container m="xs" p="xs" sx={{border: "2px solid #DBDBDB", borderRadius: '7px'}} onClick={() => {setInterestZone(interestZone);}}>
           <Group position='apart' align='flex-start'>
                <Box>
                    <Group>
                        <Image src='/icon/location-icon.png' width={20} height={25}></Image>
                        <Stack spacing={0}>
                            <Text>
                                {address.name}
                            </Text>
                            <Text color="gray" size='xs'>
                                {address.lat} {address.lng}
                            </Text>
                        </Stack>
                    </Group>
                    <Group mt='xs'>
                        <Group spacing='xs'>
                            <Image src='/icon/sterilized-cat-icon.png ' width={20} height={20}></Image>
                            <Text>
                                {sterilizedCats.length}
                            </Text>
                        </Group>
                        <Group spacing='xs'>
                            <Image src='/icon/unsterilized-icon.png ' width={20} height={20}></Image>
                            <Text>
                                {unsterilizedCats.length}
                            </Text>
                        </Group>
                    </Group>
                    <Text mt='xs' color='gray'>
                       Volunteer 
                    </Text>
                    <Text>
                        Alexandru 
                    </Text>
                </Box>
                <Stack spacing={0}>
                    <Text weight={500} mb='xs' sx={{background: statusColor, textAlign: 'center', borderRadius: '7px'}}>
                        {status}
                    </Text>
                    <Image src='/icon/unsterilized-cat-icon-big.png' width={80} height={90}></Image>
                    <Text color='gray'>
                        around {noUnsterilizedCats??0} cats
                    </Text>
                </Stack>
           </Group>
        </Container>
    );
};

export default InterestZoneElement;
