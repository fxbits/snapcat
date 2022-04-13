import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { Box, Grid, Group, Text, useMantineTheme, Button, Stack } from '@mantine/core';
import { SterilizedCatIcon, UnsterilizedCatIcon } from '../components/Icons/Icons';
import Image from 'next/image';
import { Disabled, Logout, Map, Signature } from 'tabler-icons-react';
import MovingBox from '../components/Homepage/MovingBox';

const MainApp = () => {
  const { user } = useUser();
  const theme = useMantineTheme();
  return (
    <Grid
      sx={{
        position: 'relative',
        height: '100vh',
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
          <Box sx={{ position: 'relative', width: '30%', stroke: 'black' }}>
            <UnsterilizedCatIcon />
            <Box
              sx={{
                position: 'absolute',
                stroke: theme.colors.yellow[6],
                fill: theme.colors.yellow[6],
                top: 50,
                left: -50,
                width: '80%',
                height: '100%',
              }}>
              <SterilizedCatIcon />
            </Box>
          </Box>
          <Text sx={{ fontSize: '150px', fontWeight: '600' }} inline>
            Snapcat
          </Text>

          <Group sx={{ width: '100%', marginTop: '40px' }} spacing={0} position='center'>
            {user ? (
              <Group
                p='sm'
                sx={{ backgroundColor: theme.colors.gray[1], borderRadius: theme.radius.md }}>
                {user.picture && (
                  <Box
                    sx={{
                      width: '50px',
                      height: '50px',
                      position: 'relative',
                      borderRadius: '50%',
                      overflow: 'hidden',
                    }}>
                    <Image src={user.picture} layout='fill' alt='Profile Image' />
                  </Box>
                )}

                <Stack spacing={0}>
                  <Text weight={700} size='xl'>
                    {user.name}
                  </Text>
                  <Text color='gray'>{user.email}</Text>
                </Stack>
              </Group>
            ) : (
              <>
                <Group
                  p='sm'
                  sx={{ backgroundColor: theme.colors.gray[1], borderRadius: theme.radius.md }}>
                  <Box
                    sx={{
                      width: '50px',
                      height: '50px',
                      position: 'relative',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.gray[2],
                    }}></Box>

                  <Stack spacing={0}>
                    <Text
                      weight={700}
                      size='xl'
                      sx={{
                        width: '100px',
                        height: '10px',
                        backgroundColor: theme.colors.gray[2],
                      }}></Text>
                    <Text
                      mt='sm'
                      sx={{
                        width: '130px',
                        height: '8px',
                        backgroundColor: theme.colors.gray[2],
                      }}></Text>
                  </Stack>
                </Group>
              </>
            )}
            <Button
              sx={{ height: '100%' }}
              size='lg'
              variant='filled'
              color='yellow'
              disabled={user === undefined}
              leftIcon={<Map size={50} />}>
              Open Map
            </Button>
            {user ? (
              <>
                <Link href='/api/auth/logout' passHref>
                  <Button
                    sx={{ height: '100%' }}
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
                  sx={{ height: '100%' }}
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
        </Box>
      </Grid.Col>
      <Grid.Col lg={6} p={0}>
        <Grid sx={{ height: '100%' }} m={0}>
          <Grid.Col lg={12} sx={{ backgroundColor: theme.colors.gray[0] }}>
            <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
              <Image layout='fill' src='/images/homepage-cat.svg' alt='Cat' objectFit='contain' />
            </Box>
          </Grid.Col>
          <Grid.Col lg={6} sx={{ backgroundColor: theme.colors.yellow[3] }}></Grid.Col>
          <Grid.Col lg={6} sx={{ backgroundColor: theme.colors.yellow[5] }} p={0}>
            <MovingBox />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
};

export default MainApp;
