import { InterestZone, Status } from '../../models/zone.model';
import SterilizedCat from './SterilizedCat';
import UnsterilizedCat from './UnsterilizedCat';

import { useContext, useEffect, useState } from 'react';
import { ActionIcon, Box, Grid, Group, ScrollArea, Stack, Text, TextInput } from '@mantine/core';
import { Accordion } from '@mantine/core';
import InterestZoneDetails from './InterestZoneDetails';
import Image from 'next/image';
import { Phone, Plus } from 'tabler-icons-react';
import { ModalContext } from '../Providers/ModalProvider';
import { CatContext } from '../Providers/CatProvider';
import ZoneModalHeader from './InterestZoneHeader';
import useZoneActions from './hooks/useZoneActions';
import { useForm } from '@mantine/hooks';
import { InterestZoneProviderContext } from '../Providers/ZoneProvider';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'next-i18next';

interface Props {
  zone: InterestZone | undefined;
  partialZone?: Partial<InterestZone>;
}

export interface FormValues {
  addressName: string;
  volunteerName: string;
  contact: string;
  phone: string;
  status: Status;
}
const InterestZoneView = ({ zone, partialZone }: Props) => {
  const { modal, setModal } = useContext(ModalContext);
  const { setCat } = useContext(CatContext);
  const { setInterestZone } = useContext(InterestZoneProviderContext);
  const { AddZone, UpdateZone, DeleteZone } = useZoneActions(zone?._id!);
  const { t } = useTranslation('common');
  const nameRegex = /^[\p{Letter} -]+$/gu
  
  /// TODO: Use transaltions
  const form = useForm<FormValues>({
    initialValues: {
      addressName: zone?.address?.name || partialZone?.address?.name || '',
      volunteerName: zone?.volunteerName || partialZone?.volunteerName || '',
      contact: zone?.contactPerson?.name || '',
      phone: zone?.contactPerson?.phone || '',
      status: zone?.status || Status.TODO,
    },
    validationRules: {
      contact: (value) => value.length > 2 && (nameRegex.test(value)),
      phone: (value) => (/^07([0-9]{8})$/.test(value)),
      volunteerName: (value) => value.length > 2,
      status: (value) => value !== Status.DONE || value === Status.DONE && zone?.noUnsterilizedCats! === 0,
    },
    errorMessages: {
      contact: t('components.interestZoneView.validations.contact'),
      phone: t('components.interestZoneView.validations.phone'),
      status: t('components.interestZoneView.validations.status'),
      volunteerName: t('components.interestZoneView.validations.volunteerName'),
    }
  });

  return (
    <>
      <ZoneModalHeader
        zone={zone || partialZone!}
        form={form}
        addZone={() => {
          if (!form.validate()) return;
          setModal(modal?.back);
          showNotification({
            title: 'Created successfully',
            message: 'A zone has been created!',
            color: 'green',
          });
          AddZone(form.values, partialZone?.address!, partialZone?.volunteerName);
        }}
        updateZone={() => {
          if (!form.validate()) return;
          UpdateZone(form.values, zone).then((res) => {
            showNotification({
              title: 'Edited successfully',
              message: 'A zone has been edited!',
              color: 'green',
            });
          }).catch((err) => {
            showNotification({
              title: 'Operation unsuccessful',
              message: err.message,
              color: 'red',
            });
          })
          setModal({ ...modal, type: 'VIEW_ZONE' });
        }}
        deleteZone={() => {
          zone && DeleteZone().then((res) => {
            showNotification({
              title: 'Deleted successfully',
              message: 'A zone has been deleted!',
              color: 'green',
            });
          }).catch((err) => {
            showNotification({
              title: 'Operation unsuccessful',
              message: err.message,
              color: 'red',
            });
          });
          setInterestZone(undefined);
          setModal(modal?.back);
        }}
        modal={modal!}
        setModal={setModal}
      />
      <Box sx={{ width: '100%', height: '100%' }}>
        <Grid gutter='sm'>
          <Grid.Col xl={6} sm={12}>
            {(modal?.type === 'EDIT_ZONE' || modal?.type === 'ADD_ZONE') && (
              <Stack
                p='md'
                sx={(theme) => ({
                  backgroundColor: theme.colors.yellow[2] + 'd6',
                  backdropFilter: 'blur(15px)',
                  borderRadius: theme.radius.md,
                })}>
                <TextInput
                  {...form.getInputProps('addressName')}
                  onChange={(e) => form.setFieldValue('addressName', e.currentTarget.value)}
                  placeholder={t('components.interestZoneView.detailsForm.addressPlaceholder')}
                  label={t('components.interestZoneView.detailsForm.address')}
                  required
                  disabled
                />
                <TextInput
                  {...form.getInputProps('volunteerName')}
                  onChange={(e) => form.setFieldValue('volunteerName', e.currentTarget.value)}
                  placeholder={t('components.interestZoneView.detailsForm.volunteerPlaceholder')}
                  label={t('components.interestZoneView.detailsForm.volunteer')}
                  required
                />
                <TextInput
                  {...form.getInputProps('contact')}
                  onChange={(e) => form.setFieldValue('contact', e.currentTarget.value)}
                  placeholder='Contact'
                  label={t('components.interestZoneView.detailsForm.contactPerson')}
                  required
                />
                <TextInput
                  {...form.getInputProps('phone')}
                  onChange={(e) => form.setFieldValue('phone', e.currentTarget.value)}
                  icon={<Phone />}
                  placeholder='0771824601'
                  required
                />
              </Stack>
            )}
            {modal?.type === 'VIEW_ZONE' && <InterestZoneDetails zone={zone} />}
          </Grid.Col>
          <Grid.Col xl={6} sm={12}>
            {zone && (
              <Accordion
                sx={(theme) => ({
                  borderRadius: theme.radius.md,
                })}
                styles={(theme) => ({
                  content: { paddingLeft: 0 },
                  control: { padding: theme.spacing.md },
                  item: {
                    marginBottom: theme.spacing.sm,
                    backgroundColor: theme.colors.yellow[2] + 'd6',
                    backdropFilter: 'blur(15px)',
                    borderRadius: theme.radius.md,
                    overflow: 'hidden',
                  },
                })}
                initialItem={zone.sterilizedCats.length > 0 ? 0 : undefined}
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
                      <Text>{t('components.interestZoneView.interestZoneView.catsSterilized')}</Text>
                      <ActionIcon
                        sx={{ position: 'absolute', right: 0 }}
                        variant='filled'
                        component='div'
                        size='lg'
                        color='dark'
                        onClick={() => {
                          setModal({ type: 'ADD_CAT', back: modal });
                          setCat(undefined);
                        }}>
                        <Plus />
                      </ActionIcon>
                    </Group>
                  }>
                  <ScrollArea style={{ height: zone?.sterilizedCats.length > 0 ? '300px' : '0px' }}>
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
                      <Text>{t('components.interestZoneView.interestZoneView.catsUnsterilized')}</Text>
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
                  <ScrollArea
                    style={{ height: zone?.unsterilizedCats.length > 0 ? '300px' : '0pxs' }}>
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
    </>
  )};

export default InterestZoneView;
