import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Box, Image } from '@mantine/core';

const variants: Variants = {
  initial: (custom) => ({
    opacity: 1,
    rotate: 0,
    visibility: 'hidden'
  }),
  animate: {
    opacity: 0,
  },
  appear: {
    visibility: 'visible',
    transition: {}
  }
};
export default function PawnsAnimation({ index }: { index: number }) {
  return (
    <Box
      component={motion.div}
      variants={variants}
      custom={Math.random()}
      transition={{ repeat: Infinity, repeatType: 'loop', repeatDelay: 2.5, duration: 3, ease: 'easeOut'}}>
        <Image src='/images/cat-paw.svg'
        fit='contain'
          width={80}
          height={80}
          sx={{
            top: `calc(90% - ${index * 100}px)`,
            left: `calc(0% + ${index * 100}px)`,
            position: 'absolute',
            transformOrigin: '0 0',
          }}/>
        <Image src='/images/cat-paw.svg'
          fit='contain'
          width={80}
          height={80}
          sx={{
            top: `calc(100% - ${(index + 0.8) * 100}px)`,
            left: `calc(20% + ${(index + 0.5) * 100}px)`,
            position: 'absolute',
            transformOrigin: '0 0',
          }}/>
      </Box>
  );
}
