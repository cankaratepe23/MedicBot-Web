import { Button, Menu, MenuItem } from "@mui/material";
import { memo, useEffect, useState } from "react";


const AudioButton = memo(function AudioButton({ trackName, trackId, clickCallback }: { trackName: string, trackId: string, clickCallback: (trackId: string) => Promise<void> }) {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleRightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button fullWidth sx={{ bgcolor: 'primary.dark' }} key={trackId} onClick={() => clickCallback(trackId)} onContextMenu={handleRightClick}>{trackName}</Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </div>
    )
});

export default AudioButton;