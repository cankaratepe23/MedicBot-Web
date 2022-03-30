import { createTheme, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';
import { lightBlue } from '@mui/material/colors';
import React from 'react';
import AudioTable from './AudioTable';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: lightBlue,
    text: {
      primary: '#EEE',
    }
  },
  typography: {
    'fontFamily': "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif",
    h1: {
      'fontSize': '3rem',
    },
    h2: {
      'fontSize': '1.5rem',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'unset',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack justifyContent='center' spacing={2} p={2}>
        <Typography variant='h1' align='center'>MedicBot Entries List</Typography>
        <AudioTable />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
