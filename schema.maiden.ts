import { defineSchema } from '@nikifilini/maidencss'

const schema = defineSchema({
  // asdf: 123,
  out: './src/maidencss',
  colors: {
    _extend: 'windi',
    palette: {
      white: '#FFFFFF',
      black: '#171717',
      bg: {
        medium: '#EEF1F5',
        light: '#FFFFFF',
        dark: '#3C363F',
        grey: '#C1D0DF',
      },
      border: {
        lighter: '#5C5C5C',
        darker: '#151515',
      },
      text: '#35353D',
      'text-secondary': '#6A7185',
      'text-inactive': '#6A7185',
      brand: '#A7119B',
      accent: '#59B838',
      'accent-second': '#E49838',
    },
  },
  spacings: {
    default: {
      1: '6px',
      2: '12px',
      3: '18px',
      4: '24px',
      5: '50px',
      add: 6,
    },
    margin: {
      short: 'm',
      xy: true,
    },
    padding: {
      short: 'p',
      xy: true,
    },
    gap: {
      short: 'gap',
    },
  },
})

export default schema
