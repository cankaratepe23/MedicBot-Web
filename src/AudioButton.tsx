import { Button, ButtonGroup, Typography } from "@mui/material";
import { IAudioTrack } from "./Interfaces";
import { memo, useState } from "react";
import { FloatingCoin, useFloatingCoins } from "./FloatingCoin";
import ReactDOM from "react-dom";

const AudioButton = memo(function AudioButton({
  track,
  clickCallback,
  favoriteCallback,
}: {
  track: IAudioTrack;
  clickCallback: (trackId: string, isRightClick: boolean) => Promise<void>;
  favoriteCallback: (track: IAudioTrack) => Promise<void>;
}) {
  const [favoriteButtonHover, setFavoriteButtonHover] = useState(false);
  const { coins, addCoin, removeCoin, containerRef } = useFloatingCoins();

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', overflow: 'visible' }}>
      <ButtonGroup orientation="horizontal" variant="text" fullWidth>
        <Button
          sx={{
            bgcolor: "primary.dark",
            width: "100%",
          }}
          fullWidth={false}
          key={track.id}
          onClick={(e) => {
            clickCallback(track.id, false);
            addCoin(e);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            const targetButton = e.currentTarget;
            clickCallback(track.id, true);
            const prevName = e.currentTarget.innerHTML;
            targetButton.innerHTML = "Copied URL!";
            const timer = setTimeout(() => {
              targetButton.innerHTML = prevName;
            }, 1000);
          }}
        >
          {track.name}
        </Button>
        <Button
          sx={{
            color: track.isFavorite
              ? "gold"
              : favoriteButtonHover
              ? "#EEE"
              : "#666",
            bgcolor: "primary.dark",
            "&:hover": { bgcolor: "primary.dark" },
            transition: "ease-in-out .2s",
            padding: 0,
            paddingBottom: 0.5,
            lineHeight: "1rem",
            fontSize: "1.5rem",
            fontWeight: 100,
          }}
          fullWidth={false}
          onMouseEnter={(e) => {
            setFavoriteButtonHover(true);
          }}
          onMouseLeave={(e) => {
            setFavoriteButtonHover(false);
          }}
          onClick={(e) => {
            favoriteCallback(track);
          }}
        >
          {favoriteButtonHover ? "☆" : track.isFavorite ? "★" : "☆"}
        </Button>
      </ButtonGroup>
      {coins.map((coin) => (
        ReactDOM.createPortal(<FloatingCoin
          key={coin.id}
          x={coin.x + (containerRef.current?.getBoundingClientRect().left || 0)}
          y={coin.y + (containerRef.current?.getBoundingClientRect().top || 0)}
          onAnimationComplete={() => removeCoin(coin.id)}
        />, document.body)
      ))}
    </div>
  );
});

export default AudioButton;
