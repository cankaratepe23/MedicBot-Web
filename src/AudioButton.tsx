import { Stack, Button } from "@mui/material";
import { IAudioTrack } from "./Interfaces";
import { useState } from "react";

const AudioButton = function AudioButton({ track, clickCallback }: { track: IAudioTrack, clickCallback: (trackId: string, isRightClick: boolean) => Promise<void> }) {

    const [showFavouriteButton, setShowFavouriteButton] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);

    return (
        <Stack direction='row'>
            <Button sx={{ bgcolor: 'primary.dark', width: '100%' }}
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
                            color: isFavourite ? 'gold' : showFavouriteButton ? '#EEE' : '#666',
                            bgcolor: 'primary.dark',
                            transition: 'ease-in-out .2s',
                            padding: 0,
                            paddingBottom: 0.5,
                            lineHeight: '1rem',
                            fontSize: '1.5rem',
                            fontWeight: 100
                    }}
                    onMouseEnter={e => {setShowFavouriteButton(true);}}
                    onMouseLeave={e => {setShowFavouriteButton(false);}}
                    onClick={e => {setIsFavourite(!isFavourite);}}>
                {isFavourite ? '★' : '☆'}
            </Button>
        </Stack>
    );
}

export default AudioButton;