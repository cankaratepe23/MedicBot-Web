

import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from "./App";
import bgImg from './img/12-Dark.webp';
import { useEffect, useRef, useState } from 'react';
import { apiUrl, loginPath } from './Properties';

const AudioPlayer = function AudioPlayer() {

    const audioRef = useRef<HTMLAudioElement>(null);
    const audioSrcUrl = apiUrl.substring(0, apiUrl.length - 1) + window.location.pathname + window.location.search;
    const [audioType, setAudioType] = useState("");

    useEffect(() => {
        const requestUrl = apiUrl.substring(0, apiUrl.length - 1) + window.location.pathname + window.location.search;
        
        fetch(requestUrl, { credentials: 'include', method: 'head' }).then(async response => {
            if (response.status == 401) {
                window.location.href = (apiUrl + loginPath);
                return;
            }

            const audioMimeType = response.headers.get("content-type") || '';
            setAudioType(audioMimeType);
        })
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: 'contain',
                minHeight: '500vh',
            }}>
                <Box alignContent={'center'}>
                    <audio preload='auto' controls ref={audioRef}>
                        <source src={audioSrcUrl} type={audioType}/>
                    </audio>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default AudioPlayer;