import { InterestZone } from '../../models/zone.model';
import SterilizedCatsList from './SterilizedCatList';
import UnsterilizedCatsList from './UnsterilizedCatList';

import { useContext, useEffect, useState } from 'react';
import { ActionIcon, Box, Button, Grid, ScrollArea, Stack } from '@mantine/core';
import { Accordion } from '@mantine/core';
import ViewDetails from './ViewDetails';
import Image from 'next/image';
import { Plus } from 'tabler-icons-react';
import { ModalContext } from '../Providers/ModalProvider';
import { CatContext } from '../Providers/CatProvider';

interface Props {
  onClose: () => void;
  isVisible: boolean;
  zone: InterestZone;
}

const InterestZoneView = (props: Props) => {
  const [isEditable, setIsEditable] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);

  const { modal, setModal } = useContext(ModalContext);
  const { setCat } = useContext(CatContext);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    setIsEditable(false);
  }, [props.isVisible]);

  const sterilizedCatsList = props.zone?.sterilizedCats.map((cat, index) => (
    <SterilizedCatsList key={index} cat={cat} isEditable={isEditable} />
  ));

  const unsterilizedCatsList = props.zone?.unsterilizedCats.map((cat, index) => (
    <UnsterilizedCatsList key={index} cat={cat} isEditable={isEditable} />
  ));

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Grid>
        <Grid.Col xl={6} sm={12}>
          <ViewDetails zone={props.zone} />
        </Grid.Col>
        <Grid.Col
          xl={6}
          sm={12}
          sx={(theme) => ({
            backgroundColor: theme.colors.yellow[2],
            borderRadius: theme.radius.md,
          })}>
          <Accordion styles={{ content: { paddingLeft: 0 } }} initialItem={0} disableIconRotation>
            {/* TODO: translation keys */}
            <Accordion.Item
              sx={{ position: 'relative' }}
              label='Pisici sterilizate'
              icon={
                <Image
                  src='/icon/sterilized-cat-icon.svg'
                  width={40}
                  height={40}
                  alt='Sterilized Cats'
                />
              }>
              <ActionIcon
                sx={{ position: 'absolute', top: 0, right: 0, margin: '8px' }}
                variant='filled'
                color='dark'
                onClick={() => {
                  setModal({ type: 'ADD_CAT', back: modal });
                  setCat(undefined);
                }}>
                <Plus />
              </ActionIcon>
              <ScrollArea style={{ height: '100%' }}>
                <Stack sx={{ overflow: 'hidden' }}>{sterilizedCatsList}</Stack>
              </ScrollArea>
            </Accordion.Item>
            <Accordion.Item
              icon={
                <Image
                  src='/icon/unsterilized-cat-icon.svg'
                  width={40}
                  height={40}
                  alt='Sterilized Cats'
                />
              }
              label='Pisici nesterilizate'>
              {unsterilizedCatsList}
            </Accordion.Item>
          </Accordion>
          {/* TODO: translation keys */}
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default InterestZoneView;
