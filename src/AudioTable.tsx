import { Masonry } from './CustomMasonry';
import { useState, useEffect, memo, useLayoutEffect } from 'react';
import { IAudioTrack } from './Interfaces';
import { apiUrl, loginPath } from './Properties';
import TagColumn from './TagColumn';
import Grid from '@mui/material/Grid2/Grid2';
import { Accordion, AccordionDetails, AccordionSummary, Button, ButtonGroup, Stack, Typography, useTheme } from '@mui/material';
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
    return trackList.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.aliases.some(t => t.toLowerCase().includes(query.toLowerCase())));
}

const filterGroupedTracks = (trackData: { [tagName: string]: IAudioTrack[] }, query: string) => {
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
    const [tracksByTag, setTracksByTag] = useState<{ [tagName: string]: IAudioTrack[] }>({});
    const [untaggedTracks, setUntaggedTracks] = useState<IAudioTrack[]>([]);
    const [favoriteTracks, setFavoriteTracks] = useState<IAudioTrack[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(apiUrl + 'Audio?enriched=true', { credentials: 'include' });
            if (response.status == 401) {
                window.location.href = (apiUrl + loginPath);
                return;
            }
            const allTracks: IAudioTrack[] = await response.json();
            // This only takes 2ms on my desktop...
            allTracks.sort((a, b) => { return a.name.localeCompare(b.name) });
            const tracksGroupedByTag: { [tagName: string]: IAudioTrack[] } = {};
            const tracksWithoutTag: IAudioTrack[] = [];
            allTracks.forEach((track) => {
                let key;
                if (track.tags && track.tags[0]) {
                    key = track.tags[0];
                    if (tracksGroupedByTag[key]) {
                        tracksGroupedByTag[key].push(track);
                    }
                    else {
                        tracksGroupedByTag[key] = [track];
                    }
                }
                else {
                    tracksWithoutTag.push(track);
                }

            });
            setTracksByTag(tracksGroupedByTag);
            setUntaggedTracks(tracksWithoutTag); // TODO Seems unnecessary to keep this in two variables
            setFavoriteTracks(allTracks.filter(t => t.isFavorite));
        }
        fetchData();
    }, []);

    const filteredUntagged = filterTrackList(untaggedTracks, query);
    const filteredTagged = filterGroupedTracks(tracksByTag, query);

    const filteredFavorites = filterTrackList(favoriteTracks, query);
    const recentTracks = [];

    const theme = useTheme();
    return (
        <Grid container spacing={2} columns={{ xs: 1, sm: 2 }}>
            <Grid size={1} >
                <Accordion defaultExpanded>
                    <AccordionSummary id='favorites-header' aria-controls='favorites-content' expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                        <StarIcon sx={{ mr: 0.5, color: 'gold' }} /><Typography sx={{ lineHeight: '145%' }}>Favorites</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            filteredFavorites.length == 0 ? <Typography color={'text.secondary'}>No favorites yet!</Typography> :
                                <Masonry columns={{ [theme.breakpoints.values.sm]: 1, [theme.breakpoints.values.lg]: 2, default: 5 }} spacing={{default: 8}}>
                                    {
                                        filteredFavorites.map(t => {
                                            return (
                                                <AudioButton clickCallback={clickCallback} track={t} key={'fav_' + t.id} />
                                            )
                                        })
                                    }
                                </Masonry>
                        }
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid size={1} >
                <Accordion defaultExpanded>
                    <AccordionSummary id='favorites-header' aria-controls='favorites-content' expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                        <HistoryIcon sx={{ mr: 0.5 }} /><Typography sx={{ lineHeight: '145%' }}>Recent Tracks</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            recentTracks.length == 0 ? <Typography color={'text.secondary'}>Recently played sounds will be shown here.</Typography> :
                                <Typography>Lorem ipsum</Typography>
                        }
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid size={12}>
                <Masonry columns={{ [theme.breakpoints.values.sm]: 3,  default: 5 }} spacing={{ 600: 20, default: 12}} >
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