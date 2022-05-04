import { ActionIcon, Button, Collapse, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { ArrowLeft, Trash } from 'tabler-icons-react';
import { EditIcon, SaveIcon, ScissorIcon } from '../Icons/Icons';
import { ModalConfig } from '../Providers/ModalProvider';
import { useTranslation } from 'next-i18next';

export default function CatModalHeader({
  modal,
  setModal,
  addCat,
  updateCat,
  deleteCat,
  sterilizeCat,
}: {
  modal: ModalConfig;
  setModal: (modal: ModalConfig | undefined) => void;
  addCat: () => void;
  updateCat: () => void;
  deleteCat: () => void;
  sterilizeCat: () => void;
}) {
  const { t } = useTranslation('common');
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [deletePressed, setDeletePressed] = useState<boolean>(false);
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
              (modal.back ? setModal(modal.back) : setModal(undefined))
            }
            else setConfirmationVisible(true);
          }}
          variant='filled'
          size='xl'
          color='yellow'>
          <ArrowLeft size={50} />
        </ActionIcon>
        {modal.type === 'ADD_CAT' && <Text>{t('components.catModal.catModalHeader.addCat')}</Text>}
        {modal.type === 'VIEW_CAT' && <Text>{t('components.catModal.catModalHeader.viewCat')}</Text>}
        {modal.type === 'EDIT_CAT' && <Text>{t('components.catModal.catModalHeader.editCat')}</Text>}

        <Group spacing='xs'>
          {modal.type === 'VIEW_CAT' && (
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
              onClick={() => {
                setDeletePressed(false);
                setModal({ ...modal, type: 'VIEW_CAT' });
                modal.type === 'EDIT_CAT' ? updateCat() : sterilizeCat();
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
              onClick={() => {
                setDeletePressed(false);
                setModal(modal.back);
                addCat();
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
                onClick={
                  () => {
                    if (deletePressed) {
                      deleteCat();
                    }
                    (modal.back ? setModal(modal.back) : setModal(undefined))
                  }
                }
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
