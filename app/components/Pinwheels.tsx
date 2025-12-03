import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");

const PINWHEEL_SIZE = 80;
const SPACING = 20;

function GradientPinwheel() {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 3000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <Animated.View style={[styles.pinwheelContainer, animatedStyle]}>
            <Svg width={PINWHEEL_SIZE} height={PINWHEEL_SIZE} viewBox="0 0 24 24">
                <Defs>
                    <LinearGradient id="rainbow" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor="#FF0000" />
                        <Stop offset="17%" stopColor="#FF7F00" />
                        <Stop offset="33%" stopColor="#FFFF00" />
                        <Stop offset="50%" stopColor="#00FF00" />
                        <Stop offset="67%" stopColor="#0000FF" />
                        <Stop offset="83%" stopColor="#4B0082" />
                        <Stop offset="100%" stopColor="#9400D3" />
                    </LinearGradient>
                </Defs>
                <Path
                    d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0"
                    stroke="url(#rainbow)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <Path
                    d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6"
                    stroke="url(#rainbow)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <Path
                    d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6"
                    stroke="url(#rainbow)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <Circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="url(#rainbow)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </Svg>
        </Animated.View>
    );
}

export default function Pinwheels() {
    // Calculate how many pinwheels fit in a row
    const itemsPerRow = Math.floor(width / (PINWHEEL_SIZE + SPACING));
    // Create two rows
    const row1 = Array.from({ length: itemsPerRow }, (_, i) => i);
    const row2 = Array.from({ length: itemsPerRow - 1 }, (_, i) => i);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {row1.map((i) => (
                    <View key={`r1-${i}`} style={styles.item}>
                        <GradientPinwheel />
                    </View>
                ))}
            </View>
            <View style={[styles.row, styles.staggeredRow]}>
                {row2.map((i) => (
                    <View key={`r2-${i}`} style={styles.item}>
                        <GradientPinwheel />
                    </View>
                ))}
            </View>
            <View style={styles.row}>
                {row1.map((i) => (
                    <View key={`r3-${i}`} style={styles.item}>
                        <GradientPinwheel />
                    </View>
                ))}
            </View>
            <View style={[styles.row, styles.staggeredRow]}>
                {row2.map((i) => (
                    <View key={`r4-${i}`} style={styles.item}>
                        <GradientPinwheel />
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
        gap: SPACING * 2,
    },
    row: {
        flexDirection: "row",
        gap: SPACING,
    },
    staggeredRow: {
        // Offset the second row slightly if needed, or just relying on different count
    },
    item: {
        width: PINWHEEL_SIZE,
        height: PINWHEEL_SIZE,
    },
    pinwheelContainer: {
        width: "100%",
        height: "100%",
    },
});
