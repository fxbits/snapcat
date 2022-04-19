import {
  Box,
  createStyles,
  Grid,
  Group,
  SegmentedControl,
  Stack,
  Textarea,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Image from 'next/image';
import { Cat, Gender, SterilizedCat } from '../../models/cat.model';
import { ModalConfig } from '../Providers/ModalProvider';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { dropzoneChildren } from './Dropzone/Dropzone';
import { useForm } from '@mantine/hooks';
import CatModalHeader from './CatModalHeader';
import { useSWRConfig } from 'swr';
import useCatActions from './useCatActions';
import { useEffect } from 'react';

const useStyles = createStyles((theme) => ({
  modal: {
    height: '100%',
    backgroundColor: theme.colors.yellow[3],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    gap: theme.spacing.xl,
    borderRadius: theme.spacing.sm,
    [theme.fn.largerThan('md')]: { flexDirection: 'row' },
  },
}));

type SterializeStatus = 'sterilized' | 'unsterilized';

export interface FormValues {
  gender: Gender;
  observations: string;
  mediaLinks: string[];
  sterilizedStatus: SterializeStatus;
  volunteerName?: string;
  hospitalizationDate?: Date;
  releaseDate?: Date;
}

const MAX_SIZE = 3 * 1024 ** 2;

export default function CatModalView({
  cat,
  modal,
  setModal,
}: {
  cat: Cat | undefined;
  modal: ModalConfig;
  setModal: (modal: ModalConfig | undefined) => void;
  zoneId: string;
}) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const form = useForm<FormValues>({
    initialValues: {
      gender: Gender.UNKNOWN,
      observations:
        'Enter here any observations, notes, that might help identify the cat more accurately.',
      mediaLinks: [],
      ...(cat ?? {}),
      volunteerName: (cat as SterilizedCat)?.volunteerName || '',
      hospitalizationDate: new Date((cat as SterilizedCat)?.hospitalizationDate || Date.now()),
      releaseDate: new Date((cat as SterilizedCat)?.releaseDate || Date.now()),
      sterilizedStatus: (cat as SterilizedCat)?.releaseDate ? 'sterilized' : 'unsterilized',
    },
  });

  useEffect(() => {
    modal.type === 'STERILIZE_CAT' && form.setFieldValue('sterilizedStatus', 'sterilized');
  }, [modal]);

  const disabled = !(
    modal.type === 'ADD_CAT' ||
    modal.type === 'EDIT_CAT' ||
    modal.type === 'STERILIZE_CAT'
  );
  const { AddCat, UpdateCat, DeleteCat, SterilizeCat } = useCatActions(cat?._id!);
  return (
    <>
      <CatModalHeader
        modal={modal}
        setModal={setModal}
        addCat={() => AddCat(form.values)}
        updateCat={() => UpdateCat(form.values)}
        deleteCat={() => DeleteCat()}
        sterilizeCat={() => SterilizeCat(form.values)}
      />
      <Box p='md' pb='xl' mb='xl' className={classes.modal}>
        <Grid sx={{ width: '100%', [theme.fn.largerThan('md')]: { width: '50%' } }}>
          <Grid.Col sm={6} lg={6}>
            <Box
              sx={{
                width: '100%',
                height: '30vh',
                position: 'relative',
                borderRadius: theme.radius.lg,
                overflow: 'hidden',
              }}>
              <Image
                src='/images/placeholder-cat.webp'
                layout='fill'
                alt='Cat Picture'
                objectFit='cover'
              />
            </Box>
          </Grid.Col>
          <Grid.Col sm={6} lg={6}>
            <Dropzone
              sx={{
                width: '100%',
                height: '30vh',
                borderColor: !disabled ? theme.colors.green[3] : theme.colors.gray[3],
                borderRadius: theme.radius.lg,
                backgroundColor: !disabled ? theme.colors.green[2] : theme.colors.gray[3],
                '&:hover': {
                  backgroundColor: !disabled ? theme.colors.green[3] : theme.colors.gray[3],
                },
              }}
              disabled={disabled}
              onDrop={() => {}}
              //TODO: add image upload
              maxSize={MAX_SIZE}
              accept={IMAGE_MIME_TYPE}>
              {(status) => dropzoneChildren(status, theme)}
            </Dropzone>
          </Grid.Col>
        </Grid>
        <Stack sx={{ height: '100%', width: '100%', flex: 1 }} justify='center'>
          <SegmentedControl
            color='blue'
            disabled={disabled}
            {...form.getInputProps('gender')}
            onChange={(e) => form.setFieldValue('gender', e as Gender)}
            data={[
              { label: 'Female', value: 'female' },
              { label: 'Male', value: 'male' },
            ]}
          />
          <SegmentedControl
            disabled={modal.type !== 'ADD_CAT'}
            {...form.getInputProps('sterilizedStatus')}
            onChange={(e) => form.setFieldValue('sterilizedStatus', e as SterializeStatus)}
            data={[
              { label: 'Sterilized', value: 'sterilized' },
              { label: 'Unsterilized', value: 'unsterilized' },
            ]}
          />
          <Textarea
            disabled={disabled}
            minRows={6}
            {...form.getInputProps('observations')}
            onChange={(e) => form.setFieldValue('observations', e.currentTarget.value)}
            label='Observations'
          />
          {form.values.sterilizedStatus === 'sterilized' && (
            <>
              <TextInput
                {...form.getInputProps('volunteerName')}
                onChange={(e) => form.setFieldValue('volunteerName', e.currentTarget.value)}
                disabled={disabled}
                placeholder='Your name'
                label='Volunteer'
                required
              />
              <Group mt='xs' grow>
                <DatePicker
                  {...form.getInputProps('hospitalizationDate')}
                  onChange={(e) => form.setFieldValue('hospitalizationDate', e || new Date())}
                  disabled={disabled}
                  placeholder='Pick date'
                  required
                  label='Admitted'
                />
                <DatePicker
                  {...form.getInputProps('releaseDate')}
                  onChange={(e) => form.setFieldValue('releaseDate', e || new Date())}
                  disabled={disabled}
                  placeholder='Pick date'
                  required
                  label='Release'
                />
              </Group>
            </>
          )}
        </Stack>
      </Box>
    </>
  );
}
