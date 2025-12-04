import { Laugh, Smile } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function Smileys({
  countPerType = 6,
}: {
  countPerType?: number;
}) {
  const { width, height } = useWindowDimensions();

  const icons = useRef(
    Array.from({ length: countPerType * 2 }).map((_, index) => {
      const isLaugh = index < countPerType;
      return {
        type: isLaugh ? "laugh" : "smile",
        x: useSharedValue(-80),
        y: useSharedValue(0),
        baseY: useSharedValue(0), // Changed to shared value
        bounceAmplitude: 10 + Math.random() * 30,
        delay: Math.random() * 3000,
        durationX: 3000 + Math.random() * 2000,
        bounceDuration: 600 + Math.random() * 800,
      };
    }),
  ).current;

  useEffect(() => {
    // Update positions based on current dimensions
    icons.forEach((icon) => {
      const baseY = 40 + Math.random() * (height - 160);
      icon.baseY.value = baseY; // Now accessing .value
      icon.y.value = baseY - icon.bounceAmplitude;
    });

    icons.forEach((icon) => {
      setTimeout(() => {
        icon.x.value = withRepeat(
          withTiming(width + 100, {
            duration: icon.durationX,
            easing: Easing.linear,
          }),
          -1,
          false
        );
        icon.y.value = withRepeat(
          withTiming(icon.baseY.value + icon.bounceAmplitude, { // Now accessing .value
            duration: icon.bounceDuration,
            easing: Easing.inOut(Easing.quad),
          }),
          -1,
          true
        );
      }, icon.delay);
    });
  }, [width, height, icons]);
  return (
    <>
      {icons.map((icon, i) => {
        const style = useAnimatedStyle(() => ({
          position: "absolute",
          transform: [
            { translateX: icon.x.value },
            { translateY: icon.y.value },
          ],
        }));
        return (
          <Animated.View key={i} style={style}>
            {icon.type === "laugh" ? (
              <Laugh color="yellow" size={48} />
            ) : (
              <Smile color="yellow" size={48} />
            )}
          </Animated.View>
        );
      })}
    </>
  );
}
