import { Masonry } from './CustomMasonry';
import { useState, useEffect, memo, useLayoutEffect, useCallback } from 'react';
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

const AudioTable = memo(function AudioTable({ clickCallback, query }: { clickCallback: (trackId: string, isRightClick: boolean) => Promise<void>; query: string }) {
    const [tracks, setTracks] = useState<IAudioTrack[]>([]);
    const [recents, setRecents] = useState<IAudioTrack[]>([]);

    const toggleFavorite = useCallback(async (track: IAudioTrack) => {
        const httpMethod = track.isFavorite ? "delete" : "post";
        fetch(apiUrl + 'User/@me/Favorites/' + track.id, { credentials: 'include', method: httpMethod }).then(response => {
            if (response.ok) {
                setTracks(prevTracks => prevTracks.map(t => t.id === track.id ? {...track, isFavorite: !track.isFavorite} : t));
            }
        });
    }, []);

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
            setTracks(allTracks);
        }
        const fetchRecents = async () => {
            const response = await fetch(apiUrl + 'Audio/Recents', { credentials: 'include' });
            if (response.status == 401) {
                window.location.href = (apiUrl + loginPath);
                return;
            }
            const recentTracksWithCounts: Array<{ audioTrackDto: IAudioTrack; count: number }> = await response.json();
            recentTracksWithCounts.sort((a, b) => (a > b ? -1 : 1));
            const recentTracks: IAudioTrack[] = recentTracksWithCounts.map(r => r.audioTrackDto);
            setRecents(recentTracks);
        }
        fetchData();
        fetchRecents();
    }, []);

    const filteredTracks = filterTrackList(tracks, query);
    const filteredFavorites = filterTrackList(tracks.filter(t => t.isFavorite), query);
    const filteredRecents = filterTrackList(recents, query);

    const tracksGroupedByTag: { [tagName: string]: IAudioTrack[] } = {};
    const tracksWithoutTag: IAudioTrack[] = [];
    filteredTracks.forEach((track) => {
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
                                                <AudioButton clickCallback={clickCallback} favoriteCallback={toggleFavorite} track={t} key={t.id} />
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
                            filteredRecents.length == 0 ? <Typography color={'text.secondary'}>Recently played sounds will be shown here.</Typography> :
                                <Masonry columns={{ [theme.breakpoints.values.sm]: 1, [theme.breakpoints.values.lg]: 2, default: 5 }} spacing={{ default: 8 }}>
                                    {
                                        filteredRecents.map(t => {
                                            return (
                                                <AudioButton clickCallback={clickCallback} favoriteCallback={toggleFavorite} track={t} key={t.id} />
                                            )
                                        })
                                    }
                                </Masonry>}
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid size={12}>
                <Masonry columns={{ [theme.breakpoints.values.sm]: 3,  default: 5 }} spacing={{ 600: 20, default: 12}} >
                    {
                        splitArrayIntoChunks(tracksWithoutTag, 5).map((chunk: IAudioTrack[], i: number) => {
                            return (
                                <TagColumn key={'!no_tag' + i} tagName='' tracks={chunk} clickCallback={clickCallback} favoriteCallback={toggleFavorite} />
                            )
                        }).concat(
                            Object.keys(tracksGroupedByTag).sort().map((tagName) => {
                                return (
                                    <TagColumn key={tagName} tagName={tagName} tracks={tracksGroupedByTag[tagName]} clickCallback={clickCallback} favoriteCallback={toggleFavorite} />
                                );
                            }))
                    }
                </Masonry>
            </Grid>
        </Grid>
    );
})

export default AudioTable;