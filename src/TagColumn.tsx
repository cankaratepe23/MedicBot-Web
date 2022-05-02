import { ButtonGroup, Button, Typography, Stack, Box } from '@mui/material';
import React from 'react';
import { IAudioTrack } from './Interfaces';

interface ITagColumnProps {
    tagName: string;
    tracks: IAudioTrack[];
}

class TagColumn extends React.Component<ITagColumnProps> {
    render() {
        console.log(this.props.tagName);
        return (
            <Stack width={250}>
                <Box p={1} sx={{ bgcolor: 'primary.main', verticalAlign: 'center', textAlign: 'center' }}>
                    <Typography variant='h2'>{this.props.tagName}</Typography>
                </Box>
                <ButtonGroup orientation='vertical' variant='text'>
                    {this.props.tracks.map(track => {
                        return (
                            <Button  sx={{ bgcolor: 'primary.dark' }} key={track.name}>{track.name}</Button>
                        );
                    })}
                </ButtonGroup>
            </Stack>
        )
    }
}

export default TagColumn;