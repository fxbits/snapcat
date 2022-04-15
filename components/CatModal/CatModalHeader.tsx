import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Select,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import React, { useContext } from 'react';
import { ArrowBarLeft, ArrowLeft, BrandStackoverflow, Edit, Trash } from 'tabler-icons-react';
import { ModalConfig } from '../Providers/ModalProvider';

export default function CatModalHeader({
  modal,
  setModal,
}: {
  modal: ModalConfig;
  setModal: (modal: ModalConfig | undefined) => void;
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
        {modal.type === 'VIEW_CAT' ? (
          <ActionIcon
            onClick={() => setModal({ ...modal, type: 'EDIT_CAT' })}
            size='lg'
            radius='md'
            variant='outline'>
            <Edit size={40} />
          </ActionIcon>
        ) : (
          (modal.type === 'EDIT_CAT' || modal.type === 'ADD_CAT') && (
            <ActionIcon
              onClick={() => setModal({ ...modal, type: 'VIEW_CAT' })}
              size='lg'
              radius='md'
              variant='filled'>
              <BrandStackoverflow size={40} />
            </ActionIcon>
          )
        )}

        {modal.type !== 'ADD_CAT' && (
          <ActionIcon size='lg' radius='md' variant='filled' color='red'>
            <Trash size={40} />
          </ActionIcon>
        )}
      </Group>
    </Group>
  );
}
