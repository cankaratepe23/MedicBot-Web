import { ButtonGroup, Button, Typography, Stack, Box } from '@mui/material';
import { IAudioTrack } from './Interfaces';
import { memo } from 'react';



const TagColumn  = memo(function TagColumn({ tagName, tracks, clickCallback }: { tagName: string, tracks: IAudioTrack[], clickCallback: (trackId: string, isRightClick: boolean) => Promise<void> }) {
    return (
        <Stack width={250}>
            <Box p={1} sx={{ bgcolor: 'primary.main', verticalAlign: 'center', textAlign: 'center' }}>
                <Typography variant='h2'>{tagName}</Typography>
            </Box>
            <ButtonGroup orientation='vertical' variant='text'>
                {tracks.map(track => {
                    return (
                        <Button sx={{ bgcolor: 'primary.dark' }}
                                key={track.id}
                                onClick={() => clickCallback(track.id, false)}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    const targetButton = e.currentTarget;
                                    clickCallback(track.id, true);
                                    const prevName = e.currentTarget.innerHTML;
                                    targetButton.innerHTML = "Copied URL!";
                                    const timer = setTimeout(() => {
                                        targetButton.innerHTML = prevName;
                                    }, 1000)
                                }}>{track.name}</Button>
                    );
                })}
            </ButtonGroup>
        </Stack>
    )
});

export default TagColumn;