import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, useWindowDimensions } from "react-native";
// Firework config
const NUM_PARTICLES = 24;
const PARTICLE_SIZE = 8;
const FIREWORK_SPEED = 2; // tweak this multiplier to speed up or slow down the burst
const BURST_DURATION = 1100 * FIREWORK_SPEED; // ms for a single burst
const GAP_MIN = 500; // min gap between repeats of the same firework
const GAP_VAR = 900; // variable extra gap (randomized 0..GAP_VAR)
const COLORS = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#32ADE6",
  "#5856D6",
  "#AF52DE",
  "#FF2D55",
];
function rand(min: number, max: number) {
  "worklet";
  return Math.random() * (max - min) + min;
}
export type FireworkProps = {
  startDelay?: number;
  seed?: number;
};
const Firework: React.FC<FireworkProps> = ({ startDelay = 0, seed = 0 }) => {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const BURST_RADIUS = Math.min(SCREEN_W, SCREEN_H) * 0.28;

  const progress = useRef(new Animated.Value(0)).current;
  const [center, setCenter] = useState(() => {
    const margin = Math.min(SCREEN_W, SCREEN_H) * 0.12;
    return {
      x: rand(margin, SCREEN_W - margin),
      y: rand(margin * 1.5, SCREEN_H - margin * 1.5),
    };
  });
  const angles = useMemo(() => {
    const base: number[] = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const theta =
        (i / NUM_PARTICLES) * Math.PI * 2 + rand(-Math.PI / 24, Math.PI / 24);
      base.push(theta);
    }
    return base;
  }, [seed]);
  const animate = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: BURST_DURATION,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      const margin = Math.min(SCREEN_W, SCREEN_H) * 0.12;
      setCenter({
        x: rand(margin, SCREEN_W - margin),
        y: rand(margin * 1.5, SCREEN_H - margin * 1.5),
      });
      const gap = GAP_MIN + Math.random() * GAP_VAR;
      setTimeout(animate, gap);
    });
  };
  useEffect(() => {
    const id = setTimeout(animate, startDelay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const opacity = progress.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 1, 0],
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.fireworkContainer,
        { left: center.x, top: center.y, opacity },
      ]}
    >
      {angles.map((theta, i) => {
        const color = COLORS[i % COLORS.length];
        const distance = BURST_RADIUS * (0.85 + (i % 5) * 0.03);
        const tx = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(theta) * distance],
        });
        const ty = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(theta) * distance],
        });
        const scale = progress.interpolate({
          inputRange: [0, 0.1, 1],
          outputRange: [0.4, 1, 1],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                backgroundColor: color,
                transform: [{ translateX: tx }, { translateY: ty }, { scale }],
              },
            ]}
          />
        );
      })}
    </Animated.View>
  );
};
const FireWorks = () => (
  <>
    <Firework seed={0} startDelay={0} />
    <Firework seed={1} startDelay={200} />
    <Firework seed={2} startDelay={450} />
    <Firework seed={4} startDelay={700} />
    <Firework seed={5} startDelay={920} />
  </>
);
export default FireWorks;
const styles = StyleSheet.create({
  fireworkContainer: {
    position: "absolute",
    width: 0,
    height: 0,
  },
  particle: {
    position: "absolute",
    width: PARTICLE_SIZE,
    height: PARTICLE_SIZE,
    borderRadius: PARTICLE_SIZE / 2,
    left: -PARTICLE_SIZE / 2,
    top: -PARTICLE_SIZE / 2,
  },
});
