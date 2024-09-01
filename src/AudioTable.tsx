import { Masonry } from '@mui/lab';
import { useState, useEffect, memo, useLayoutEffect } from 'react';
import { IAudioTrack } from './Interfaces';
import { apiUrl, loginPath } from './Properties';
import TagColumn from './TagColumn';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Accordion, AccordionDetails, AccordionSummary, Button, ButtonGroup, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import AudioButton from './AudioButton';

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
    return trackList.filter(t => t.name.includes(query.toLowerCase()) || t.aliases.some(t => t.includes(query.toLowerCase())));
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

const AudioTable = memo(function AudioTable({ clickCallback, query }: { clickCallback: (trackId: string, isRightClick: boolean) => Promise<void>; query: string }) {
    const [trackData, setTrackData] = useState<{ [tagName: string]: IAudioTrack[] }>({});
    const [untaggedTrackData, setUntaggedTrackData] = useState<IAudioTrack[]>([]);
    const [loadComplete, setLoadComplete] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(apiUrl + 'Audio?enriched=true', { credentials: 'include' });
            if (response.status == 401) {
                window.location.href = (apiUrl + loginPath);
                return;
            }
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

    const favoritesUntagged = filteredUntagged.filter(a => a.isFavorite);
    const recentsUntagged = [];
    return (
        <Grid container spacing={2} columns={{ xs: 1, sm: 2 }}>
            <Grid xs={1}>
                <Accordion defaultExpanded>
                    <AccordionSummary id='favorites-header' aria-controls='favorites-content' expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                        <StarIcon sx={{ mr: 0.5, color: 'gold' }} /><Typography sx={{ lineHeight: '145%' }}>Favorites</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            favoritesUntagged.length == 0 ? <Typography color={'text.secondary'}>No favorites yet!</Typography> :
                                <Grid container columns={{ xs: 1, sm: 2, lg: 5 }} spacing={1}>
                                    {
                                        favoritesUntagged.map(t => {
                                            return (
                                                <Grid xs={1} key={'fav-container_' + t.id}>
                                                    <AudioButton clickCallback={clickCallback} track={t} key={'fav_' + t.id} />
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                        }
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid xs={1} >
                <Accordion defaultExpanded>
                    <AccordionSummary id='favorites-header' aria-controls='favorites-content' expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                        <HistoryIcon sx={{ mr: 0.5 }} /><Typography sx={{ lineHeight: '145%' }}>Recent Tracks</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            recentsUntagged.length == 0 ? <Typography color={'text.secondary'}>Recently played sounds will be shown here.</Typography> :
                                <Typography>Lorem ipsum</Typography>
                        }
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Masonry sx={{ opacity: loadComplete ? 1 : 0, transition: 'ease-in-out .2s' }} columns={{ xs: 3, sm: 5 }} spacing={{ xs: 1.5, sm: 2.5 }}>
                    {
                        splitArrayIntoChunks(filteredUntagged, 5).map((chunk: IAudioTrack[], i: number) => {
                            return (
                                <TagColumn key={'!no_tag' + i} tagName='' tracks={chunk} clickCallback={clickCallback} />
                            )
                        }).concat(
                            Object.keys(filteredTagged).sort().map((tagName) => {
                                return (
                                    <TagColumn key={tagName} tagName={tagName} tracks={filteredTagged[tagName]} clickCallback={clickCallback} />
                                );
                            }))
                    }
                </Masonry>
            </Grid>
        </Grid>
    );
})

export default AudioTable;