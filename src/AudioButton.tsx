import { Stack, Button, ButtonGroup } from "@mui/material";
import { IAudioTrack } from "./Interfaces";
import { memo, useState } from "react";
import { apiUrl } from "./Properties";

const AudioButton = memo(function AudioButton({ track, clickCallback, favoriteCallback }: { track: IAudioTrack, clickCallback: (trackId: string, isRightClick: boolean) => Promise<void>, favoriteCallback: (track: IAudioTrack) => Promise<void> }) {

    const [favoriteButtonHover, setFavoriteButtonHover] = useState(false);
    return (
        <ButtonGroup orientation='horizontal' variant="text" fullWidth>
            <Button sx={{
                bgcolor: 'primary.dark',
                width: '100%'
            }}
                fullWidth={false}
                key={track.id}
                onClick={() => clickCallback(track.id, false)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    const targetButton = e.currentTarget;
                    clickCallback(track.id, true);
                    const prevName = e.currentTarget.innerHTML;
                    targetButton.innerHTML = "Copied URL!";
                    const timer = setTimeout(() => {
                        targetButton.innerHTML = prevName;
                    }, 1000)
                }}>{track.name}</Button>
            <Button sx={{
                color: track.isFavorite ? 'gold' : favoriteButtonHover ? '#EEE' : '#666',
                bgcolor: 'primary.dark',
                "&:hover": { bgcolor: 'primary.dark' },
                transition: 'ease-in-out .2s',
                padding: 0,
                paddingBottom: 0.5,
                lineHeight: '1rem',
                fontSize: '1.5rem',
                fontWeight: 100
            }}
                fullWidth={false}
                onMouseEnter={e => { setFavoriteButtonHover(true); }}
                onMouseLeave={e => { setFavoriteButtonHover(false); }}
                onClick={e => { favoriteCallback(track); }}>
                {favoriteButtonHover ? '☆' : track.isFavorite ? '★' : '☆'}
            </Button>
        </ButtonGroup>
    );
});

export default AudioButton;