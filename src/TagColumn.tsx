import { ButtonGroup, Button, Typography, Stack, Box } from '@mui/material';
import { red } from '@mui/material/colors';
import React from 'react';

interface ITagColumnProps {
    tagCollection: { tagName: any, values: string[] };
}

class TagColumn extends React.Component<ITagColumnProps> {
    render() {
        return (
            <Stack>
                <Box p={1} sx={{ bgcolor: 'primary.main', verticalAlign: 'center', textAlign: 'center' }}>
                    <Typography variant='h2'>{this.props.tagCollection.tagName}</Typography>
                </Box>
                <ButtonGroup orientation='vertical' variant='text'>
                    {this.props.tagCollection.values.map(value => {
                        return (
                            <Button  sx={{ bgcolor: 'primary.dark' }} key={value}>{value}</Button>
                        );
                    })}
                </ButtonGroup>
            </Stack>
        )
    }
}

export default TagColumn;