import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Stairs() {
    const src = require("../../assets/lotties/stairs.json");
    return (
        <View style={styles.container}>
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
    },
    lottie: {
        width: 300,
        height: 300,
    },
});
