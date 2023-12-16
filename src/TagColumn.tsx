import { ButtonGroup, Button, Typography, Stack, Box } from '@mui/material';
import React from 'react';
import { IAudioTrack } from './Interfaces';

export default function TagColumn({tagName, tracks}: {tagName: string, tracks: IAudioTrack[]}) {
    return (
        <Stack width={250}>
            <Box p={1} sx={{ bgcolor: 'primary.main', verticalAlign: 'center', textAlign: 'center' }}>
                <Typography variant='h2'>{tagName}</Typography>
            </Box>
            <ButtonGroup orientation='vertical' variant='text'>
                {tracks.map(track => {
                    return (
                        <Button sx={{ bgcolor: 'primary.dark' }} key={track.id}>{track.name}</Button>
                    );
                })}
            </ButtonGroup>
        </Stack>
    )
}
