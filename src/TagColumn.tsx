import { ButtonGroup, Button, Typography, Stack, Box } from '@mui/material';
import { IAudioTrack } from './Interfaces';
import { apiUrl } from './Properties';



export default function TagColumn({ tagName, tracks }: { tagName: string, tracks: IAudioTrack[] }) {
    async function handleClick(trackId: string) {
        const url = apiUrl + 'Audio/Play/463052720509812736?' + new URLSearchParams({
            audioNameOrId: trackId,
            searchById: "true"
        });

        fetch(url, {credentials: 'include'}).then(response => {
            if (response.status == 401) {
                window.location.replace(apiUrl + "Auth/TestLogin");
            }
        });
    }


    return (
        <Stack width={250}>
            <Box p={1} sx={{ bgcolor: 'primary.main', verticalAlign: 'center', textAlign: 'center' }}>
                <Typography variant='h2'>{tagName}</Typography>
            </Box>
            <ButtonGroup orientation='vertical' variant='text'>
                {tracks.map(track => {
                    return (
                        <Button sx={{ bgcolor: 'primary.dark' }} key={track.id} onClick={() => handleClick(track.id)}>{track.name}</Button>
                    );
                })}
            </ButtonGroup>
        </Stack>
    )
}
