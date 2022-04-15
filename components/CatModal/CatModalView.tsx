import {
  Box,
  Center,
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
import React, { useState } from 'react';
import { Cat, Gender, SterilizedCat } from '../../models/cat.model';
import { ModalConfig } from '../Providers/ModalProvider';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { dropzoneChildren } from '../Dropzone/Dropzone';
import { useForm } from '@mantine/hooks';

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

interface FormValues {
  gender: Gender;
  observations: string;
  mediaLinks: string[];
  sterilizeStatus: SterializeStatus;
  volunteerName?: string;
  hospitalizationDate?: Date;
  releaseDate?: Date;
}

export default function CatModalView({ cat, modal }: { cat: Cat; modal: ModalConfig }) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const disabled = !(modal.type === 'ADD_CAT' || modal.type === 'EDIT_CAT');

  const form = useForm<FormValues>({
    initialValues: {
      ...(cat || {
        gender: Gender.UNKNOWN,
        observations:
          'Enter here any observations, notes, that might help identify the cat more accurately.',
        mediaLinks: [],
      }),
      hospitalizationDate: new Date((cat as SterilizedCat)?.hospitalizationDate || ''),
      releaseDate: new Date((cat as SterilizedCat)?.releaseDate || ''),
      sterilizeStatus: (cat as SterilizedCat)?.releaseDate ? 'sterilized' : 'unsterilized',
    },
  });

  return (
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
              borderRadius: theme.radius.lg,
              backgroundColor: !disabled ? theme.colors.blue[1] : theme.colors.gray[3],
              '&:hover': {
                backgroundColor: !disabled ? theme.colors.blue[2] : theme.colors.gray[3],
              },
            }}
            disabled={disabled}
            onDrop={() => {}}
            //TODO: add image upload
            maxSize={3 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}>
            {(status) => dropzoneChildren(status, theme)}
          </Dropzone>
        </Grid.Col>
      </Grid>
      <form
        style={{ width: '100%', flex: 1 }}
        onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack sx={{ height: '100%' }} justify='center'>
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
            disabled={disabled}
            {...form.getInputProps('sterilizeStatus')}
            onChange={(e) => form.setFieldValue('sterilizeStatus', e as SterializeStatus)}
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
          {form.values.sterilizeStatus === 'sterilized' && (
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
      </form>
    </Box>
  );
}
