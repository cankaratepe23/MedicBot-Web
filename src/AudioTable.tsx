import { Masonry } from '@mui/lab';
import { useState, useEffect, memo } from 'react';
import { IAudioTrack } from './Interfaces';
import { apiUrl } from './Properties';
import TagColumn from './TagColumn';

const splitArrayIntoChunks = (array: any[], n: number) => {
    const chunkSize = Math.ceil(array.length / n);
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

const filterTrackList = (trackList: IAudioTrack[], query: string) => {
    if (!query) {
        return trackList;
    }
    return trackList.filter(t => t.name.includes(query) || t.aliases.some(t => t.includes(query)));
}

const filterTrackData = (trackData: { [tagName: string]: IAudioTrack[] }, query: string) => {
    if (!query) {
        return trackData;
    }
    const filteredTrackData: { [tagName: string]: IAudioTrack[] } = {};
    Object.keys(trackData).forEach((tagName) => {
        const filteredTagGroup = filterTrackList(trackData[tagName], query);
        if (filteredTagGroup.length != 0) {
            filteredTrackData[tagName] = filteredTagGroup;
        }
    });
    return filteredTrackData;
}

const AudioTable = memo(function AudioTable({clickCallback, query}: {clickCallback: (trackId: string) => Promise<void>; query: string}) {
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

    const filteredUntagged = filterTrackList(untaggedTrackData, query);
    const filteredTagged = filterTrackData(trackData, query);
    return (
        <Masonry sx={{ opacity: loadComplete ? 1 : 0, transition: 'ease-in-out .2s' }} columns={{ xs: 3, sm: 5 }} spacing={2.5}>
            {
                splitArrayIntoChunks(filteredUntagged, 5).map((chunk: IAudioTrack[], i: number) => {
                    return (
                        <TagColumn key={'!no_tag' + i} tagName='' tracks={chunk} clickCallback={clickCallback} />
                    )
                }).concat(
                Object.keys(filteredTagged).sort().map((tagName) => {
                    return (
                        <TagColumn key={tagName} tagName={tagName} tracks={filterTrackList(filteredTagged[tagName], query)} clickCallback={clickCallback}/>
                    );
                }))
            }
        </Masonry>
    );
})

export default AudioTable;