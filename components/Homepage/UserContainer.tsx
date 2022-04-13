import { UserProfile } from '@auth0/nextjs-auth0';
import { Box, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import Image from 'next/image';
import React from 'react';

export default function UserContainer({ user }: { user: UserProfile | undefined }) {
  const theme = useMantineTheme();
  return (
    <>
      {user ? (
        <Group p='sm' sx={{ backgroundColor: theme.colors.gray[1], borderRadius: theme.radius.md }}>
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
    </>
  );
}
