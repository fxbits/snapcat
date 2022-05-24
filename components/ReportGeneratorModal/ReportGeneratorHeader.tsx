import { ActionIcon, Group, Title, useMantineTheme, Text } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { ArrowLeft } from 'tabler-icons-react';
import { ModalConfig } from '../Providers/ModalProvider'


export default function ReportGeneratorHeader  ({modal, setModal} : {modal: ModalConfig, setModal: (modal: ModalConfig | undefined) => void; }) {
    const theme = useMantineTheme();
    const { t } = useTranslation('common');
    
    return(
        <>
        <Group
        p='md'
        position='apart'
        align='center'
        sx={{ width: '100%', [theme.fn.smallerThan('xs')]: { justifyContent: 'flex-start' } }}>
            <Group spacing='sm' position='left' sx={{ height: '100%' }}>
                <ActionIcon
                onClick={() => setModal(undefined)}
                variant='filled'
                size='xl'
                color='yellow'>
                    <ArrowLeft size={50} />
                </ActionIcon>
                <Title
                sx={{ fontWeight: 600, [theme.fn.smallerThan('xs')]: { display: 'none' } }}
                order={5}>
                {t('components.modalManager.interestZoneModal.back')}
                </Title>
            </Group>
            <Text size='xl'>{t('components.reportGeneratorModal.reportGeneratorHeader.title')}</Text>
        </Group>
        </>
    )
};
