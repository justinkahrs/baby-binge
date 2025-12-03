import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Squares() {
    const src = require("../../assets/lotties/loading-squares.json");
    return (
        <View style={styles.container}>
            <LottieView
                source={src}
                autoPlay
                loop
                style={styles.lottie}
                speed={0.45}
                progress={0.25}
            />
            <LottieView
                source={src}
                autoPlay
                loop
                style={styles.lottie}
                speed={0.5}
                progress={0.5}
            />
            <LottieView
                source={src}
                autoPlay
                loop
                style={styles.lottie}
                speed={0.45}
                progress={0.75}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    lottie: {
        width: 300,
        height: 300,
    },
});
