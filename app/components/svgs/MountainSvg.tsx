import React from "react";
import Svg, { Polygon } from "react-native-svg";

export default function MountainSvg() {
    return (
        <Svg width={200} height={150} viewBox="0 0 200 150">
            <Polygon
                fill="#4DB6AC"
                points="100,0 200,150 0,150"
            />
        </Svg>
    );
}
