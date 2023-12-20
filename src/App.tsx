import { createTheme, CssBaseline, Stack, Switch, TextField, ThemeProvider, ToggleButton, Typography } from '@mui/material';
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
        window.location.replace(apiUrl + "Auth/TestLogin");
      }
    });
  }

  async function playAudioInBrowser(trackId: string) {
    const url = apiUrl + 'Audio/' + trackId;

    fetch(url, { credentials: 'include' }).then(response => {
      if (response.status == 401) {
        window.location.replace(apiUrl + "Auth/TestLogin");
      }
      else {
        response.blob().then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const audio = new Audio(blobUrl)
          console.log(blobUrl);
          audio.play();
        })
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack justifyContent='center' spacing={2} p={2} sx={{
        backgroundImage: `url(${img13})`,
        backgroundSize: 'contain',
      }}>
        <Stack direction={'row'} spacing={5}>
          <Typography variant='h1' align='left'>MedicBot Entries List</Typography>
          <TextField id='search-box' label='Search for an audio track...' variant='outlined' sx={{ width: 3 / 5, pt: 1 / 4 }} />
          <ToggleButton
            value="check"
            selected={soundboardMode}
            onChange={() => {
              setSoundboardMode(!soundboardMode);
            }}
            color='warning'
            >
            Soundboard Mode
          </ToggleButton>
        </Stack>
        <AudioTable clickCallback={handleClick} />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
