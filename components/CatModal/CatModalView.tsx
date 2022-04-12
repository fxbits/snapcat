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
import { Cat, Gender } from '../../models/cat.model';
import { ModalConfig } from '../Providers/ModalProvider';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { dropzoneChildren } from '../Dropzone/Dropzone';

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

export default function CatModalView({ cat, modal }: { cat?: Cat; modal: ModalConfig }) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [statusSterialize, setStatusSterialize] = useState<SterializeStatus>('sterilized');
  const [form, setForm] = useState<Cat>(
    cat || {
      gender: Gender.FEMALE,
      observations:
        'Enter here any observations, notes, that might help identify the cat more accurately.',
      mediaLinks: [],
    }
  );
  const [sterilizedForm, setSterilizedForm] = useState({
    volunteerName: 'Xd Guy',
    hospitalizationDate: '05 October 2011 14:48 UTC',
    releaseDate: '05 October 2011 14:48 UTC',
  });

  const edit = modal.type === 'EDIT_CAT';

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
            <Image src='/images/cat.webp' layout='fill' alt='Cat Picture' objectFit='cover' />
          </Box>
        </Grid.Col>

        <Grid.Col sm={6} lg={6}>
          <Dropzone
            sx={{
              width: '100%',
              height: '30vh',
              borderRadius: theme.radius.lg,
              backgroundColor: edit ? theme.colors.blue[1] : theme.colors.gray[3],
              '&:hover': {
                backgroundColor: edit ? theme.colors.blue[2] : theme.colors.gray[3],
              },
            }}
            disabled={!edit}
            onDrop={(files) => console.log('accepted files', files)}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={3 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}>
            {(status) => dropzoneChildren(status, theme)}
          </Dropzone>
        </Grid.Col>
      </Grid>
      <Stack sx={{ height: '100%', width: '100%', flex: 1 }} justify='center'>
        <SegmentedControl
          color='blue'
          disabled={!edit}
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e as Gender })}
          data={[
            { label: 'Female', value: 'female' },
            { label: 'Male', value: 'male' },
          ]}
        />
        <SegmentedControl
          disabled={!edit}
          value={statusSterialize}
          onChange={(e) => setStatusSterialize(e as SterializeStatus)}
          data={[
            { label: 'Sterilized', value: 'sterilized' },
            { label: 'Unsterilized', value: 'unsterilized' },
          ]}
        />
        <Textarea
          disabled={!edit}
          minRows={6}
          value={form.observations}
          onChange={(e) => setForm({ ...form, observations: e.currentTarget.value })}
          label='Observations'
        />
        {statusSterialize === 'sterilized' && (
          <>
            <TextInput
              value={sterilizedForm.volunteerName}
              onChange={(e) =>
                setSterilizedForm({ ...sterilizedForm, volunteerName: e.currentTarget.value })
              }
              disabled={!edit}
              placeholder='Your name'
              label='Volunteer'
              required
            />
            <Group mt='xs' grow>
              <DatePicker
                value={new Date(sterilizedForm.hospitalizationDate)}
                onChange={(e) =>
                  setSterilizedForm({ ...sterilizedForm, hospitalizationDate: e?.toString()! })
                }
                disabled={!edit}
                placeholder='Pick date'
                required
                label='Admitted'
              />
              <DatePicker
                value={new Date(sterilizedForm.releaseDate)}
                onChange={(e) =>
                  setSterilizedForm({ ...sterilizedForm, releaseDate: e?.toString()! })
                }
                disabled={!edit}
                placeholder='Pick date'
                required
                label='Release'
              />
            </Group>
          </>
        )}
      </Stack>
    </Box>
  );
}
