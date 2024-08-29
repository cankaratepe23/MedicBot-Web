import { Stack, Button } from "@mui/material";
import { IAudioTrack } from "./Interfaces";
import { useState } from "react";

const AudioButton = function AudioButton({ track, clickCallback }: { track: IAudioTrack, clickCallback: (trackId: string, isRightClick: boolean) => Promise<void> }) {

    const [showFavouriteButton, setShowFavouriteButton] = useState(false);

    return (
        <Stack direction='row' sx={{ position: 'relative' }}>
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
                            bgcolor: 'transparent',
                            position: 'absolute',
                            right: '0px',
                            height: '100%',
                            transition: 'ease-in-out .1s',
                            fontSize: '1.5rem',
                            opacity: showFavouriteButton ? 0 : 1 }}
                    onMouseEnter={e => {setShowFavouriteButton(true);}}
                    onMouseLeave={e => {setShowFavouriteButton(false);}}>
                ☆
            </Button>
        </Stack>
    );
}

export default AudioButton;