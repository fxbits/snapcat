import { ActionIcon, Button, Collapse, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { ArrowLeft, Trash } from 'tabler-icons-react';
import { EditIcon, SaveIcon, ScissorIcon } from '../Icons/Icons';
import { ModalConfig } from '../Providers/ModalProvider';
import { useTranslation } from 'next-i18next';
import { showNotification } from '@mantine/notifications';

export default function CatModalHeader({
  modal,
  isSterilized,
  setModal,
  addCat,
  updateCat,
  deleteCat,
  sterilizeCat,
}: {
  modal: ModalConfig;
  isSterilized: boolean,
  setModal: (modal: ModalConfig | undefined) => void;
  addCat: () => boolean;
  updateCat: () => boolean;
  deleteCat: () => void;
  sterilizeCat: () => boolean;
}) {
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [deletePressed, setDeletePressed] = useState<boolean>(false);
  const { t } = useTranslation(['common', 'errors']);
  return (
    <>
      <Group
        p='md'
        position='apart'
        align='center'
        sx={{
          width: '100%',
          borderRadius: '15px',
        }}>
        <ActionIcon
          onClick={() => {
            if (modal.type === 'VIEW_CAT') {
              setModal(modal.back);
            }
            else {
              setConfirmationVisible(true);
            }
          }}
          variant='filled'
          size='xl'
          color='yellow'>
          <ArrowLeft size={50} />
        </ActionIcon>
        {modal.type === 'ADD_CAT' && <Text>{t('components.catModal.catModalHeader.addCat', {ns: 'common'})}</Text>}
        {modal.type === 'VIEW_CAT' && <Text>{t('components.catModal.catModalHeader.viewCat', {ns: 'common'})}</Text>}
        {modal.type === 'EDIT_CAT' && <Text>{t('components.catModal.catModalHeader.editCat', {ns: 'common'})}</Text>}
          <Group spacing='xs'>
            {modal.type === 'VIEW_CAT' &&  !isSterilized && (
              <ActionIcon
                onClick={() => {
                  setDeletePressed(false);
                  setModal({ ...modal, type: 'STERILIZE_CAT' });
                }}
                size='xl'
                color='dark'
                radius='md'
                variant='outline'>
                <ScissorIcon />
              </ActionIcon>
            )}
            {modal.type === 'VIEW_CAT' && (
              <ActionIcon
                onClick={() => {
                  setDeletePressed(false);
                  setModal({ ...modal, type: 'EDIT_CAT' })}
                }
                size='xl'
                radius='md'
                color='dark'
                variant='outline'>
                <EditIcon />
              </ActionIcon>
            )}

            {(modal.type === 'EDIT_CAT' || modal.type === 'STERILIZE_CAT') && (
              <ActionIcon
              onClick={async () => {
                setDeletePressed(false);
                try {
                  const errorStatus = modal.type === 'EDIT_CAT' ? await updateCat() : await sterilizeCat();
                  if (errorStatus) return;
                  showNotification({
                    title: t('components.catModal.catModalHeader.notification.title.update', {ns: 'common'}),
                    message: t('components.catModal.catModalHeader.notification.message.update', {ns: 'common'}),
                    color: 'green',
                  });
                } catch(error: any) {
                  showNotification({
                    title: t('notificationTitle.catUpdate', {ns: 'errors'}),
                    message: t(error.response.data.message, {ns: 'errors'}),
                    color: 'red',
                  });
                }
              }}
                size='xl'
                radius='md'
                color='dark'
                variant='outline'>
                <SaveIcon />
              </ActionIcon>
            )}
            {modal.type === 'ADD_CAT' && (
              <ActionIcon
              onClick={async () => {
                setDeletePressed(false);
                try{
                  const errorStatus = await addCat();
                  if (errorStatus) return;
                  showNotification({
                    title: t('components.catModal.catModalHeader.notification.title.addition', {ns: 'common'}),
                    message: t('components.catModal.catModalHeader.notification.message.addition', {ns: 'common'}),
                    color: 'green',
                  });
                } catch(error: any) {
                  showNotification({
                    title: t('notificationTitle.catAddition', {ns: 'errors'}),
                    message: t(error.response.data.message, {ns: 'errors'}),
                    color: 'red',
                  });
                }
              }}
                size='xl'
                color='dark'
                radius='md'
                variant='outline'>
                <SaveIcon />
              </ActionIcon>
            )}

            {modal.type !== 'ADD_CAT' && (
              <ActionIcon
                size='xl'
                onClick={() => {
                  setDeletePressed(true);
                  setConfirmationVisible(true);
                }}
                radius='md'
                variant='outline'
                color='dark'>
                <Trash size={40} />
              </ActionIcon>
            )}
        </Group>
      </Group>
      <Collapse in={confirmationVisible}  transitionDuration={500} transitionTimingFunction='ease'>
        <Stack sx={{backgroundColor: '#C393B0', width: '100%', marginTop: '2px'}} spacing='xs'>
          {!deletePressed && (<Text align='center' color='white' size='xs' mt='sm'>
            {t('components.catModal.catModalHeader.confirmation.discardMessage')}
            </Text>)}
          {deletePressed && (<Text align='center' color='white' size='xs' mt='sm'>
            {t('components.catModal.catModalHeader.confirmation.deleteMessage')}
          </Text>)}
          <Group align='center' position='center' pb='md'>
                <Button 
                  onClick={
                    () => {
                      setDeletePressed(false);
                      setConfirmationVisible(false);
                    }
                  }
                  radius='md' 
                  variant='outline' 
                  sx={{color: '#FFFFFF', borderColor: '#FFFFFF', fontSize: '14px', width: '140px'}}>
                    {t('components.catModal.catModalHeader.confirmation.cancel')}
                </Button>
                <Button 
                  onClick={async () => {
                    if (deletePressed) {
                      try{
                        await deleteCat();
                        showNotification({
                          title: t('components.catModal.catModalHeader.notification.title.deletion', {ns: 'common'}),
                          message: t('components.catModal.catModalHeader.notification.message.deletion', {ns: 'common'}),
                          color: 'green',
                        });
                      } catch(error: any) {
                        showNotification({
                          title: t('notificationTitle.catDeletion', {ns: 'errors'}),
                          message: t(error.response.data.message, {ns: 'errors'}),
                          color: 'red',
                        });
                      }
                    }
                    setModal(modal.back);
                  }}
                  radius='md' 
                  variant='outline' 
                  sx={{color: '#FFFFFF', borderColor: '#FFFFFF', fontSize: '14px', width: '140px'}}>
                    {t('components.catModal.catModalHeader.confirmation.yes')}
                </Button>
            </Group>
          </Stack>
        </Collapse>
    </>
  );
}
