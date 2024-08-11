

import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from "./App";
import bgImg from './img/12-Dark.webp';

const AudioPlayer = function AudioPlayer() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: 'contain',
                minHeight: '500vh',
            }}>
                <Box alignContent={'center'}>
                    <audio controls>
                        <source src="https://comaristan.com/%c3%a7ark%c4%b1felek_do%c4%9fru_yan%c4%b1t.wav" type="audio/wav" />
                    </audio>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default AudioPlayer;