import { createTheme, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import AudioTable from './AudioTable';
import img11 from './img/11-0-Big-Sur-Color-Night.webp';
import img12 from './img/12-Dark.webp';
import img13 from './img/13-Ventura-Dark.webp';
import img14 from './img/14-Sonoma-Dark.webp';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: grey[900],
      light: grey[100],
      dark: '#424242CC',
    },
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
      'fontSize': '1.75rem',
      'fontWeight': 400
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#EEE',
          textTransform: 'unset',
          borderRadius: 0,
          fontSize: '1rem',
          fontWeight: 200
        },
      },
    },
  },
});

function App() {
  const backgrounds = [img11, img12, img13, img14];
  const bg = backgrounds[Math.floor(Math.random()*backgrounds.length)];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack justifyContent='center' spacing={2} p={2} sx={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'contain'
      }}>
        <Typography variant='h1' align='center'>MedicBot Entries List</Typography>
        <AudioTable />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
