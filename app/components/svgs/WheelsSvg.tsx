import React from "react";
import Svg, { Circle } from "react-native-svg";

export default function WheelsSvg() {
    return (
        <Svg width={85} height={15} viewBox="0 0 85 15">
            <Circle fill="#FFF" cx={17.289} cy={8.413} r={6.587} />
            <Circle fill="#FFF" cx={71.48} cy={8.412} r={6.586} />
        </Svg>
    );
}
