import { Box, Center, ThemeIcon, Title, useMantineTheme } from '@mantine/core';
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { UnsterilizedCatIcon } from '../Icons/Icons';

const variantsCircle: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1.2, opacity: 1, transition: { duration: 0.2 } },
};

const variantsContainer: Variants = {
  initial: { scale: 1, zIndex: 100 },
  animate: { scale: 1.2, zIndex: 150 },
};

const variantsIcon: Variants = {
  initial: (custom) => ({
    color: custom,
    fill: custom,
  }),
  animate: {
    color: '#fff',
    fill: '#fff',
  },
};

export default function MarkerGroup({ points, onClick }: { points: number; onClick: () => void }) {
  const theme = useMantineTheme();
  return (
    <Box
      component={motion.div}
      initial='initial'
      variants={variantsContainer}
      whileHover='animate'
      sx={{ position: 'relative' }}
      transition={{ type: 'spring', stiffness: 200 }}
      onClick={onClick}>
      <Center
        component={motion.div}
        variants={variantsIcon}
        transition={{ duration: 0 }}
        custom={theme.colors.dark[9]}
        sx={{
          position: 'relative',
          width: 70,
          borderRadius: '50%',
          height: 70,
          cursor: 'pointer',
          zIndex: 50,
          backgroundColor: theme.colors.gray[1],
          overflow: 'hidden',
        }}>
        <Box
          component={motion.div}
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
          <Title order={2}>{points}</Title>
          <ThemeIcon sx={{ backgroundColor: 'transparent' }} color='dark' radius='xl'>
            <UnsterilizedCatIcon />
          </ThemeIcon>
        </Box>
        <Box
          component={motion.div}
          variants={variantsCircle}
          sx={{
            top: '-50%',
            left: '0',
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(8px)',
            backgroundColor: theme.colors.blue[5],
          }}
        />
        <Box
          component={motion.div}
          variants={variantsCircle}
          sx={{
            top: '35%',
            left: '-50%',
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(8px)',
            backgroundColor: theme.colors.red[5],
          }}
        />
        <Box
          component={motion.div}
          variants={variantsCircle}
          sx={{
            right: '-50%',
            top: '35%',
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(8px)',
            backgroundColor: theme.colors.orange[5],
          }}
        />
      </Center>
    </Box>
  );
}
