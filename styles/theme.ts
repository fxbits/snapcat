import { MantineThemeOverride } from '@mantine/core';

const theme: MantineThemeOverride = {
  fontFamily: 'Poppins, sans-serif',
  colors: {
    yellow: [
      '#FFFBEC',
      '#FFF8D8',
      '#FFF2BB',
      '#FFED9E',
      '#FFE880',
      '#FFE263',
      '#FFDB3C',
      '#BFA42D',
      '#8C7821',
      '#594D15',
    ],
    pink: [
      '#F6EFF3',
      '#E6D1DD',
      '#D5B4C8',
      '#C596B2',
      '#B4799D',
      '#A45B87',
      '#83496C',
      '#623751',
      '#422436',
      '#21121B',
    ],
    purple: [
      '#E8EBFC',
      '#BFC7F7',
      '#97A2F2',
      '#6E7EED',
      '#455AE8',
      '#1C35E3',
      '#162BB6',
      '#112088',
      '#0B155B',
      '#060B2D',
    ],
  },
  headings: {
    fontFamily: 'Poppins, sans-serif',
    sizes: {
      h1: { fontSize: '40px', lineHeight: '48px' },
      h2: { fontSize: '36px', lineHeight: '44px' },
      h3: { fontSize: '30px', lineHeight: '38px' },
      h4: { fontSize: '24px', lineHeight: '32px' },
      h5: { fontSize: '20px', lineHeight: '28px' },
    },
  },
};
export default theme;
