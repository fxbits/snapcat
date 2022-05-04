import React, { useState } from 'react';
import {
  ActionIcon,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Title,
  useMantineTheme,
  Collapse
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
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [deletePressed, setDeletePressed] = useState<boolean>(false);
  const theme = useMantineTheme();
  const { t } = useTranslation('common');
  return (
    <>
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
            onClick={() => {
              if (modal.type === 'VIEW_ZONE') {
                setDeletePressed(false);
                setModal(undefined);
              }
              else setConfirmationVisible(true);
            }}
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
              {t(`status.${zone?.status}`)}
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
              { value: Status.TODO, label: t(`status.${Status.TODO}`) },
              { value: Status.INPROGRESS, label: t(`status.${Status.INPROGRESS}`) },
              { value: Status.DONE, label: t(`status.${Status.DONE}`) },
            ]}
            defaultValue={t(`status.${zone?.status}`)}></Select>
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
            onClick={() => {
              setDeletePressed(true);
              setConfirmationVisible(true)
            }}
            size='xl'
            radius='md'
            color='dark'
            variant='outline'>
            <TrashIcon />
          </ActionIcon>
        </Group>
      </Group>
      <Collapse in={confirmationVisible}  transitionDuration={500} transitionTimingFunction='ease'>
        <Stack sx={{backgroundColor: '#C393B0', width: '100%', marginTop: '2px'}} spacing='xs'>
          {!deletePressed && (<Text align='center' color='white' size='xs' mt='sm'>
          {t('components.modalManager.interestZoneModal.confirmation.discardMessage')}
          </Text>)}
          {deletePressed && (<Text align='center' color='white' size='xs' mt='sm'>
          {t('components.modalManager.interestZoneModal.confirmation.deleteMessage')}
          </Text>)}
          <Group align='center' position='center' pb='md'>
              <Button 
                onClick={
                  () => {
                    setDeletePressed(false);
                    setConfirmationVisible(false)
                  }
                }
                radius='md' 
                variant='outline' 
                sx={{color: '#FFFFFF', borderColor: '#FFFFFF', fontSize: '14px', width: '140px'}}>
                   {t('components.modalManager.interestZoneModal.confirmation.cancel')}
              </Button>
              <Button 
                onClick={
                  () => {
                    if (deletePressed) {
                      deleteZone();
                    }
                    setModal(undefined);
                  }
                }
                radius='md' 
                variant='outline' 
                sx={{color: '#FFFFFF', borderColor: '#FFFFFF', fontSize: '14px', width: '140px'}}>
                  {t('components.modalManager.interestZoneModal.confirmation.yes')}
              </Button>
          </Group>
        </Stack>
      </Collapse>
    </>
  );
}
