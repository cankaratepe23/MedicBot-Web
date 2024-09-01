import { ButtonGroup, Button, Typography, Stack, Box } from '@mui/material';
import { IAudioTrack } from './Interfaces';
import { memo } from 'react';
import AudioButton from './AudioButton';
import { BorderBottom } from '@mui/icons-material';

const TagColumn = memo(function TagColumn({ tagName, tracks, clickCallback }: { tagName: string, tracks: IAudioTrack[], clickCallback: (trackId: string, isRightClick: boolean) => Promise<void> }) {
    return (
        <Stack width={250}>
            {
                tagName === '' ? null :
                    <Box p={1} sx={{ bgcolor: 'primary.main', verticalAlign: 'center', textAlign: 'center' }}>
                        <Typography variant='h2'>{tagName}</Typography>
                    </Box>
            }

            <ButtonGroup orientation='vertical' variant='text' >
                {tracks.map(track => {
                    return (
                        <AudioButton key={track.id} track={track} clickCallback={clickCallback} />
                    );
                })}
            </ButtonGroup>
        </Stack>
    )
});

export default TagColumn;