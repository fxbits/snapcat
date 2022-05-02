import React from 'react';
import {
  ActionIcon,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { InterestZone, Status } from '../../models/zone.model';
import { ModalConfig } from '../Providers/ModalProvider';
import { FormValues } from './InterestZoneView';
import { UseForm } from '@mantine/hooks/lib/use-form/use-form';
import { EditIcon, SaveIcon, TrashIcon } from '../Icons/Icons';
import { ArrowLeft, Plus } from 'tabler-icons-react';

import { useTranslation } from 'next-i18next';
export default function ZoneModalHeader({
  modal,
  zone,
  setModal,
  addZone,
  updateZone,
  deleteZone,
  form,
}: {
  modal: ModalConfig;
  zone: InterestZone | Partial<InterestZone>;
  setModal: (modal: ModalConfig | undefined) => void;
  addZone: () => void;
  updateZone: () => void;
  deleteZone: () => void;
  form: UseForm<FormValues>;
}) {
  const theme = useMantineTheme();
  const { t } = useTranslation('common');
  return (
    <Group
      p='md'
      position='apart'
      align='center'
      sx={{ width: '100%', [theme.fn.smallerThan('xs')]: { justifyContent: 'flex-start' } }}>
      <Group spacing='sm' sx={{ height: '100%' }}>
        <Button
          sx={{ paddingLeft: 0, color: 'black' }}
          color='yellow'
          size='md'
          leftIcon={<ArrowLeft size={50} />}
          onClick={() => setModal(undefined)}
          variant='subtle'>
          <Title
            sx={{ fontWeight: 600, [theme.fn.smallerThan('xs')]: { display: 'none' } }}
            order={5}>
            {t('components.modalManager.interestZoneModal.back')}
          </Title>
        </Button>
      </Group>
      {modal.type === 'VIEW_ZONE' ? (
        <Stack spacing={0} align='center'>
          <Text size='sm'>Status</Text>
          <Text size='lg' inline sx={{ textTransform: 'uppercase' }}>
            {t(`${zone?.status}`)}
          </Text>
        </Stack>
      ) : (
        <Select
          {...form.getInputProps('status')}
          radius='md'
          size='md'
          styles={{
            input: {
              backgroundColor: theme.colors.yellow[5],
              fontSize: theme.fontSizes.md,
              textTransform: 'uppercase',
              border: '2px solid black',
              width: '170px',
              textAlign: 'center',
            },
            dropdown: {
              border: '2px solid',
              borderColor: theme.colors.yellow[3],
            },
            hovered: {
              backgroundColor: theme.colors.yellow[1],
            },
            selected: {
              backgroundColor: theme.colors.yellow[2],
              color: theme.colors.yellow[7],
            },
          }}
          onChange={(e) => form.setFieldValue('status', e as Status)}
          data={[
            { value: Status.TODO, label: t('To Do') },
            { value: Status.INPROGRESS, label: t('In Progress') },
            { value: Status.DONE, label: t('Done') },
          ]}
          defaultValue={t(`${zone?.status}`)}></Select>
      )}
      <Group spacing='xs'>
        {modal.type === 'VIEW_ZONE' && (
          <ActionIcon
            color='dark'
            onClick={() => setModal({ ...modal, type: 'EDIT_ZONE' })}
            size='xl'
            radius='md'
            variant='outline'>
            <EditIcon />
          </ActionIcon>
        )}
        {modal.type === 'EDIT_ZONE' && (
          <ActionIcon
            onClick={() => updateZone()}
            size='xl'
            color='dark'
            radius='md'
            variant='outline'>
            <SaveIcon />
          </ActionIcon>
        )}
        {modal.type === 'ADD_ZONE' && (
          <ActionIcon onClick={() => addZone()} size='xl' color='dark' radius='md' variant='filled'>
            <Plus size={40} />
          </ActionIcon>
        )}
        <ActionIcon
          onClick={() => deleteZone()}
          size='xl'
          radius='md'
          color='dark'
          variant='outline'>
          <TrashIcon />
        </ActionIcon>
      </Group>
    </Group>
  );
}
