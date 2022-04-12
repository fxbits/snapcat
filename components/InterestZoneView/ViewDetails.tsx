import { InterestZone } from '../../models/zone.model';
import { Phone } from 'tabler-icons-react';
import { Box, Group, Stack, Container, Text } from '@mantine/core';
import Image from 'next/image';

interface Props{
    zone?: Partial<InterestZone>,
}

const ViewDetails = (props: Props) => {
    return(
        <Container m="xs" p="xs" >
            <Group position='apart' align='flex-start'>
                <Box sx={{width: '55%'}}>
                    <Group sx={{width: '100%'}}>
                        <Image src='/icon/location-icon.png' alt='location icon' width={16} height={23}></Image>
                        <Stack spacing={0} sx={{width: '80%'}}>
                            <Text weight={400} sx={{maxWidth: '100%'}}>
                                {props.zone?.address?.name}
                            </Text>
                            <Text color="gray" size='xs'>
                                {props.zone?.address?.lat} {props.zone?.address?.lng}
                            </Text>
                        </Stack>
                    </Group>
                    <Group mt='xs'>
                        <Group spacing='xs'>
                            <Image src='/icon/sterilized-cat-icon.png' alt='sterilized cat' width={25} height={25}></Image>
                            <Text weight={400}>
                                {props.zone?.sterilizedCats?.length}
                            </Text>
                        </Group>
                        <Group spacing='xs'>
                            <Image src='/icon/unsterilized-icon.png' alt='unsterilized cat' width={25} height={25}></Image>
                            <Text weight={400}>
                                {props.zone?.unsterilizedCats?.length}
                            </Text>
                        </Group>
                    </Group>
                    <Text mt='md' color='gray' size='xs'> Volunteer </Text>
                    <Text size='sm'> {props.zone?.volunteerName || "Alex Pirvu"} </Text>
                </Box>
                <Stack spacing={0} sx={{width: '35%', textAlign: 'left'}}>
                    <Text size='xs'>
                        Contact
                    </Text>
                    <Text size='sm'>
                        {props.zone?.contactPerson?.name || "Pati Vulc"}
                    </Text>
                    <Group spacing='xs'>
                        <Phone size={18} strokeWidth={2} color={'black'}/>
                        <Text size='sm'>{props.zone?.contactPerson?.phone || "+40712345678"}</Text>
                    </Group>
                </Stack>
            </Group>
        </Container>
    );
}

export default ViewDetails;
