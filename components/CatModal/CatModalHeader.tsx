import { ActionIcon, Group, Text } from '@mantine/core';
import { ArrowLeft, BrandStackoverflow, Edit, MedicalCross, Trash } from 'tabler-icons-react';
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
  return (
    <Group
      p='md'
      position='apart'
      align='center'
      sx={{
        width: '100%',
        borderRadius: '15px',
      }}>
      <ActionIcon
        onClick={() => (modal.back ? setModal(modal.back) : setModal(undefined))}
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
            onClick={() => setModal({ ...modal, type: 'EDIT_CAT' })}
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
              deleteCat();
              setModal(modal.back);
            }}
            radius='md'
            variant='outline'
            color='dark'>
            <Trash size={40} />
          </ActionIcon>
        )}
      </Group>
    </Group>
  );
}
