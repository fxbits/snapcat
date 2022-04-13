import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Box } from '@mantine/core';

const variants: Variants = {
  initial: (custom) => ({
    opacity: 0,
    rotate: custom * 30,
    scale: 0.8,
    x: 0,
  }),
  animate: {
    opacity: 1,
    scale: 1,
    y: 50,
  },
};
export default function MovingLine({ index }: { index: number }) {
  return (
    <Box
      component={motion.div}
      variants={variants}
      custom={Math.random()}
      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8 }}
      sx={{
        top: index * 20,
        borderRadius: '50%',
        position: 'absolute',
        width: '170%',
        height: '20px',
        background: 'linear-gradient(to right bottom, red, yellow)',
      }}></Box>
  );
}
