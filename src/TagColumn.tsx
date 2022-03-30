import { ButtonGroup, Button, Typography, Stack } from '@mui/material';
import React from 'react';

interface ITagColumnProps {
    tagCollection: {tagName: any, values: number[]};
}

class TagColumn extends React.Component<ITagColumnProps> {
    render() {
        return (
            <Stack>
                <Typography variant='h2'>{this.props.tagCollection.tagName}</Typography>
                <ButtonGroup orientation='vertical' variant='text'>
                {this.props.tagCollection.values.map(value => {
                    return (
                        <Button key={value}>{value}</Button>
                    );
                })}
                </ButtonGroup>
            </Stack>
        )
    }
}

export default TagColumn;