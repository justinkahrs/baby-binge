import { Heart } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function HeartsAnimation({ count = 16 }: { count?: number }) {
  const hearts = React.useRef(
    Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      scale: 0.5 + Math.random() * 1.2,
      delay: Math.random() * 4000,
      y: useSharedValue(height + 50),
    })),
  ).current;
  useEffect(() => {
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
  }, [hearts]);
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
