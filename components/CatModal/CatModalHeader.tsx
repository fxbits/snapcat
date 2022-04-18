import { ActionIcon, Group, Text } from '@mantine/core';
import { ArrowLeft, BrandStackoverflow, Edit, MedicalCross, Trash } from 'tabler-icons-react';
import { ModalConfig } from '../Providers/ModalProvider';

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
      {modal.type === 'ADD_CAT' && <Text>ADD CAT</Text>}
      {modal.type === 'VIEW_CAT' && <Text>VIEW CAT</Text>}
      {modal.type === 'EDIT_CAT' && <Text>EDIT CAT</Text>}

      <Group spacing='xs'>
        {modal.type === 'VIEW_CAT' && (
          <ActionIcon
            onClick={() => {
              setModal({ ...modal, type: 'STERILIZE_CAT' });
            }}
            size='lg'
            color='green'
            radius='md'
            variant='filled'>
            <MedicalCross size={40} />
          </ActionIcon>
        )}
        {modal.type === 'VIEW_CAT' && (
          <ActionIcon
            onClick={() => setModal({ ...modal, type: 'EDIT_CAT' })}
            size='lg'
            radius='md'
            variant='outline'>
            <Edit size={40} />
          </ActionIcon>
        )}

        {(modal.type === 'EDIT_CAT' || modal.type === 'STERILIZE_CAT') && (
          <ActionIcon
            onClick={() => {
              setModal({ ...modal, type: 'VIEW_CAT' });
              modal.type === 'EDIT_CAT' ? updateCat() : sterilizeCat();
            }}
            size='lg'
            radius='md'
            variant='filled'>
            <BrandStackoverflow size={40} />
          </ActionIcon>
        )}
        {modal.type === 'ADD_CAT' && (
          <ActionIcon
            onClick={() => {
              setModal(modal.back);
              addCat();
            }}
            size='lg'
            radius='md'
            variant='filled'>
            <BrandStackoverflow size={40} />
          </ActionIcon>
        )}

        {modal.type !== 'ADD_CAT' && (
          <ActionIcon
            size='lg'
            onClick={() => {
              deleteCat();
              setModal(modal.back);
            }}
            radius='md'
            variant='filled'
            color='red'>
            <Trash size={40} />
          </ActionIcon>
        )}
      </Group>
    </Group>
  );
}
