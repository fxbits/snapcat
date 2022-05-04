import {
  ActionIcon,
  Button,
  Center,
  Group,
  Menu,
  Radio,
  RadioGroup,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { Search } from 'tabler-icons-react';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Router, useRouter } from "next/router";

interface Props {
  setSearchAdress: (searchAdress: string) => void;
}

const HeaderGoogle = ({ setSearchAdress }: Props) => {
  const { i18n } = useTranslation();
  const { user } = useUser();
  const [addressName, setAddressName] = useState<string>('');
  const [value, setValue] = useState(i18n.language);
  const router = useRouter();

  const { t } = useTranslation('common');

  const switchLanguage = () => {
    const val = i18n.language === 'ro' ? 'en' : 'ro';
    const {pathname,asPath}=router;
    router.push({pathname},asPath,{locale:val});
  }

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
        <form onSubmit={() => setSearchAdress(addressName)}>
          <TextInput
            type='search'
            placeholder={t('components.headerGoogle.search')}
            required
            rightSection={
              <ActionIcon>
                <Search onClick={() => setSearchAdress(addressName)} />
              </ActionIcon>
            }
            onChange={(e) => {
              setAddressName(e.target.value);
            }}
          />
        </form>
      </Group>
      <Menu
        control={
          <Button
            size='md'
            color='yellow'
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
            <Group spacing='xs' align='center'>
              <Text
                size='sm'
                color='dark'
                sx={(theme) => ({
                  [theme.fn.smallerThan('md')]: { display: 'none' },
                })}>
                {t('components.headerGoogle.welcome')}, {user!.name}
              </Text>
            </Group>
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
            <Link href=''>{t('components.headerGoogle.profile')}</Link>
            <Link href='/api/auth/logout'>{t('components.headerGoogle.logout')}</Link>
          </Group>
          <Group position='apart'>
          <RadioGroup
                    value={value}
                    onChange={switchLanguage}
                    color='orange'
                    label={t('components.headerGoogle.language')}
                    required     
                >
                  <Radio value='ro' label={t('components.headerGoogle.romanian')} />
                  <Radio value='en' label={t('components.headerGoogle.english')} />
                </RadioGroup>
          </Group>
          
        </Stack>
      </Menu>
    </Group>
  );
};

export default HeaderGoogle;
