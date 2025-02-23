import { createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontSize: 20,
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#c5c5c5',
          '&.Mui-checked': {
            color: 'var(--coffee-color-v2)',
          },
          '&.MuiCheckbox-indeterminate': {
            color: 'var(--coffee-color-v2)',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginRight: '0',
        },
      },
    },
  },
});

export default theme;
