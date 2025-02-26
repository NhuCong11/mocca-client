import { createTheme, MantineTheme } from '@mantine/core';

export const theme = createTheme({
  fontSizes: {
    xs: '0.8rem',
    sm: '1rem',
    md: '1.2rem',
    lg: '1.5rem',
    xl: '1.6rem',
  },
  lineHeights: {
    xs: '1.2',
    sm: '1.2',
    md: '1.5',
    lg: '1.5',
    xl: '1.5',
  },
  components: {
    Select: {
      styles: (theme: MantineTheme) => ({
        label: {
          marginBottom: '8px',
        },
        input: {
          fontWeight: 400,
          borderColor: theme.colors.gray[5],
        },
      }),
    },
  },
});
