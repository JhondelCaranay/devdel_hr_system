// features/Loader.tsx
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface LoaderProps {
  loading?: boolean;
  size?: number;
  color?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  loading = true,
  size = 100,
  color = "oklch(62.3% 0.214 259.815)",
  fullScreen = false,
}) => {
  if (!loading) return null;

  const wrapperStyle: React.CSSProperties = fullScreen
    ? {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(255, 255, 255, 0.6)",
        zIndex: 9999,
      }
    : {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      };

  return (
    <div style={wrapperStyle}>
      <ClipLoader color={color} loading={loading} size={size} />
    </div>
  );
};

export default Loader;
