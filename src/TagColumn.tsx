import { ButtonGroup, Button, Typography, Stack, Box } from '@mui/material';
import { IAudioTrack } from './Interfaces';
import { memo } from 'react';



const TagColumn  = memo(function TagColumn({ tagName, tracks, clickCallback }: { tagName: string, tracks: IAudioTrack[], clickCallback: (trackId: string) => Promise<void> }) {
    return (
        <Stack width={250}>
            <Box p={1} sx={{ bgcolor: 'primary.main', verticalAlign: 'center', textAlign: 'center' }}>
                <Typography variant='h2'>{tagName}</Typography>
            </Box>
            <ButtonGroup orientation='vertical' variant='text'>
                {tracks.map(track => {
                    return (
                        <Button sx={{ bgcolor: 'primary.dark' }} key={track.id} onClick={() => clickCallback(track.id)}>{track.name}</Button>
                    );
                })}
            </ButtonGroup>
        </Stack>
    )
});

export default TagColumn;