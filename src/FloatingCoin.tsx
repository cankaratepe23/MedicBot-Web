import React, { useState, useEffect, useRef } from "react";
import { styled, keyframes } from "@mui/material/styles";
import { Stack, Typography } from "@mui/material";

// TypeScript interfaces
interface FloatingCoinProps {
  x: number;
  y: number;
  onAnimationComplete: () => void;
  price: number;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  price: number;
}

interface UseFloatingCoinsReturn {
  coins: Coin[];
  addCoin: (event: React.MouseEvent, price: number) => void;
  removeCoin: (coinId: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

// Define keyframes using MUI's keyframes function
const floatUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-200px) scale(0.7);
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Create styled components using MUI's styled function
const CoinContainer = styled("div")<{
  x: number;
  y: number;
  rotationStart: number;
  rotationEnd: number;
}>(({ theme, x, y, rotationStart, rotationEnd }) => ({
  position: "absolute",
  left: x,
  top: y,
  zIndex: 9999,
  pointerEvents: "none",
  animation: `${floatUp} 3s forwards`,
  transform: `rotate(${rotationStart}deg)`,
  "&::after": {
    content: '""',
    animation: `${spin} 3s linear infinite`,
  },
}));

const OuterCoin = styled("div")(({ theme }) => ({
  width: "32px",
  height: "32px",
  backgroundColor: "#FFD700",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: theme.shadows[2],
  animation: `${spin} 3s infinite`,
}));

const InnerCoin = styled("div")(({ theme }) => ({
  width: "24px",
  height: "24px",
  backgroundColor: "#FFEB3B",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  color: "#B7950B",
}));

// Separate component for floating coins
const FloatingCoin: React.FC<FloatingCoinProps> = ({
  x,
  y,
  onAnimationComplete,
  price
}) => {
  const rotationStart = useRef(Math.random() * 360);
  const rotationEnd = useRef(rotationStart.current + Math.random() * 360 + 360);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <CoinContainer
      x={x}
      y={y}
      rotationStart={rotationStart.current}
      rotationEnd={rotationEnd.current}
    >
      <Stack direction="row" spacing={1} alignItems='center'>
        {price === -1 ? <></> : <Typography textAlign="center">{price}</Typography>}
        <OuterCoin>
          <InnerCoin>$</InnerCoin>
        </OuterCoin>
      </Stack>
    </CoinContainer>
  );
};

// Hook to add floating coin functionality to any component
export const useFloatingCoins = (): UseFloatingCoinsReturn => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const addCoin = (event: React.MouseEvent, price: number): void => {
    if (!containerRef.current || !event) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    const newCoin: Coin = {
      id: Date.now(),
      x,
      y,
      price,
    };

    setCoins((prevCoins) => [...prevCoins, newCoin]);
  };

  const removeCoin = (coinId: number): void => {
    setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== coinId));
  };

  return {
    coins,
    addCoin,
    removeCoin,
    containerRef,
  };
};

export { FloatingCoin };
