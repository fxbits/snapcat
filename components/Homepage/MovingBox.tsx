import { Box } from '@mantine/core';
import { motion } from 'framer-motion';
import React from 'react';
import MovingLine from './MovingLine';
import PawnsAnimation from './PawnsAnimation';

export default function MovingBox() {
  return (
    <Box
      component={motion.div}
      sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
      initial='initial'
      transition={{ staggerChildren: .5 }}
      animate={['animate', 'appear']}>
      {Array.from({ length: 7 }).map((_, index) => (
        <PawnsAnimation key={index} index={index} />
      ))}
    </Box>
  );
}
