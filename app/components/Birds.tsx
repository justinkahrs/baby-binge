import { Bird, Birdhouse } from "lucide-react-native";
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

const { width, height } = Dimensions.get("window");

const BIRD_COUNT = 7;
const BIRDHOUSE_COUNT = 2;
const BIRD_SIZE = 32;
const BIRDHOUSE_SIZE = 48;

type BirdColor = "red" | "blue" | "yellow";

type BirdhouseConfig = {
    id: string;
    x: number;
    y: number;
};

type BirdConfig = {
    id: string;
    color: BirdColor;
    targetBirdhouse: number;
    startX: number;
    startY: number;
    controlX: number;
    controlY: number;
    targetX: number;
    targetY: number;
    duration: number;
    delay: number;
};

type AnimatedBirdProps = {
    color: BirdColor;
    targetX: number;
    targetY: number;
    startX: number;
    startY: number;
    controlX: number;
    controlY: number;
    duration: number;
    delay: number;
};

const BIRD_COLORS: Record<BirdColor, string> = {
    red: "#ef4444",
    blue: "#3b82f6",
    yellow: "#facc15",
};

function AnimatedBird({
    color,
    targetX,
    targetY,
    startX,
    startY,
    controlX,
    controlY,
    duration,
    delay,
}: AnimatedBirdProps) {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, {
                        duration,
                        easing: Easing.inOut(Easing.sin),
                    }),
                    withTiming(0, {
                        duration,
                        easing: Easing.inOut(Easing.sin),
                    }),
                ),
                -1,
                true,
            ),
        );
    }, [delay, duration, progress]);

    const animatedStyle = useAnimatedStyle(() => {
        const t = progress.value;

        // Quadratic bezier curve calculation with stable control points
        const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * targetX;
        const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * targetY;

        // Add slight rotation during flight
        const rotation = Math.sin(t * Math.PI * 4) * 15;

        // Scale effect (appear to get closer/further)
        const scale = 0.8 + Math.sin(t * Math.PI) * 0.4;

        return {
            transform: [
                { translateX: x - startX },
                { translateY: y - startY },
                { rotate: `${rotation}deg` },
                { scale },
            ],
        };
    });

    return (
        <Animated.View
            style={[
                styles.birdContainer,
                animatedStyle,
                {
                    left: startX,
                    top: startY,
                },
            ]}
        >
            <Bird width={BIRD_SIZE} height={BIRD_SIZE} color={BIRD_COLORS[color]} />
        </Animated.View>
    );
}

export default function Birds() {
    const birdhouses = useMemo<BirdhouseConfig[]>(() => {
        const margin = 60;
        return [
            {
                id: "birdhouse-0",
                x: margin + BIRDHOUSE_SIZE,
                y: height / 2,
            },
            {
                id: "birdhouse-1",
                x: width - margin - BIRDHOUSE_SIZE,
                y: height / 2,
            },
        ];
    }, []);

    const birds = useMemo<BirdConfig[]>(() => {
        const colors: BirdColor[] = ["red", "blue", "yellow"];
        const birdsArray: BirdConfig[] = [];

        for (let i = 0; i < BIRD_COUNT; i++) {
            const color = colors[i % colors.length];
            const targetBirdhouse = Math.floor(Math.random() * BIRDHOUSE_COUNT);

            // Get target birdhouse position
            const targetBirdhousePos = birdhouses[targetBirdhouse];

            // Add some randomness around the birdhouse
            const offsetX = (Math.random() - 0.5) * 80;
            const offsetY = (Math.random() - 0.5) * 80;
            const targetX = targetBirdhousePos.x + offsetX;
            const targetY = targetBirdhousePos.y + offsetY;

            // Random starting position around edges
            const edge = Math.floor(Math.random() * 4);
            let startX = 0;
            let startY = 0;

            switch (edge) {
                case 0: // top
                    startX = Math.random() * width;
                    startY = -BIRD_SIZE;
                    break;
                case 1: // right
                    startX = width + BIRD_SIZE;
                    startY = Math.random() * height;
                    break;
                case 2: // bottom
                    startX = Math.random() * width;
                    startY = height + BIRD_SIZE;
                    break;
                case 3: // left
                    startX = -BIRD_SIZE;
                    startY = Math.random() * height;
                    break;
            }

            // Calculate stable control point for smooth bezier curve
            const controlX = (startX + targetX) / 2 + (Math.random() * 300 - 150);
            const controlY = (startY + targetY) / 2 - (100 + Math.random() * 100); // Arc upward

            birdsArray.push({
                id: `bird-${i}`,
                color,
                targetBirdhouse,
                startX,
                startY,
                controlX,
                controlY,
                targetX,
                targetY,
                duration: 3000 + Math.random() * 2000,
                delay: i * 300,
            });
        }

        return birdsArray;
    }, [birdhouses]);

    return (
        <View style={styles.container}>
            {/* Render birdhouses (fixed position) */}
            {birdhouses.map((birdhouse) => (
                <View
                    key={birdhouse.id}
                    style={[
                        styles.birdhouseContainer,
                        {
                            left: birdhouse.x - BIRDHOUSE_SIZE / 2,
                            top: birdhouse.y - BIRDHOUSE_SIZE / 2,
                        },
                    ]}
                >
                    <Birdhouse width={BIRDHOUSE_SIZE} height={BIRDHOUSE_SIZE} color="#ffffff" />
                </View>
            ))}

            {/* Render animated birds */}
            {birds.map((bird) => (
                <AnimatedBird
                    key={bird.id}
                    color={bird.color}
                    targetX={bird.targetX}
                    targetY={bird.targetY}
                    startX={bird.startX}
                    startY={bird.startY}
                    controlX={bird.controlX}
                    controlY={bird.controlY}
                    duration={bird.duration}
                    delay={bird.delay}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    birdhouseContainer: {
        position: "absolute",
    },
    birdContainer: {
        position: "absolute",
    },
});
