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
import { useEffect, useState } from 'react';

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

const MAX_SIZE = 2 * 1024 ** 2;

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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFormData, setImageFormData] = useState<FormData>(new FormData());
  const form = useForm<FormValues>({
    initialValues: {
      gender: Gender.UNKNOWN,
      observations: '',
      mediaLinks: [],
      ...(cat ?? {}),
      volunteerName: (cat as SterilizedCat)?.volunteerName || '',
      hospitalizationDate: new Date((cat as SterilizedCat)?.hospitalizationDate || Date.now()),
      releaseDate: new Date((cat as SterilizedCat)?.releaseDate || Date.now()),
      sterilizedStatus: (cat as SterilizedCat)?.releaseDate ? 'sterilized' : 'unsterilized',
    },
  });

  useEffect(() => {
    if (modal.type !== 'ADD_CAT') {
      GetImages().then((resp) => setExistingImages(resp));
    } else setExistingImages([]);
    setImageFormData(new FormData());
  }, []);

  useEffect(() => {
    modal.type === 'STERILIZE_CAT' && form.setFieldValue('sterilizedStatus', 'sterilized');
    if (modal.type !== 'ADD_CAT') {
      GetImages().then((resp) => setExistingImages(resp));
    } else setExistingImages([]);
    setImageFormData(new FormData());
  }, [modal]);

  const addImageToCat = (files: any) => {
    imageFormData.append('images', files[0], files[0].name);
    setImageFormData(imageFormData);

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      const binaryStr = reader.result as string;
      setExistingImages([...existingImages, binaryStr]);
    };
  };

  const disabled = !(
    modal.type === 'ADD_CAT' ||
    modal.type === 'EDIT_CAT' ||
    modal.type === 'STERILIZE_CAT'
  );
  const { AddCat, UpdateCat, DeleteCat, SterilizeCat, GetImages, AddImages } = useCatActions(
    cat?._id!
  );
  return (
    <>
      <CatModalHeader
        modal={modal}
        setModal={setModal}
        addCat={() => AddCat(form.values, imageFormData)}
        updateCat={() => UpdateCat(form.values, imageFormData)}
        deleteCat={() => DeleteCat()}
        sterilizeCat={() => SterilizeCat(form.values)}
      />
      <Box p='md' pb='xl' mb='xl' className={classes.modal}>
        <Grid sx={{ width: '100%', [theme.fn.largerThan('md')]: { width: '50%' } }}>
          {existingImages.map((item: string, index) => {
            const imageString = item.includes('data:') ? item : `data:image/png;base64,${item}`;
            return (
              <Grid.Col sm={6} lg={6} key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: theme.radius.lg,
                    overflow: 'hidden',
                  }}>
                  <Image
                    src={imageString}
                    width={300}
                    height={300}
                    alt='Cat Picture'
                    objectFit='contain'
                  />
                </Box>
              </Grid.Col>
            );
          })}
          {existingImages.length < 3 && (
            <Grid.Col sm={6} lg={6}>
              <Dropzone
                sx={{
                  aspectRatio: '1',
                  width: '100%',
                  borderColor: !disabled ? theme.colors.green[3] : theme.colors.gray[3],
                  borderRadius: theme.radius.lg,
                  backgroundColor: !disabled ? theme.colors.yellow[1] : theme.colors.gray[3],
                  '&:hover': {
                    backgroundColor: !disabled ? theme.colors.yellow[2] : theme.colors.gray[3],
                  },
                }}
                disabled={disabled}
                onDrop={(files) => addImageToCat(files)}
                onReject={() => alert('Imaginea este prea mare.')}
                maxSize={MAX_SIZE}
                multiple={false}
                accept={IMAGE_MIME_TYPE}>
                {(status) => dropzoneChildren(status, theme)}
              </Dropzone>
            </Grid.Col>
          )}
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
            placeholder='Enter here any observations, notes, that might help identify the cat more accurately.'
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
