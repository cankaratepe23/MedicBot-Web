import { Box, createTheme, CssBaseline, Stack, TextField, ThemeProvider, ToggleButton, Typography, debounce, Select, MenuItem, Menu, SelectChangeEvent, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { grey } from '@mui/material/colors';
import ClearIcon from '@mui/icons-material/Clear';
import AudioTable from './AudioTable';
import { useCallback, useMemo, useRef, useState } from 'react';
import { apiUrl, loginPath } from './Properties';

import bgImg from './img/12-Dark.webp';

export const theme = createTheme({
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
        }
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          padding: 6
        }
      }
    },
    MuiButtonGroup: {
      styleOverrides: {
        firstButton: {
          border: 'none'
        },
        lastButton: {
          border: 'none'
        }
      }
    }
  },
});

function App() {
  const soundboardMode = useRef(false);
  const [soundboardModeVisual, setSoundboardModeVisual] = useState(false);

  const guildId = useRef('463052720509812736');
  const [guildIdVisual, setGuildIdVisual] = useState('463052720509812736');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFieldText, setSearchFieldText] = useState('');

  const handleClick = useCallback(async (trackId: string, isRightClick: boolean) => {
    if (isRightClick) {
      const url = apiUrl + 'Auth/TemporaryToken';

      fetch(url, { credentials: 'include' }).then(async response => {
        if (response.status == 401) {
          window.location.href = (apiUrl + loginPath);
        }
        else {
          const tempToken = await response.text();
          navigator.clipboard.writeText(window.location.href + 'Audio/' + trackId + '?token=' + tempToken);
        }
      })

      return;
    }

    if (soundboardMode.current) {
      const url = apiUrl + 'Audio/' + trackId;

      fetch(url, { credentials: 'include' }).then(response => {
        if (response.status == 401) {
          window.location.href = (apiUrl + loginPath);
        }
        else {
          response.blob().then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const audio = new Audio(blobUrl)
            audio.play();
          })
        }
      });
    }
    else {
      const url = apiUrl + 'Audio/Play/' + guildId.current + '?' + new URLSearchParams({
        audioNameOrId: trackId,
        searchById: "true"
      });

      fetch(url, { credentials: 'include' }).then(response => {
        if (response.status == 401) {
          window.location.href = (apiUrl + loginPath);
        }
      });
    }
  }, []);

  const handleSearchInputChaned = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value)
      }, 100),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'contain',
        minHeight: '500vh'
      }}>
        <Stack justifyContent='center' spacing={2} p={2}>
          <Grid container spacing={{ xs: 1, md: 3 }}>
            <Grid size={{ xs: 12, md: 2.5 }} key='headergrid1'>
              <Typography variant='h1' align='left'>MedicBot Entries</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 7}} key='headergrid2' pr={4}>
              <TextField
                id='search-box'
                label='Search for an audio track...'
                variant='outlined'
                fullWidth
                value={searchFieldText}
                onChange={e => {
                  setSearchFieldText(e.target.value);
                  handleSearchInputChaned(e.target.value);
                }}
                slotProps={{
                  input: {
                    endAdornment: (<IconButton onClick={e => { setSearchFieldText(''); handleSearchInputChaned(''); }}><ClearIcon /></IconButton>)
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs:12, md: 1 }} key='headergridcombobox'>
              <Select
                value={guildIdVisual}
                label='Guild'
                onChange={(e: SelectChangeEvent) => {
                  guildId.current = e.target.value;
                  setGuildIdVisual(e.target.value);
                }}>
                <MenuItem value={'463052720509812736'}>Çomaristan</MenuItem>
                <MenuItem value={'843472529938841630'}>Apex</MenuItem>
              </Select>
            </Grid>
            <Grid size={{ xs:12, md: 1}} key='headergrid3'>
              <ToggleButton
                value="check"
                selected={soundboardModeVisual}
                onChange={() => {
                  soundboardMode.current = !soundboardMode.current;
                  setSoundboardModeVisual(!soundboardModeVisual);
                }}
                color='warning'>
                Soundboard Mode
              </ToggleButton>
            </Grid>
          </Grid>
          <AudioTable clickCallback={handleClick} query={searchQuery} />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
