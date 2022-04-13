import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Box } from '@mantine/core';

const variants: Variants = {
  initial: (custom) => ({
    opacity: 0,
    rotate: -45,
  }),
  animate: {
    opacity: 1,
  },
};
export default function MovingLine({ index }: { index: number }) {
  return (
    <Box
      component={motion.div}
      variants={variants}
      custom={Math.random()}
      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2, ease: 'circIn' }}
      sx={{
        top: `calc(50% + ${index * 20}px)`,
        left: `calc(-50% + ${index * 20}px)`,
        position: 'absolute',
        transformOrigin: '0 0',
        width: '200%',
        height: '10px',
        backgroundColor: 'black',
      }}></Box>
  );
}
