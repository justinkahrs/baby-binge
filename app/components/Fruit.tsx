import { Apple, Banana, Cherry } from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
type FruitType = "apple" | "banana" | "cherry";
const { width, height } = Dimensions.get("window");
const FRUIT_COUNT = 24;
const ICON_SIZE = 40;
const EDGE_PADDING = 32;
type FruitConfig = {
  id: string;
  type: FruitType;
  left: number;
  top: number;
  amplitude: number;
  rotationRange: number;
  duration: number;
  delay: number;
};
type FruitIconProps = {
  type: FruitType;
  size: number;
};
type BouncingFruitIconProps = {
  type: FruitType;
  left: number;
  top: number;
  amplitude: number;
  rotationRange: number;
  duration: number;
  delay: number;
};
function FruitIcon({ type, size }: FruitIconProps) {
  if (type === "apple") {
    return <Apple width={size} height={size} color="#22c55e" />;
  }
  if (type === "banana") {
    return <Banana width={size} height={size} color="#facc15" />;
  }
  return <Cherry width={size} height={size} color="#ef4444" />;
}
function BouncingFruitIcon({
  type,
  left,
  top,
  amplitude,
  rotationRange,
  duration,
  delay,
}: BouncingFruitIconProps) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {
            duration,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(0, {
            duration,
            easing: Easing.inOut(Easing.quad),
          }),
        ),
        -1,
        true,
      ),
    );
  }, [delay, duration, progress]);
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = -amplitude * progress.value;
    const rotation = `${
      -rotationRange + progress.value * 2 * rotationRange
    }deg`;
    return {
      transform: [{ translateY }, { rotate: rotation }],
    };
  });
  return (
    <Animated.View
      style={[
        styles.iconContainer,
        animatedStyle,
        {
          left,
          top,
        },
      ]}
    >
      <FruitIcon type={type} size={ICON_SIZE} />
    </Animated.View>
  );
}
export default function BouncingFruit() {
  const fruits = useMemo<FruitConfig[]>(() => {
    const availableHeight = Math.max(
      height - EDGE_PADDING * 2 - ICON_SIZE,
      ICON_SIZE,
    );
    const basePerType = Math.floor(FRUIT_COUNT / 3);
    const remainder = FRUIT_COUNT % 3;
    const maxRows = basePerType + (remainder > 0 ? 1 : 0);
    const verticalSpacing = maxRows > 1 ? availableHeight / (maxRows - 1) : 0;
    const columnPositions: Record<FruitType, number> = {
      apple: EDGE_PADDING,
      banana: width / 2 - ICON_SIZE / 2,
      cherry: width - EDGE_PADDING - ICON_SIZE,
    };
    const baseDuration = 1200;
    const typeDelays: Record<FruitType, number> = {
      apple: 0,
      banana: baseDuration / 3,
      cherry: (2 * baseDuration) / 3,
    };
    let appleCount = 0;
    let bananaCount = 0;
    let cherryCount = 0;
    const fruitsArray: FruitConfig[] = [];
    for (let index = 0; index < FRUIT_COUNT; index += 1) {
      const typeIndex = index % 3;
      const type: FruitType =
        typeIndex === 0 ? "apple" : typeIndex === 1 ? "banana" : "cherry";
      let rowIndexForType = 0;
      if (type === "apple") {
        rowIndexForType = appleCount;
        appleCount += 1;
      } else if (type === "banana") {
        rowIndexForType = bananaCount;
        bananaCount += 1;
      } else {
        rowIndexForType = cherryCount;
        cherryCount += 1;
      }
      const left = columnPositions[type];
      const top = EDGE_PADDING + rowIndexForType * verticalSpacing;
      const amplitude = 10 + Math.random() * 12;
      const rotationRange = 10 + Math.random() * 6;
      const duration = baseDuration;
      const delay = typeDelays[type];
      fruitsArray.push({
        id: `fruit-${index}`,
        type,
        left,
        top,
        amplitude,
        rotationRange,
        duration,
        delay,
      });
    }
    return fruitsArray;
  }, []);
  return (
    <View style={styles.container}>
      {fruits.map((fruit) => (
        <BouncingFruitIcon
          key={fruit.id}
          type={fruit.type}
          left={fruit.left}
          top={fruit.top}
          amplitude={fruit.amplitude}
          rotationRange={fruit.rotationRange}
          duration={fruit.duration}
          delay={fruit.delay}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    position: "absolute",
  },
});
