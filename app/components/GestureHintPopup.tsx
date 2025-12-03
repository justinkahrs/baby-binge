import { Settings } from "lucide-react-native";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import ThreeFingerSvg from "./svgs/ThreeFingerSvg";

interface GestureHintPopupProps {
    visible: boolean;
    onDismiss: () => void;
}

export default function GestureHintPopup({ visible, onDismiss }: GestureHintPopupProps) {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 2000); // Display for 2 seconds
            return () => clearTimeout(timer);
        }
    }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!visible) return null;

    return (
        <Animated.View
            style={styles.container}
            entering={FadeInDown.duration(300)}
            exiting={FadeOutDown.duration(300)}
        >
            <View style={styles.content}>
                <ThreeFingerSvg width={40} height={40} />
                <Text style={styles.text}>Long press with 3 fingers to open</Text>
                <Settings color="#fff" size={24} />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 40,
        left: 20,
        right: 20,
        alignItems: "center",
        zIndex: 1000,
    },
    content: {
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    text: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
        flex: 1,
    },
});
