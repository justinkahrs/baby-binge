import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

export default function Stairs() {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const src = require("../../assets/lotties/stairs.json");
    return (
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>
            <LottieView
                source={src}
                autoPlay
                loop
                style={styles.lottie}
                speed={.75}
            />
            <LottieView
                source={src}
                autoPlay
                loop
                style={styles.lottie}
                speed={.75}
            />
            <LottieView
                source={src}
                autoPlay
                loop
                style={styles.lottie}
                speed={.75}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    containerLandscape: {
        flexDirection: "row",
    },
    lottie: {
        width: 300,
        height: 300,
    },
});
