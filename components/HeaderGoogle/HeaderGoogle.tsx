import {
  ActionIcon,
  Button,
  Center,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { Search } from 'tabler-icons-react';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';
import { useReducer, useState } from 'react';
import Link from 'next/link';

interface Props {
  searchPosition: (address: string) => void;
}

const HeaderGoogle = ({ searchPosition }: Props) => {
  const { user } = useUser();
  const [addressName, setAddressName] = useState<string>('');

  const searchPlace = (): void => {
    searchPosition(addressName);
  };

  const theme = useMantineTheme();

  return (
    <Group
      position='apart'
      px='md'
      align='center'
      noWrap
      sx={{ backgroundColor: theme.colors.yellow[6], height: '60px' }}>
      <Group noWrap align='center' justify-content='space-between'>
        <Image src='/icon/header-icon.svg' width={36} height={46} alt='Logo'></Image>
        <TextInput
          type='search'
          placeholder='Search'
          required
          rightSection={
            <ActionIcon>
              <Search onClick={searchPlace} />
            </ActionIcon>
          }
          onChange={(e) => {
            setAddressName(e.target.value);
          }}
        />
      </Group>
      <Menu
        control={
          <Button
            size='md'
            variant='outline'
            color='dark'
            rightIcon={
              <Center sx={{ borderRadius: '50%', overflow: 'hidden' }}>
                <Image
                  src={user?.picture || '/icon/user-icon.svg'}
                  width={40}
                  height={40}
                  alt='Profile Icon'
                />
              </Center>
            }>
            <Stack spacing={0} align='center'>
              <Text size='md' color='dark' inline weight={700}>
                Welcome
              </Text>
              <Text
                size='sm'
                sx={(theme) => ({
                  [theme.fn.smallerThan('md')]: { display: 'none' },
                })}>
                {user!.name}
              </Text>
            </Stack>
          </Button>
        }
        position='bottom'
        styles={(theme) => ({
          body: {
            width: '100vw',
            backgroundColor: '#FFDB3C',
            border: '#FFDB3C',
            [theme.fn.largerThan('md')]: { width: '20vw' },
          },
        })}>
        <Stack align='center' sx={{ backgroundColor: '#FFDB3C' }}>
          <Group direction='column' sx={{ fontWeight: 'bold' }}>
            <Link href=''>Profile</Link>
            <Link href='/api/auth/logout'>Logout</Link>
          </Group>
          <Group position='apart'></Group>
        </Stack>
      </Menu>
    </Group>
  );
};

export default HeaderGoogle;
