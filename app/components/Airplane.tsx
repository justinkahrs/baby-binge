import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Airplane() {
    const src = require("../../assets/lotties/airplane.json");
    return (
        <View style={styles.container}>
            <LottieView
                source={src}
                autoPlay
                loop
                style={styles.lottie}
                resizeMode="cover"

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
        width: "100%",
        height: "100%",
    },
});
