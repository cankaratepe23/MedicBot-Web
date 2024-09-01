import { Stack, Button, ButtonGroup } from "@mui/material";
import { IAudioTrack } from "./Interfaces";
import { useState } from "react";
import { apiUrl } from "./Properties";

const AudioButton = function AudioButton({ track, clickCallback }: { track: IAudioTrack, clickCallback: (trackId: string, isRightClick: boolean) => Promise<void> }) {

    const [showFavouriteButton, setShowFavouriteButton] = useState(false);
    const [isFavorite, setIsFavorite] = useState(track.isFavorite);

    function toggleFavorite() {
        const httpMethod = isFavorite ? "delete" : "post";
        fetch(apiUrl + 'User/@me/Favorites/' + track.id, { credentials: 'include', method: httpMethod }).then(response => {
            if (response.ok) {
                setIsFavorite(!isFavorite);
            }
        });
    }

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
                color: isFavorite ? 'gold' : showFavouriteButton ? '#EEE' : '#666',
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
                onMouseEnter={e => { setShowFavouriteButton(true); }}
                onMouseLeave={e => { setShowFavouriteButton(false); }}
                onClick={e => { toggleFavorite(); }}>
                {isFavorite ? '★' : '☆'}
            </Button>
        </ButtonGroup>
    );
}

export default AudioButton;