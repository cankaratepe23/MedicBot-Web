import { Stack } from '@mui/material';
import React from 'react';
import TagColumn from './TagColumn';
class AudioTable extends React.Component {
    render() {
        const jsonData = [{"tagName":"tag 1","values":["Lorem", "ipsum", "dolor", "sit"]},{"tagName":"tag 2","values":["amet", "consectetur", "adipiscing"]},{"tagName":"tag three","values":["elit", "Pellentesque", "maximus", "ex enim", "quis"]},{"tagName":"tag four","values":["fermentum", "mauris", "eleifend ut"]}];
        return (
            <Stack direction="row" justifyContent='center' spacing={2}>
                {jsonData.map((tagCollection) => {
                    return (
                        <TagColumn key={tagCollection.tagName} tagCollection={tagCollection}/>
                    );
                })}
            </Stack>
        )
    }

}

export default AudioTable;