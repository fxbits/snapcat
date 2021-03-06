import {
  ActionIcon,
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
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { InterestZoneProviderContext } from '../Providers/ZoneProvider';
import { showNotification } from '@mantine/notifications';
import { Trash } from 'tabler-icons-react';

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
  volunteerName?: string | null;
  hospitalizationDate?: Date | null;
  releaseDate?: Date | null;
}

const MAX_SIZE = 16 * 1024 ** 2;

export interface CatImage {
  id: string,
  imageString: string
}

export default function CatModalView({
  cat,
  modal,
  setModal
}: {
  cat: Cat | undefined;
  modal: ModalConfig;
  setModal: (modal: ModalConfig | undefined) => void;
  zoneId: string;
}) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [existingImages, setExistingImages] = useState<CatImage[]>([]);
  const [imageFormData, setImageFormData] = useState<FormData>(new FormData());
  const { t } = useTranslation('common');
  const deletedImages = useRef<string[]>([]);
  const nameRegex = /^[\p{Letter} -]+$/gu
  const { interestZone } = useContext(InterestZoneProviderContext);
  const { data, error } = useSWR<any[]>(
    cat?._id ? `/api/interest-zones/${interestZone?._id}/${cat._id!}/images` : null
  );
  const form = useForm<FormValues>({
    initialValues: {
      gender: Gender.UNKNOWN,
      observations: '',
      mediaLinks: [],
      ...(cat ?? {}),
      volunteerName: (cat as SterilizedCat)?.volunteerName ?? '',
      hospitalizationDate: (cat as SterilizedCat)?.hospitalizationDate ? new Date((cat as SterilizedCat)?.hospitalizationDate) : undefined,
      releaseDate: (cat as SterilizedCat)?.releaseDate ? new Date((cat as SterilizedCat)?.releaseDate) : undefined,
      sterilizedStatus: (cat as SterilizedCat)?.volunteerName !== undefined ? 'sterilized' : 'unsterilized',
    },
    validationRules: {
      observations: (value) => value.length > 0 || (value.length === 0 && existingImages.length > 0),
      hospitalizationDate: (value, other) => value ? (value! <= other?.releaseDate! || value! <= new Date()) : (other?.sterilizedStatus === 'unsterilized' || modal.type === 'ADD_CAT'),
      releaseDate: (value, other) => value ? (value! <= new Date() && other?.hospitalizationDate! <= value!) : (other?.sterilizedStatus === 'unsterilized' || modal.type === 'ADD_CAT'),
      volunteerName: (value, other) => (other?.sterilizedStatus === 'sterilized' && modal.type !== 'ADD_CAT') ? (nameRegex.test(value!)) : (other?.sterilizedStatus === 'unsterilized' || modal.type === 'ADD_CAT')
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
    deletedImages.current = [];
  }, []);

  useEffect(() => {
    modal.type === 'STERILIZE_CAT' && form.setFieldValue('sterilizedStatus', 'sterilized');
    if (modal.type !== 'ADD_CAT') {
      GetImages().then((resp) => setExistingImages(resp));
    } else setExistingImages([]);
    setImageFormData(new FormData());
    deletedImages.current = [];
  }, [modal, data]);

  const removeImage = (imageID: string) => {
    setExistingImages(existingImages.filter((item) => item.id !== imageID))
    deletedImages.current.push(imageID);
  }

  const handleImageUpload = async (files: File[]) => {
    const compressedFile = await CompressImage(files[0]);
    imageFormData.append('images', compressedFile, compressedFile.name);
    setImageFormData(imageFormData);

    const reader = new FileReader();
    reader.readAsDataURL(compressedFile);
    reader.onload = () => {
      const binaryStr = reader.result as string;
      setExistingImages([...existingImages, {id: '', imageString: binaryStr}]);
    };
  }

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
          UpdateCat(form.values, imageFormData, deletedImages.current);
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
          {existingImages.map((item: CatImage, index) => {
            const imageString = item.imageString.includes('data:') ? item.imageString : `data:image/png;base64,${item.imageString}`;
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
                  {modal.type === 'EDIT_CAT' && item.id !== '' && (<ActionIcon
                    sx={{
                      position: 'absolute',
                      top: 'calc(50% - 20px)',
                      left: 'calc(50% - 20px)'
                    }}
                    size='xl'
                    onClick={() => {
                      removeImage(item.id);
                    }}
                    radius='md'
                    variant='outline'
                    color='yellow'
                    >
                    <Trash size={40} />
                  </ActionIcon>)}
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
                onDrop={(files) => handleImageUpload(files)}
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
                {...modal.type !== 'ADD_CAT' && form.getInputProps('volunteerName')}
                onChange={(e) => form.setFieldValue('volunteerName', e.currentTarget.value)}
                disabled={disabled}
                placeholder={t('components.catModal.catModalView.yourName')}
                label={t('components.catModal.catModalView.volunteer')}
                required = {modal.type !== 'ADD_CAT'}
              />
              <Group mt='xs' grow>
                <DatePicker
                  {...modal.type !== 'ADD_CAT' && form.getInputProps('hospitalizationDate')}
                  onChange={(e) => form.setFieldValue('hospitalizationDate', e)}
                  disabled={disabled}
                  placeholder={t('components.catModal.catModalView.pickData')}
                  required = {modal.type !== 'ADD_CAT'}
                  label={t('components.catModal.catModalView.admitted')}
                  maxDate={form.values.releaseDate ?? new Date()}
                />
                <DatePicker
                  {...modal.type !== 'ADD_CAT' && form.getInputProps('releaseDate')}
                  onChange={(e) => form.setFieldValue('releaseDate', e)}
                  disabled={disabled}
                  placeholder={t('components.catModal.catModalView.pickData')}
                  required = {modal.type !== 'ADD_CAT'}
                  label={t('components.catModal.catModalView.release')}
                  minDate={form.values.hospitalizationDate ?? undefined}
                  maxDate={new Date()}
                />
              </Group>
            </>
          )}
        </Stack>
      </Box>
    </>
  );
}
