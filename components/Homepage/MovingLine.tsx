import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Box } from '@mantine/core';

const variants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};
export default function MovingLine({ index }: { index: number }) {
  return (
    <Box
      component={motion.div}
      variants={variants}
      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8 }}
      sx={{
        top: index * 30,
        left: `calc(-50% + ${index * 30}px - 50px)`,
        position: 'absolute',
        width: '140%',
        height: '20px',
        transform: 'rotate(-45deg)',
        backgroundColor: 'black',
      }}></Box>
  );
}
