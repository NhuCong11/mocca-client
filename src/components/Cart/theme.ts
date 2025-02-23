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
            color: 'var(--primary-bg)',
          },
          '&.MuiCheckbox-indeterminate': {
            color: 'var(--primary-bg)',
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
