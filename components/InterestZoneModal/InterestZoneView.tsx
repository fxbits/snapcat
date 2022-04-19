import { InterestZone } from '../../models/zone.model';
import SterilizedCat from './SterilizedCat';
import UnsterilizedCat from './UnsterilizedCat';

import { useContext, useEffect, useState } from 'react';
import { ActionIcon, Box, Grid, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { Accordion } from '@mantine/core';
import ViewDetails from './ViewDetails';
import Image from 'next/image';
import { Plus } from 'tabler-icons-react';
import { ModalContext } from '../Providers/ModalProvider';
import { CatContext } from '../Providers/CatProvider';
import InterestZoneForm from './InterestZonetForm';

interface Props {
  zone: InterestZone | undefined;
  partialZone?: Partial<InterestZone>;
}

const InterestZoneView = ({ zone, partialZone }: Props) => {
  const { modal, setModal } = useContext(ModalContext);
  const { setCat } = useContext(CatContext);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Grid gutter='sm'>
        <Grid.Col xl={6} sm={12}>
          {modal?.type === 'ADD_ZONE' ? (
            <InterestZoneForm zone={partialZone!} />
          ) : modal?.type === 'EDIT_ZONE' ? (
            <InterestZoneForm zone={zone!} />
          ) : (
            <ViewDetails zone={zone} />
          )}
        </Grid.Col>
        <Grid.Col xl={6} sm={12}>
          {zone && (
            <Accordion
              sx={(theme) => ({
                backgroundColor: theme.colors.yellow[2],
                borderRadius: theme.radius.md,
              })}
              styles={{ content: { paddingLeft: 0 } }}
              initialItem={0}
              disableIconRotation>
              {/* TODO: translation keys */}
              <Accordion.Item
                icon={
                  <Image
                    src='/icon/sterilized-cat-icon.svg'
                    width={40}
                    height={40}
                    alt='Sterilized Cats'
                  />
                }
                label={
                  <Group sx={{ position: 'relative', height: '40px' }} align='center'>
                    <Text>Sterilized Cats</Text>
                    <ActionIcon
                      sx={{ position: 'absolute', right: 0 }}
                      variant='filled'
                      component='div'
                      size='lg'
                      color='green'
                      onClick={() => {
                        setModal({ type: 'ADD_CAT', back: modal });
                        setCat(undefined);
                      }}>
                      <Plus />
                    </ActionIcon>
                  </Group>
                }>
                <ScrollArea style={{ height: '300px' }}>
                  <Stack sx={{ overflow: 'hidden' }}>
                    {zone?.sterilizedCats.map((cat, index) => (
                      <SterilizedCat key={index} cat={cat} />
                    ))}
                  </Stack>
                </ScrollArea>
              </Accordion.Item>
              <Accordion.Item
                icon={
                  <Image
                    src='/icon/unsterilized-cat-icon.svg'
                    width={40}
                    height={40}
                    alt='Unsterilized Cats'
                  />
                }
                sx={{ position: 'relative' }}
                label={
                  <Group sx={{ position: 'relative', height: '40px' }} align='center'>
                    <Text>Unterilized Cats</Text>
                    <ActionIcon
                      component='div'
                      sx={{ position: 'absolute', right: 0 }}
                      variant='filled'
                      color='dark'
                      size='lg'
                      onClick={() => {
                        setModal({ type: 'ADD_CAT', back: modal });
                        setCat(undefined);
                      }}>
                      <Plus />
                    </ActionIcon>
                  </Group>
                }>
                <ScrollArea style={{ height: '300px' }}>
                  <Stack sx={{ overflow: 'hidden' }}>
                    {zone?.unsterilizedCats.map((cat, index) => (
                      <UnsterilizedCat key={index} cat={cat} />
                    ))}
                  </Stack>
                </ScrollArea>
              </Accordion.Item>
            </Accordion>
          )}

          {/* TODO: translation keys */}
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default InterestZoneView;
