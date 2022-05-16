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
import useSWR from 'swr';
import useCatActions from './useCatActions';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { InterestZoneProviderContext } from '../Providers/ZoneProvider';
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

const MAX_SIZE = 16 * 1024 ** 2;

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
  const { t } = useTranslation('common');
  const nameRegex = /^[\p{Letter} -]+$/gu
  const { interestZone } = useContext(InterestZoneProviderContext);
  const { data, error } = useSWR<any[]>(
    cat?._id ? `/api/interest-zones/${interestZone?._id}/${cat._id!}/images` : null
  );
  const form = useForm<FormValues>({
    initialValues: {
      gender: Gender.UNKNOWN,
      observations: '',
      mediaLinks: existingImages,
      ...(cat ?? {}),
      volunteerName: (cat as SterilizedCat)?.volunteerName || '',
      hospitalizationDate: new Date((cat as SterilizedCat)?.hospitalizationDate || Date.now()),
      releaseDate: new Date((cat as SterilizedCat)?.releaseDate || Date.now()),
      sterilizedStatus: (cat as SterilizedCat)?.releaseDate ? 'sterilized' : 'unsterilized',
    },
    validationRules: {
      observations: (value) => value.length > 0 || value.length === 0 && existingImages.length > 0,
      hospitalizationDate: (value, other) => value ? value! <= other?.releaseDate! || value! <= new Date() : true,
      releaseDate: (value, other) => value ? value! <= new Date() && other?.hospitalizationDate! <= value! : true,
      volunteerName: (value, other) => other?.sterilizedStatus === 'sterilized' ? (nameRegex.test(value!)) : true
    },
    errorMessages: {
      observations: t('components.catModal.catModalView.validations.observations'),
      hospitalizationDate: t('components.catModal.catModalView.validations.hospitalizationDate'),
      releaseDate: t('components.catModal.catModalView.validations.releaseDate'),
      volunteerName: t('components.catModal.catModalView.validations.volunteerName')
    }
  });

  useEffect(() => {
    if (modal.type !== 'ADD_CAT') {
      GetImages().then((resp) => setExistingImages(resp));
    } else {
      setExistingImages([]);
      form.setFieldValue('sterilizedStatus', modal.initialSterilizedStatus ? 'sterilized' : 'unsterilized')
    }
    setImageFormData(new FormData());
  }, []);

  useEffect(() => {
    modal.type === 'STERILIZE_CAT' && form.setFieldValue('sterilizedStatus', 'sterilized');
    if (modal.type !== 'ADD_CAT') {
      GetImages().then((resp) => setExistingImages(resp));
    } else setExistingImages([]);
    setImageFormData(new FormData());
  }, [modal, data]);

  const addImageToCat = async (files: any) => {
    const compressedFile = await CompressImage(files[0]);

    imageFormData.append('images', compressedFile, compressedFile.name);
    setImageFormData(imageFormData);

    const reader = new FileReader();
    reader.readAsDataURL(compressedFile);
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
  const { AddCat, UpdateCat, DeleteCat, SterilizeCat, GetImages, CompressImage } = useCatActions(
    cat?._id!
  );

  return (
    <>
      <CatModalHeader
        modal={modal}
        isSterilized={(cat as SterilizedCat)?.volunteerName !== undefined}
        setModal={setModal}
        addCat={() => {
          if (!form.validate()) return true;
          AddCat(form.values, imageFormData);
          setModal(modal.back);
          return false;
        }}
        updateCat={() => {
          if (!form.validate()) return true;
          UpdateCat(form.values, imageFormData);
          setModal({ ...modal, type: 'VIEW_CAT' });
          return false;
        }}
        deleteCat={() => DeleteCat()}
        sterilizeCat={() => {
          if (!form.validate()) return true;
          SterilizeCat(form.values, imageFormData);
          setModal(modal.back);
          return false;
        }}
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
                onReject={() => 
                  showNotification({
                    title: t('notificationTitle.imageUpload', {ns: 'errors'}),
                    message: t('incorrect.imageSize', {ns: 'errors'}),
                    color: 'red',
                  })
                }
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
              { label: t('components.catModal.catModalView.female'), value: 'female' },
              { label: t('components.catModal.catModalView.male'), value: 'male' },
            ]}
          />
          <SegmentedControl
            disabled={modal.type !== 'ADD_CAT'}
            {...form.getInputProps('sterilizedStatus')}
            onChange={(e) => form.setFieldValue('sterilizedStatus', e as SterializeStatus)}
            data={[
              { label: t('components.catModal.catModalView.sterilized'), value: 'sterilized' },
              { label: t('components.catModal.catModalView.unsterilized'), value: 'unsterilized' },
            ]}
          />
          <Textarea
            disabled={disabled}
            minRows={6}
            placeholder={t('components.catModal.catModalView.observationsPlaceholder')}
            {...form.getInputProps('observations')}
            onChange={(e) => form.setFieldValue('observations', e.currentTarget.value)}
            label={t('components.catModal.catModalView.observations')}
          />
          {form.values.sterilizedStatus === 'sterilized' && (
            <>
              <TextInput
                {...form.getInputProps('volunteerName')}
                onChange={(e) => form.setFieldValue('volunteerName', e.currentTarget.value)}
                disabled={disabled}
                placeholder={t('components.catModal.catModalView.yourName')}
                label={t('components.catModal.catModalView.volunteer')}
                required
              />
              <Group mt='xs' grow>
                <DatePicker
                  {...form.getInputProps('hospitalizationDate')}
                  onChange={(e) => form.setFieldValue('hospitalizationDate', e || new Date())}
                  disabled={disabled}
                  placeholder={t('components.catModal.catModalView.pickData')}
                  required
                  label={t('components.catModal.catModalView.admitted')}
                />
                <DatePicker
                  {...form.getInputProps('releaseDate')}
                  onChange={(e) => form.setFieldValue('releaseDate', e || new Date())}
                  disabled={disabled}
                  placeholder={t('components.catModal.catModalView.pickData')}
                  required
                  label={t('components.catModal.catModalView.release')}
                />
              </Group>
            </>
          )}
        </Stack>
      </Box>
    </>
  );
}
