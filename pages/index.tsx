import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { Box, Grid, Group, Text, useMantineTheme, Button, Stack, ThemeIcon } from '@mantine/core';
import { SterilizedCatIcon, UnsterilizedCatIcon } from '../components/Icons/Icons';
import Image from 'next/image';
import { Logout, Map, Signature } from 'tabler-icons-react';
import MovingBox from '../components/Homepage/MovingBox';
import UserContainer from '../components/Homepage/UserContainer';
import { useRouter } from 'next/router';

const MainApp = () => {
  const { user } = useUser();
  const router = useRouter();
  const theme = useMantineTheme();
  return (
    <Grid
      sx={{
        position: 'relative',
        [theme.fn.largerThan('md')]: {
          minHeight: '100vh',
        },
        width: '100%',
        margin: 0,
        overflow: 'hidden',
      }}>
      <Grid.Col lg={6}>
        <Box
          p='xl'
          sx={{
            marginTop: '100px',
            height: '100%',
            flexDirection: 'column',
            display: 'flex',
            alignItems: 'center',
          }}>
          <Box sx={{ position: 'relative', width: '30%', stroke: 'black', fill: 'none' }}>
            <ThemeIcon
              variant='filled'
              sx={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}>
              <UnsterilizedCatIcon />
            </ThemeIcon>

            <Box
              sx={{
                position: 'absolute',
                stroke: theme.colors.yellow[6],
                fill: theme.colors.yellow[6],
                bottom: '-20%',
                left: '-30%',
                width: '80%',
                height: '100%',
              }}>
              <ThemeIcon
                variant='filled'
                sx={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}>
                <SterilizedCatIcon />
              </ThemeIcon>
            </Box>
          </Box>
          <Text
            mt='lg'
            sx={{
              fontSize: '50px',
              [theme.fn.largerThan('md')]: {
                fontSize: '125px',
              },
              fontWeight: '600',
            }}
            inline>
            Snapcat
          </Text>

          <Stack sx={{ marginTop: '40px' }}>
            <UserContainer user={user} />
            <Group position='center'>
              <Button
                size='lg'
                variant='filled'
                color='yellow'
                disabled={user === undefined}
                onClick={() => user !== undefined && router.push('/map')}
                leftIcon={<Map size={50} />}>
                Open Map
              </Button>
              {user ? (
                <>
                  <Link href='/api/auth/logout' passHref>
                    <Button
                      variant='filled'
                      size='lg'
                      color='red'
                      component='a'
                      leftIcon={<Logout size={50} />}>
                      Logout
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href='/api/auth/login' passHref>
                  <Button
                    variant='filled'
                    color='red'
                    size='lg'
                    component='a'
                    leftIcon={<Signature size={50} />}>
                    Login
                  </Button>
                </Link>
              )}
            </Group>
          </Stack>
        </Box>
      </Grid.Col>
      <Grid.Col lg={6} p={0}>
        <Grid
          sx={{
            height: '50vh',
            [theme.fn.largerThan('lg')]: {
              height: '100%',
            },
          }}
          m={0}>
          <Grid.Col lg={12} sx={{ backgroundColor: theme.colors.gray[0] }}>
            <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
              <Image layout='fill' src='/images/homepage-cat.svg' alt='Cat' objectFit='contain' />
            </Box>
          </Grid.Col>
          <Grid.Col
            lg={6}
            sx={{
              backgroundColor: theme.colors.yellow[3],
              [theme.fn.smallerThan('md')]: { display: 'none' },
            }}></Grid.Col>
          <Grid.Col lg={6} sx={{ backgroundColor: theme.colors.yellow[5] }} p={0}>
            <MovingBox />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
};

export default MainApp;
