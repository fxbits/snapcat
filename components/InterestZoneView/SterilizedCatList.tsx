import { SterilizedCat } from '../../models/cat.model';
import { Gender } from '../../models/cat.model';

import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import Image from 'next/image';
import { MouseEvent, useCallback, useContext } from 'react';
import { ModalContext } from '../Providers/ModalProvider';
import { CatContext } from '../Providers/CatProvider';

import { motion } from 'framer-motion';

import {
  ArrowBarLeft,
  ArrowBarRight,
  ArrowLeft,
  Edit,
  GenderFemale,
  GenderMale,
  Man,
  QuestionMark,
  Scissors,
  Trash,
} from 'tabler-icons-react';
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface Props {
  isEditable: boolean;
  cat?: SterilizedCat;
}

const SterilizedCatsList = ({ cat }: Props) => {
  const { setModal } = useContext(ModalContext);
  const { setCat } = useContext(CatContext);

  const theme = useMantineTheme();

  const handleChange = useCallback(
    (e: MouseEvent) => {
      setModal({ type: 'VIEW_CAT', back: { type: 'VIEW_ZONE' } });
      setCat(cat);
    },
    [setModal, cat, setCat]
  );

  return (
    <Box
      component={motion.div}
      sx={{ position: 'relative', cursor: 'pointer' }}
      drag='x'
      key='drag'
      dragConstraints={{ left: -300, right: 0 }}>
      <Group
        onClick={handleChange}
        sx={(theme) => ({
          width: '100%',
          backgroundColor: theme.colors.yellow[1],
          borderRadius: theme.radius.md,

          '&:hover': {
            backgroundColor: theme.colors.yellow[3],
          },
          [theme.fn.smallerThan('md')]: {
            pointerEvents: 'none',
          },
        })}
        align='stretch'
        spacing='xs'
        noWrap
        p='md'>
        <Center
          sx={{
            [theme.fn.smallerThan('sm')]: { position: 'absolute', top: 0, left: 0, zIndex: 10 },
          }}>
          <ThemeIcon size='xl' color='dark' variant='filled' radius='xl'>
            {cat?.gender === Gender.MALE && <GenderMale size={60} />}
            {cat?.gender === Gender.FEMALE && <GenderFemale size={60} />}
            {cat?.gender === Gender.UNKNOWN && <QuestionMark size={60} />}
          </ThemeIcon>
        </Center>

        <Box
          sx={(theme) => ({
            width: '100px',
            aspectRatio: '1',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: theme.radius.md,
          })}>
          <Image
            src='/images/placeholder-cat.webp'
            alt='Cat Preview'
            layout='fill'
            objectFit='cover'
          />
        </Box>
        <Stack spacing={0} justify='flex-start' sx={{ height: '100%', flex: 1 }}>
          <Group spacing='xs' noWrap>
            <Man />
            <Text size='lg' weight={600}>
              {cat?.volunteerName}
            </Text>
          </Group>
          <Text>
            <Text component='span' weight={600} color='green'>
              NOTE:{' '}
            </Text>
            {cat?.observations}
          </Text>
          <Group spacing='md' mt='xs'>
            <Group spacing='xs'>
              <ArrowBarRight />
              <Text size='sm'>{cat?.releaseDate}</Text>
            </Group>
            <Group spacing='xs'>
              <ArrowBarLeft />
              <Text size='sm'>{cat?.hospitalizationDate}</Text>
            </Group>
          </Group>
        </Stack>
      </Group>
      <Group
        grow
        spacing={0}
        sx={{ position: 'absolute', right: -300, top: 0, width: '300px', height: '100%' }}>
        <ActionIcon sx={{ height: '100%' }} color='yellow' variant='filled'>
          <Scissors />
        </ActionIcon>
        <ActionIcon sx={{ height: '100%' }} color='blue' variant='filled'>
          <Edit />
        </ActionIcon>
        <ActionIcon sx={{ height: '100%' }} color='red' variant='filled'>
          <Trash />
        </ActionIcon>
      </Group>
    </Box>
  );
};

export default SterilizedCatsList;
