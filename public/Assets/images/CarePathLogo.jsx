import React from "react";

const CarePathLogo = ({ width = 180, height = 50, className, style , white}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 320 80"
      className={className}
      style={style}
      role="img"
      aria-label="CarePath logo"
      preserveAspectRatio="xMidYMid meet"
    >
      
      {!white ? (<text
        x="0"
        y="60"
        fontFamily="Alegreya, serif"
        fontWeight="700"
        fontSize="65"
        fill="#14532D"
      >
        CarePath
      </text>) :
      (<text
        x="0"
        y="60"
        fontFamily="Alegreya, serif"
        fontWeight="700"
        fontSize="65"
        fill="#ffffff"
      >
        CarePath
      </text>)}

      {/* '+' sign in black, placed right and vertically aligned */}
      <text
        x="240" // Adjust this horizontal position to control spacing
        y="58"  // Vertical baseline alignment tweak
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="50"
        fill="#000000"
        pointerEvents="none"
        className="pl-2"
      >
        &nbsp;&nbsp;+
      </text>
    </svg>
  );
};

export default CarePathLogo;
