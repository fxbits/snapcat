import { SterilizedCat } from '../../models/cat.model';
import { Gender } from '../../models/cat.model';

import {
  ActionIcon,
  Box,
  Center,
  Group,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core';
import Image from 'next/image';
import { MouseEvent, useCallback, useContext, useEffect, useState } from 'react';
import { ModalContext } from '../Providers/ModalProvider';
import { CatContext } from '../Providers/CatProvider';

import { motion } from 'framer-motion';

import {
  ArrowBarLeft,
  ArrowBarRight,
  Edit,
  GenderFemale,
  GenderMale,
  Man,
  QuestionMark,
  Scissors,
  Trash,
} from 'tabler-icons-react';
import useCatActions from '../CatModal/useCatActions';
import { useTranslation } from 'next-i18next';
import { showNotification } from '@mantine/notifications';
import useSWR from 'swr';

interface Props {
  cat?: SterilizedCat,
  zoneID: string
}

const SterilizedCat = ({ cat, zoneID }: Props) => {
  const { setModal, modal } = useContext(ModalContext);
  const { setCat } = useContext(CatContext);
  const { DeleteCat, GetImages } = useCatActions(cat?._id!);
  const { t } = useTranslation(['common', 'errors']);
  const theme = useMantineTheme();
  const [displayImage, setDisplayImage] = useState<string>('/images/placeholder-cat.png');
  const { data } = useSWR<any[]>(
    cat?._id ? `/api/interest-zones/${zoneID}/${cat._id!}/images` : null
  );

  const handleChange = useCallback(
    (e: MouseEvent) => {
      setModal({ type: 'VIEW_CAT', back: { type: 'VIEW_ZONE' } });
      setCat(cat);
    },
    [setModal, cat, setCat]
  );

  useEffect(() => {
      setDisplayImage('/images/placeholder-cat.png');
      GetImages().then((resp) => {
        if (resp.length > 0) {
          setDisplayImage(`data:image/png;base64,${resp[0].imageString}`)
        }
      });
  }, [data]);

  return (
    <Box
      component={motion.div}
      sx={{ position: 'relative', cursor: 'pointer' }}
      drag='x'
      key='drag'
      dragConstraints={{ left: -150, right: 0 }}>
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
            src={displayImage}
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
          <Text lineClamp={3}>
            <Text component='span' weight={600} color='green'>
            {t('components.modalManager.interestZoneModal.cat.note')}:{' '}
            </Text>
            {cat?.observations}
          </Text>
          <Group spacing='md' mt='xs'>
            <Group spacing='xs'>
              <ArrowBarRight />
              <Text size='sm'>
                {cat?.hospitalizationDate? new Date(cat.hospitalizationDate).toLocaleDateString('en-GB')
                : null}
              </Text>
            </Group>
            <Group spacing='xs'>
              <ArrowBarLeft />
              <Text size='sm'>
                {cat?.releaseDate? new Date(cat.releaseDate).toLocaleDateString('en-GB')
                 : null}
              </Text>
            </Group>
          </Group>
        </Stack>
      </Group>
      <Group
        grow
        spacing={0}
        sx={{ position: 'absolute', right: -150, top: 0, width: '150px', height: '100%' }}>
        <ActionIcon
          onClick={() => {
            setCat(cat);
            setModal({ type: 'EDIT_CAT', back: modal });
          }}
          sx={{ height: '100%' }}
          color='blue'
          variant='filled'>
          <Edit />
        </ActionIcon>
        <ActionIcon
          sx={{ height: '100%' }}
          onClick={async () => {
            try{
              await DeleteCat();
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
          }}
          color='red'
          variant='filled'>
          <Trash />
        </ActionIcon>
      </Group>
    </Box>
  );
};

export default SterilizedCat;
