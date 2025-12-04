import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

// Import SVG components
import MountainSvg from "./svgs/MountainSvg";
import TreeSvg from "./svgs/TreeSvg";
import TruckSvg from "./svgs/TruckSvg";
import WheelsSvg from "./svgs/WheelsSvg";

export default function Truck() {
    const { width } = useWindowDimensions();
    const wrapperWidth = width

    // Tree animations - start on screen
    const tree1Position = useSharedValue(500);
    const tree2Position = useSharedValue(300);
    const tree3Position = useSharedValue(700);

    // Rock animation
    const rockPosition = useSharedValue(-200);

    // Truck bounce animation
    const truckY = useSharedValue(0);

    // Mountain animations
    const mountainX = useSharedValue(0);

    useEffect(() => {
        // Tree animations with different durations
        tree1Position.value = withRepeat(
            withSequence(
                withTiming(-100, { duration: 3000, easing: Easing.linear }),
                withTiming(700, { duration: 0 })
            ),
            -1,
            false
        );

        tree2Position.value = withRepeat(
            withSequence(
                withTiming(-100, { duration: 2000, easing: Easing.linear }),
                withTiming(700, { duration: 0 })
            ),
            -1,
            false
        );

        tree3Position.value = withRepeat(
            withSequence(
                withTiming(-100, { duration: 8000, easing: Easing.linear }),
                withTiming(700, { duration: 0 })
            ),
            -1,
            false
        );

        // Rock animation
        rockPosition.value = withRepeat(
            withSequence(
                withTiming(700, { duration: 4000, easing: Easing.linear }),
                withTiming(-200, { duration: 0 })
            ),
            -1,
            false
        );

        // Truck bounce animation - matches the keyframes from CSS
        truckY.value = withRepeat(
            withSequence(
                withTiming(0, { duration: 240, easing: Easing.ease }), // 0% to 6%
                withTiming(-6, { duration: 40, easing: Easing.ease }), // 6% to 7%
                withTiming(0, { duration: 80, easing: Easing.ease }), // 7% to 9%
                withTiming(-1, { duration: 40, easing: Easing.ease }), // 9% to 10%
                withTiming(0, { duration: 40, easing: Easing.ease }), // 10% to 11%
                withTiming(0, { duration: 3560, easing: Easing.ease }) // 11% to 100%
            ),
            -1,
            false
        );

        // Mountain animation
        mountainX.value = withRepeat(
            withSequence(
                withTiming(-800, { duration: 20000, easing: Easing.linear }),
                withTiming(0, { duration: 0 })
            ),
            -1,
            false
        );


    }, []);

    const tree1Style = useAnimatedStyle(() => ({
        transform: [{ translateX: tree1Position.value }],
    }));

    const tree2Style = useAnimatedStyle(() => ({
        transform: [{ translateX: tree2Position.value }],
    }));

    const tree3Style = useAnimatedStyle(() => ({
        transform: [{ translateX: tree3Position.value }],
    }));

    const rockStyle = useAnimatedStyle(() => ({
        right: rockPosition.value,
    }));

    const truckStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: truckY.value }],
    }));

    const mountainStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: mountainX.value }],
    }));



    return (
        <LinearGradient
            colors={['#000', '#000']}
            style={styles.background}
        >
            <View style={[styles.loopWrapper, { width: wrapperWidth }]}>
                {/* Mountains - multiple for depth */}
                <Animated.View style={[styles.mountain1, mountainStyle]}>
                    <MountainSvg />
                </Animated.View>
                <Animated.View style={[styles.mountain2, mountainStyle]}>
                    <MountainSvg />
                </Animated.View>
                <Animated.View style={[styles.mountain3, mountainStyle]}>
                    <MountainSvg />
                </Animated.View>



                {/* Trees */}
                <Animated.View style={[styles.treeContainer, tree1Style]}>
                    <TreeSvg />
                </Animated.View>
                <Animated.View style={[styles.treeContainer, tree2Style]}>
                    <TreeSvg />
                </Animated.View>
                <Animated.View style={[styles.treeContainer, tree3Style]}>
                    <TreeSvg />
                </Animated.View>

                {/* Rock */}
                <Animated.View style={[styles.rock, rockStyle]} />

                {/* Truck and Wheels (both bounce together) */}
                <Animated.View style={[styles.truckContainer, truckStyle]}>
                    <TruckSvg />
                </Animated.View>

                <Animated.View style={[styles.wheelsContainer, truckStyle]}>
                    <WheelsSvg />
                </Animated.View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loopWrapper: {
        height: 250,
        overflow: "hidden",
        borderBottomWidth: 3,
        borderBottomColor: "#fff",
        position: "relative",
        backgroundColor: '#000',
    },
    // Multiple mountains for depth effect
    mountain1: {
        position: "absolute",
        right: 100,
        bottom: 50,
        width: 200,
        height: 150,
    },
    mountain2: {
        position: "absolute",
        right: 300,
        bottom: 30,
        width: 200,
        height: 150,
    },
    mountain3: {
        position: "absolute",
        right: 500,
        bottom: 40,
        width: 200,
        height: 150,
    },

    treeContainer: {
        position: "absolute",
        bottom: 0,
        width: 32,
        height: 100,
    },
    rock: {
        position: "absolute",
        bottom: -2,
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: "#ddd",
    },
    truckContainer: {
        position: "absolute",
        bottom: 0,
        right: "50%",
        width: 85,
        height: 60,
        marginRight: -42.5,
    },
    wheelsContainer: {
        position: "absolute",
        bottom: 0,
        right: "50%",
        width: 85,
        height: 15,
        marginRight: -42.5,
    },
});
