import { Laugh, Smile } from "lucide-react-native";
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
export default function Smileys({
  countPerType = 6,
}: {
  countPerType?: number;
}) {
  const icons = Array.from({ length: countPerType * 2 }).map((_, index) => {
    const isLaugh = index < countPerType;
    const baseY = 40 + Math.random() * (height - 160);
    const bounceAmplitude = 10 + Math.random() * 30;
    return {
      type: isLaugh ? "laugh" : "smile",
      x: useSharedValue(-80),
      y: useSharedValue(baseY - bounceAmplitude),
      baseY,
      bounceAmplitude,
      delay: Math.random() * 3000,
      durationX: 3000 + Math.random() * 2000,
      bounceDuration: 600 + Math.random() * 800,
    };
  });
  useEffect(() => {
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
          withTiming(icon.baseY + icon.bounceAmplitude, {
            duration: icon.bounceDuration,
            easing: Easing.inOut(Easing.quad),
          }),
          -1,
          true
        );
      }, icon.delay);
    });
  }, []);
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
