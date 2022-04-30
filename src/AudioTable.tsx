import { Stack } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { IAudioTrack } from './Interfaces';
import { apiUrl } from './Properties';
import TagColumn from './TagColumn';
class AudioTable extends React.Component<{}, { trackData: { [tagName: string]: IAudioTrack[] }}> {
    constructor(props: any) {
        super(props);
        this.state = {
            trackData: {}
        };
    }

    componentDidMount() {
        axios.get(apiUrl + 'Audio/Get').then((response) => {
            const jsonData: IAudioTrack[] = response.data;
            const grouped: { [tagName: string]: IAudioTrack[] } = {};
            jsonData.forEach((track) => {
                let key;
                if (track.tags && track.tags[0]) {
                    key = track.tags[0];
                }
                else {
                    key = "!no_tag"
                }
                if (grouped[key]) {
                    grouped[key].push(track);
                }
                else {
                    grouped[key] = [];
                }
            });
            this.setState({ trackData: grouped })
        })
    }

    render() {
        return (
            <Stack direction="row" justifyContent='center' spacing={2}>
                {
                    Object.keys(this.state.trackData).map((tagName) => {
                        return (
                            <TagColumn key={tagName} tagName={tagName} tracks={this.state.trackData[tagName]} />
                        );
                    })
                }
            </Stack>
        )
    }

}

export default AudioTable;