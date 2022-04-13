import { Box } from '@mantine/core';
import { motion } from 'framer-motion';
import React from 'react';
import MovingLine from './MovingLine';

export default function MovingBox() {
  return (
    <Box
      component={motion.div}
      sx={{ position: 'relative', width: '100%', height: '100%' }}
      initial='initial'
      transition={{ staggerChildren: 0.25 }}
      animate='animate'>
      {Array.from({ length: 50 }).map((_, index) => (
        <MovingLine key={index} index={index} />
      ))}
    </Box>
  );
}
