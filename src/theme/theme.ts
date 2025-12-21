import { createTheme, type PaletteMode } from '@mui/material';

// We can customize colors here. 
// Let's go with a clean, modern look with a primary blue and secondary accent.
export const getAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1976d2', // Professional Blue
    },
    secondary: {
      main: '#9c27b0', // Purple for creative elements (Stories)
    },
    background: {
      default: mode === 'light' ? '#f4f6f8' : '#121212', // Light grey or dark grey
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Keeps buttons from being all-caps
          borderRadius: 8,
        },
      },
    },
  },
});
