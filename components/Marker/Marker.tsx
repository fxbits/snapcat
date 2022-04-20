import { Box, Center, useMantineTheme } from '@mantine/core';
import React from 'react';
import { InterestZone } from '../../models/zone.model';
import { useStatusColorMantine } from '../hooks/useStatusColor';
import { motion, Variants } from 'framer-motion';
import { UnsterilizedCatIcon } from '../Icons/Icons';

const variantsCircle: Variants = {
  initial: { scale: 0 },
  animate: { scale: 3, opacity: 1, transition: { duration: 0.2 } },
};
const variantsOutline: Variants = {
  initial: { scale: 1, opacity: 0 },
  animate: { scale: 1.1, opacity: 1 },
};
const variantsContainer: Variants = {
  initial: { scale: 1 },
  animate: { scale: 1.2, zIndex: 50 },
};

const variantsIcon: Variants = {
  initial: (custom) => ({
    fill: custom,
  }),
  animate: {
    fill: '#fff',
  },
};

export default function Marker({
  zone,
  displayZoneMarker,
}: {
  zone: InterestZone;
  displayZoneMarker: () => void;
}) {
  const theme = useMantineTheme();
  const statusColor = useStatusColorMantine;
  return (
    <Box
      component={motion.div}
      initial='initial'
      variants={variantsContainer}
      whileHover='animate'
      sx={{ position: 'relative' }}
      transition={{ type: 'spring', stiffness: 200 }}>
      <Box
        component={motion.div}
        variants={variantsOutline}
        sx={{
          top: 0,
          left: 0,
          position: 'absolute',
          width: '100%',
          height: '100%',
          outline: '5px solid',
          outlineColor: theme.colors[statusColor[zone.status]][5],
          borderRadius: '50%',
        }}
      />
      <Center
        component={motion.div}
        variants={variantsIcon}
        custom={theme.colors[statusColor[zone.status]][5]}
        sx={{
          position: 'relative',
          width: 50 + zone.noUnsterilizedCats * 10,
          borderRadius: '50%',
          height: 50 + zone.noUnsterilizedCats * 10,
          background: theme.colors[statusColor[zone.status]][2] + '50',
          cursor: 'pointer',
          zIndex: 50,
          overflow: 'hidden',
        }}
        onClick={displayZoneMarker}>
        <Box component={motion.div} sx={{ width: '50%', height: '50%', zIndex: 10 }}>
          <UnsterilizedCatIcon />
        </Box>
        <Box
          component={motion.div}
          variants={variantsCircle}
          sx={{
            top: '-50%',
            left: '-50%',
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderRadius: '50%',
            backgroundColor: theme.colors[statusColor[zone.status]][5],
          }}
        />
      </Center>
    </Box>
  );
}
