import { Stack } from '@mui/material';
import React from 'react';
import TagColumn from './TagColumn';
class AudioTable extends React.Component {
    render() {
        const jsonData = [{"tagName":"anan","values":[1,2,3,4]},{"tagName":"baban","values":[5,6,7,8]},{"tagName":"caca","values":[9,10,11,12]},{"tagName":"pepe","values":[13,14,15,16]}];
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