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
  const theme = useMantineTheme();
  return (
    <Group
      p='md'
      position='apart'
      align='center'
      sx={{
        width: '100%',
        borderRadius: '15px',
      }}>
      <ActionIcon onClick={() => setModal(undefined)} variant='filled' size='xl' color='yellow'>
        <ArrowLeft size={50} />
      </ActionIcon>
      {modal.state === 'add' && <Text>ADD CAT</Text>}
      {modal.state === 'view' && <Text>VIEW CAT</Text>}
      {modal.state === 'edit' && <Text>EDIT CAT</Text>}

      <Group spacing='xs'>
        {modal.state === 'view' ? (
          <ActionIcon
            onClick={() => setModal({ ...modal, state: 'edit' })}
            size='lg'
            radius='md'
            variant='filled'>
            <Edit size={40} />
          </ActionIcon>
        ) : (
          (modal.state === 'edit' || modal.state === 'add') && (
            <ActionIcon
              onClick={() => setModal({ ...modal, state: 'view' })}
              size='lg'
              radius='md'
              variant='filled'>
              <BrandStackoverflow size={40} />
            </ActionIcon>
          )
        )}

        {modal.state !== 'add' && (
          <ActionIcon size='lg' radius='md' variant='filled' color='red'>
            <Trash size={40} />
          </ActionIcon>
        )}
      </Group>
    </Group>
  );
}
