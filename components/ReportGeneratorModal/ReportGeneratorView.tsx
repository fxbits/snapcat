import { Box, Button, createStyles, Group, Stack, Table, Text, TextInput, useMantineTheme } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/hooks';
import { useTranslation } from 'next-i18next';
import { useContext, useRef, useState } from 'react';
import { ModalContext } from '../Providers/ModalProvider';
import ReportGeneratorHeader from './ReportGeneratorHeader';
import { CSVLink } from "react-csv";
import useReportActions from './useReportActions';
import { showNotification } from '@mantine/notifications';

const useStyles = createStyles((theme) => ({
    modal: {
      height: '100%',
      backgroundColor: theme.colors.yellow[2] + 'd6',
      backdropFilter: 'blur(15px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'stretch',
      gap: theme.spacing.xl,
      borderRadius: theme.spacing.sm,
      [theme.fn.largerThan('md')]: { flexDirection: 'row' },
    },
}));

export interface ReportRecord {
    observations: string,
    gender: string,
    hospitalizationDate: string,
    releaseDate: string,
    volunteerName: string, 
    place: string
}

export interface FormValuesReport {
    admissionDate: Date,
    releaseDate: Date,
    fileName: string
};


function ReportGeneratorView() {
    const { modal, setModal } = useContext(ModalContext);
    const [rows, setRows] = useState<any[]>([]);
    const [csvOperationsVisible, setCsvOperationsVisible] = useState<boolean>(false);
    const { classes } = useStyles();
    const { t } = useTranslation('common');
    const theme = useMantineTheme();
    const csvRecords = useRef<ReportRecord[]>([]);
    const headers = [
        {label: t('components.reportGeneratorModal.reportGeneratorView.headers.observations'), key: 'observations'},
        {label: t('components.reportGeneratorModal.reportGeneratorView.headers.gender'), key: 'gender'},
        {label: t('components.reportGeneratorModal.reportGeneratorView.headers.hospitalizationDate'), key: 'hospitalizationDate'},
        {label: t('components.reportGeneratorModal.reportGeneratorView.headers.releaseDate'), key: 'releaseDate'},
        {label: t('components.reportGeneratorModal.reportGeneratorView.headers.volunteerName'), key: 'volunteerName'},
        {label: t('components.reportGeneratorModal.reportGeneratorView.headers.place'), key: 'place'},
    ]
    const { GenerateReport } = useReportActions();

    const handleReportGenerated = async () => {
        if (!form.validate()) return;
        csvRecords.current = await GenerateReport(form.values);
        setCsvOperationsVisible(true);
        showNotification({
            title: t('components.reportGeneratorModal.reportGeneratorView.notification.title'),
            message: t('components.reportGeneratorModal.reportGeneratorView.notification.message'),
            color: 'green',
        });
        setRows([]);
    }

    const handleViewReport = () => {
        if (!rows.length) {
            setRows([...csvRecords.current.slice(0, 10).map((record, index) => {
                return (
                    <tr key={index}>
                        <td>{record.observations}</td>
                        <td>{record.gender}</td>
                        <td>{record.hospitalizationDate}</td>
                        <td>{record.releaseDate}</td>
                        <td>{record.volunteerName}</td>
                        <td>{record.place}</td>
                    </tr>
                )
            }), csvRecords.current.length > 10 && (
                <tr>
                    <td colSpan={headers.length} align='center' color='red'>
                        {t('components.reportGeneratorModal.reportGeneratorView.pageText.manyRecords')}
                    </td>
                </tr>
            )]);
        } else {
            setRows([]);
        }
    }

    const form = useForm<FormValuesReport>({
        initialValues: {
            admissionDate: new Date(),
            releaseDate: new Date(),
            fileName: ''
        },
        validationRules: {
            admissionDate: (value, other) => value ? value! <= other?.releaseDate! || value! <= new Date() : true,
            releaseDate: (value, other) => value ? value! <= new Date() && other?.admissionDate! <= value! : true,
            fileName: (value) => value.length > 0
        },
        errorMessages: {
            admissionDate: t('components.catModal.catModalView.validations.hospitalizationDate'),
            releaseDate: t('components.catModal.catModalView.validations.releaseDate'),
            fileName: t('components.reportGeneratorModal.reportGeneratorView.validations.fileName')
          }
    });

    return (
        <>
            <ReportGeneratorHeader modal={modal!} setModal={setModal}></ReportGeneratorHeader>
            <Box 
            p='sm' 
            pb='xl' 
            mb='md' 
            className={classes.modal}
            component="div"
            >
                <Stack align='center' spacing={0} sx={{ width: '100%', height: '100%', alignItems: 'center'}}>
                    <Group mt='xs' grow spacing='xs'>
                        <DatePicker
                        {...form.getInputProps('admissionDate')}
                        onChange={(e) => form.setFieldValue('admissionDate', e || new Date())}
                        placeholder={t('components.catModal.catModalView.pickData')}
                        required
                        autoFocus
                        label={t('components.reportGeneratorModal.reportGeneratorView.pageText.startDate')}
                        />
                        <DatePicker
                        {...form.getInputProps('releaseDate')}
                        onChange={(e) => form.setFieldValue('releaseDate', e || new Date())}
                        placeholder={t('components.catModal.catModalView.pickData')}
                        required
                        label={t('components.reportGeneratorModal.reportGeneratorView.pageText.endDate')}
                        />
                    </Group>
                    <Group mt='xs' spacing='xs' grow>
                        <TextInput
                        {...form.getInputProps('fileName')}
                        onChange={(e) => form.setFieldValue('fileName', e.currentTarget.value)}
                        placeholder='data'
                        label={t('components.reportGeneratorModal.reportGeneratorView.pageText.fileName')}
                        required
                        />
                    </Group>
                    <Button 
                    color='dark' 
                    variant="subtle" 
                    radius='md' 
                    size='md'
                    uppercase
                    mt='xs'
                    sx={{
                    '&:hover': {
                        backgroundColor: theme.colors.yellow[0],
                    },
                    }}
                    onClick={handleReportGenerated}>
                        {t('components.reportGeneratorModal.reportGeneratorView.pageText.generate')}
                    </Button>
                    {csvOperationsVisible && (
                        <Group position='apart'>
                            <Text onClick={handleViewReport} sx={{ cursor: 'pointer'}}>
                                View report
                            </Text>
                            <CSVLink data={csvRecords.current} headers={headers} filename={form.values.fileName}>
                                {t('components.reportGeneratorModal.reportGeneratorView.pageText.download')}
                            </CSVLink>
                        </Group>
                    )}
                    {rows.length > 0 && 
                        <Table>
                            <thead>
                                <tr>
                                    {headers.map((item, index) => <th key={index}>{item.label}</th>)}
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </Table>
                    }
                </Stack>
            </Box>
        </>
    )
}

export default ReportGeneratorView;