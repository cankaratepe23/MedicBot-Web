import { Masonry } from '@mui/lab';
import { useState, useEffect } from 'react';
import { IAudioTrack } from './Interfaces';
import { apiUrl } from './Properties';
import TagColumn from './TagColumn';

export default function AudioTable() {
    const [trackData, setTrackData] = useState<{ [tagName: string]: IAudioTrack[] }>({});
    const [loadComplete, setLoadComplete] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(apiUrl + 'Audio');
            const jsonData: IAudioTrack[] = await response.json();
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
                    grouped[key] = [track];
                }
            });
            Object.keys(grouped).forEach((key) => { grouped[key].sort((a, b) => { return a.name.localeCompare(b.name) }) })
            setTrackData(grouped);
            setLoadComplete(true); // This somehow prevents React from rendering a half-done (only 1 column visible) Masonry view.
        }
        fetchData();
    }, []);

    return (
        <Masonry sx={{ padding: 2, opacity: loadComplete ? 1 : 0, transition: 'ease-in-out .2s' }} columns={5} spacing={2.5}>
            {
                Object.keys(trackData).sort().map((tagName) => {
                    return (
                        <TagColumn key={tagName} tagName={tagName} tracks={trackData[tagName]} />
                    );
                })
            }
        </Masonry>
    );
}