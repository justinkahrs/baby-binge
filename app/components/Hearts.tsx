import { Heart } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function HeartsAnimation({ count = 16 }: { count?: number }) {
  const { width, height } = useWindowDimensions();

  const hearts = useRef(
    Array.from({ length: count }).map(() => ({
      x: 0,
      scale: 0.5 + Math.random() * 1.2,
      delay: Math.random() * 4000,
      y: useSharedValue(0),
    })),
  ).current;
  useEffect(() => {
    // Update positions based on current dimensions
    hearts.forEach((h) => {
      h.x = Math.random() * width;
      h.y.value = height + 50;
    });

    const timeouts = hearts.map((h) =>
      setTimeout(() => {
        h.y.value = withRepeat(
          withTiming(-120, {
            duration: 4000 + Math.random() * 2000,
            easing: Easing.linear,
          }),
          -1,
          false,
        );
      }, h.delay),
    );
    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [hearts, width, height]);
  return (
    <>
      {hearts.map((h, i) => {
        const style = useAnimatedStyle(() => ({
          position: "absolute",
          transform: [
            { translateX: h.x },
            { translateY: h.y.value },
            { scale: h.scale },
          ],
        }));
        return (
          <Animated.View key={i} style={style}>
            <Heart color="#ff4d6d" size={32} />
          </Animated.View>
        );
      })}
    </>
  );
}
