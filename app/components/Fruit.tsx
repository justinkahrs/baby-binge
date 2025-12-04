import { Apple, Banana, Cherry } from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
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
    const rotation = `${-rotationRange + progress.value * 2 * rotationRange
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
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const fruits = useMemo<FruitConfig[]>(() => {
    const availableHeight = Math.max(
      height - EDGE_PADDING * 2 - ICON_SIZE,
      ICON_SIZE,
    );

    // In landscape: more columns with fewer fruits each
    // In portrait: 3 columns with more fruits each
    const numColumns = isLandscape ? 5 : 3;
    const fruitsPerColumn = Math.ceil(FRUIT_COUNT / numColumns);

    const verticalSpacing = fruitsPerColumn > 1 ? availableHeight / (fruitsPerColumn - 1) : 0;

    // Calculate column positions with consistent spacing
    const availableWidth = width - EDGE_PADDING * 2 - ICON_SIZE;
    const horizontalSpacing = numColumns > 1 ? availableWidth / (numColumns - 1) : 0;

    const columnPositions: number[] = [];
    for (let col = 0; col < numColumns; col++) {
      columnPositions.push(EDGE_PADDING + col * horizontalSpacing);
    }

    const baseDuration = 1200;
    const fruitsArray: FruitConfig[] = [];
    const fruitTypes: FruitType[] = ["apple", "banana", "cherry"];

    for (let index = 0; index < FRUIT_COUNT; index += 1) {
      const columnIndex = index % numColumns;
      const rowIndex = Math.floor(index / numColumns);
      const type = fruitTypes[index % 3];

      const left = columnPositions[columnIndex];
      const top = EDGE_PADDING + rowIndex * verticalSpacing;
      const amplitude = 10 + Math.random() * 12;
      const rotationRange = 10 + Math.random() * 6;
      const duration = baseDuration;
      const delay = (columnIndex * baseDuration) / numColumns;

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
  }, [width, height, isLandscape]);
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
