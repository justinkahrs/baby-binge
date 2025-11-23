import { Sparkle, Sparkles, Star } from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
type StarType = "sparkle" | "sparkles" | "star";
const { width, height } = Dimensions.get("window");
const STAR_COUNT = 40;
const MIN_SIZE = 32;
const MAX_SIZE = 40;
const MIN_DISTANCE = Math.min(width, height) * 0.3;
const MAX_DISTANCE = Math.max(width, height) * 0.7;
const MIN_DURATION = 1600;
const MAX_DURATION = 2600;
const STAR_DURATION_MULTIPLIER = 2;
type StarConfig = {
  id: string;
  type: StarType;
  size: number;
  angle: number;
  distance: number;
  duration: number;
  delay: number;
};
type StarIconProps = {
  type: StarType;
  size: number;
};
type AnimatedStarProps = {
  config: StarConfig;
  centerX: number;
  centerY: number;
};
function StarIcon({ type, size }: StarIconProps) {
  if (type === "sparkle") {
    return <Sparkle width={size} height={size} color="#fff" />;
  }
  if (type === "sparkles") {
    return <Sparkles width={size} height={size} color="#fff" />;
  }
  return <Star width={size} height={size} color="#fff" />;
}
function AnimatedStar({ config, centerX, centerY }: AnimatedStarProps) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(1, {
          duration: config.duration,
          easing: Easing.out(Easing.quad),
        }),
        -1,
        false
      )
    );
  }, [config.delay, config.duration, progress]);
  const animatedStyle = useAnimatedStyle(() => {
    const jitterRadius = MIN_DISTANCE * 0.15;
    const currentDistance =
      jitterRadius + progress.value * (config.distance - jitterRadius);
    const translateX = Math.cos(config.angle) * currentDistance;
    const translateY = Math.sin(config.angle) * currentDistance;
    const scale = 0.3 + progress.value * 0.7;
    const opacity = progress.value === 0 ? 0 : 1 - progress.value;
    return {
      transform: [{ translateX }, { translateY }, { scale }],
      opacity,
    };
  });
  const left = centerX - config.size / 2;
  const top = centerY - config.size / 2;
  return (
    <Animated.View
      style={[
        styles.starContainer,
        animatedStyle,
        {
          left,
          top,
        },
      ]}
    >
      <StarIcon type={config.type} size={config.size} />
    </Animated.View>
  );
}
export default function Stars() {
  const centerX = width / 2;
  const centerY = height / 2;
  const stars = useMemo<StarConfig[]>(() => {
    return Array.from({ length: STAR_COUNT }).map((_, index) => {
      const typeIndex = index % 3;
      const type: StarType =
        typeIndex === 0 ? "sparkle" : typeIndex === 1 ? "sparkles" : "star";
      const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
      const angle = Math.random() * Math.PI * 2;
      const distance =
        MIN_DISTANCE + Math.random() * (MAX_DISTANCE - MIN_DISTANCE);
      const baseDuration =
        MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION);
      const duration = baseDuration * STAR_DURATION_MULTIPLIER;
      const delay = Math.random() * duration;
      return {
        id: `star-${index}`,
        type,
        size,
        angle,
        distance,
        duration,
        delay,
      };
    });
  }, []);
  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <AnimatedStar
          key={star.id}
          config={star}
          centerX={centerX}
          centerY={centerY}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  starContainer: {
    position: "absolute",
  },
});
