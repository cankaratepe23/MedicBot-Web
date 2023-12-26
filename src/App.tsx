import { createTheme, CssBaseline, Grid, Paper, Stack, styled, Switch, TextField, ThemeProvider, ToggleButton, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import AudioTable from './AudioTable';
import img13 from './img/13-Ventura-Dark.webp';
import { useEffect, useState } from 'react';
import { apiUrl } from './Properties';


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
      '@media (max-width:600px)': {
        'fontSize': '2rem'
      }
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
    MuiToggleButton: {
      styleOverrides: {
        root: {
          padding: 6
        }
      }
    }
  },
});

function App() {
  const [soundboardMode, setSoundboardMode] = useState(false);

  async function handleClick(trackId: string) {
    if (soundboardMode) {
      playAudioInBrowser(trackId);
    }
    else {
      playInBot(trackId);
    }
  }

  async function playInBot(trackId: string) {
    const url = apiUrl + 'Audio/Play/463052720509812736?' + new URLSearchParams({
      audioNameOrId: trackId,
      searchById: "true"
    });

    fetch(url, { credentials: 'include' }).then(response => {
      if (response.status == 401) {
        window.location.href = (apiUrl + "Auth/TestLogin");
      }
    });
  }

  async function playAudioInBrowser(trackId: string) {
    const url = apiUrl + 'Audio/' + trackId;

    fetch(url, { credentials: 'include' }).then(response => {
      if (response.status == 401) {
        window.location.href = (apiUrl + "Auth/TestLogin");
      }
      else {
        response.blob().then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const audio = new Audio(blobUrl)
          console.log(blobUrl);
          audio.play();
        })
      }
    }).catch(e => {
      console.log(e);
    });
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack justifyContent='center' spacing={2} p={2} sx={{
        backgroundImage: `url(${img13})`,
        backgroundSize: 'contain',
      }}>
        <Grid container spacing={{ xs: 2, md: 3 }} pt={4} px={4}>
          <Grid xs={12} md={3} mb={2} key='headergrid1'>
            <Typography variant='h1' align='left'>MedicBot Entries List</Typography>
          </Grid>
          <Grid xs={12} md={8} mb={2} key='headergrid2' pr={4}>
            <TextField id='search-box' label='Search for an audio track...' variant='outlined' fullWidth />
          </Grid>
          <Grid xs={12} md={1} key='headergrid3'>
            <ToggleButton
              value="check"
              selected={soundboardMode}
              onChange={() => {
                setSoundboardMode(!soundboardMode);
              }}
              color='warning'>
              Soundboard Mode
            </ToggleButton>
          </Grid>
        </Grid>
        <AudioTable clickCallback={handleClick} />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
