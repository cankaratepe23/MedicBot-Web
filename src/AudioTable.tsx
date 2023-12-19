import { Masonry } from '@mui/lab';
import { useState, useEffect } from 'react';
import { IAudioTrack } from './Interfaces';
import { apiUrl } from './Properties';
import TagColumn from './TagColumn';

export default function AudioTable() {
    const [trackData, setTrackData] = useState<{ [tagName: string]: IAudioTrack[] }>({});
    const [untaggedTrackData, setUntaggedTrackData] = useState<IAudioTrack[]>([]);
    const [loadComplete, setLoadComplete] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(apiUrl + 'Audio');
            const jsonData: IAudioTrack[] = await response.json();
            const grouped: { [tagName: string]: IAudioTrack[] } = {};
            const nongrouped: IAudioTrack[] = [];
            jsonData.forEach((track) => {
                let key;
                if (track.tags && track.tags[0]) {
                    key = track.tags[0];
                    if (grouped[key]) {
                        grouped[key].push(track);
                    }
                    else {
                        grouped[key] = [track];
                    }
                }
                else {
                    nongrouped.push(track);
                }
                
            });
            Object.keys(grouped).forEach((key) => { grouped[key].sort((a, b) => { return a.name.localeCompare(b.name) }) })
            setTrackData(grouped);
            setUntaggedTrackData(nongrouped.sort((a, b) => { return a.name.localeCompare(b.name) }));
            setLoadComplete(true); // This somehow prevents React from rendering a half-done (only 1 column visible) Masonry view.
        }
        fetchData();
    }, []);

    function splitArrayIntoChunks(array: any[], n: number) {
        const chunkSize = Math.ceil(array.length / n);
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    return (
        <Masonry sx={{ opacity: loadComplete ? 1 : 0, transition: 'ease-in-out .2s' }} columns={5} spacing={2.5}>
            {
                splitArrayIntoChunks(untaggedTrackData, 5).map((chunk: IAudioTrack[], i: number) => {
                    return (
                        <TagColumn key={'!no_tag' + i} tagName='' tracks={chunk} />
                    )
                }).concat(
                Object.keys(trackData).filter((t) => t != '!no_tag').sort().map((tagName) => {
                    return (
                        <TagColumn key={tagName} tagName={tagName} tracks={trackData[tagName]} />
                    );
                }))
            }
        </Masonry>
    );
}