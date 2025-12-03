import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SettingsMenuProps {
    visible: boolean;
    onClose: () => void;
    animationsEnabled: boolean;
    onToggleAnimations: (value: boolean) => void;
    animationStates: Record<string, boolean>;
    onToggleAnimation: (name: string, value: boolean) => void;
    intervalDuration: number;
    onIntervalChange: (value: number) => void;
    isMusicPlaying: boolean;
    onToggleMusic: () => void;
    onNextTrack: () => void;
}

export default function SettingsMenu({
    visible,
    onClose,
    animationsEnabled,
    onToggleAnimations,
    animationStates,
    onToggleAnimation,
    intervalDuration,
    onIntervalChange,
    isMusicPlaying,
    onToggleMusic,
    onNextTrack,
}: SettingsMenuProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                <View style={styles.container}>
                    <Text style={styles.title}>Settings</Text>

                    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                        {/* Master Toggle */}
                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Auto-Play Animations</Text>
                            <Switch
                                value={animationsEnabled}
                                onValueChange={onToggleAnimations}
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={animationsEnabled ? "#f5dd4b" : "#f4f3f4"}
                            />
                        </View>

                        {/* Interval Control */}
                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>
                                Time per Page: {intervalDuration / 1000}s
                            </Text>
                            <View style={styles.counterControls}>
                                <TouchableOpacity
                                    onPress={() =>
                                        onIntervalChange(Math.max(5000, intervalDuration - 5000))
                                    }
                                    style={styles.counterButton}
                                >
                                    <Ionicons name="remove" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => onIntervalChange(intervalDuration + 5000)}
                                    style={styles.counterButton}
                                >
                                    <Ionicons name="add" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Music Controls */}
                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Music</Text>
                            <View style={styles.musicControls}>
                                <TouchableOpacity
                                    onPress={onToggleMusic}
                                    style={styles.musicButton}
                                >
                                    <Ionicons
                                        name={isMusicPlaying ? "pause" : "play"}
                                        size={24}
                                        color="white"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onNextTrack} style={styles.musicButton}>
                                    <Ionicons name="play-skip-forward" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.divider} />
                        <Text style={styles.subTitle}>Enabled Animations</Text>

                        {/* Individual Animation Toggles */}
                        {Object.keys(animationStates).map((name) => (
                            <View key={name} style={styles.settingRow}>
                                <Text style={styles.settingLabel}>{name}</Text>
                                <Switch
                                    value={animationStates[name]}
                                    onValueChange={(value) => onToggleAnimation(name, value)}
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={animationStates[name] ? "#f5dd4b" : "#f4f3f4"}
                                />
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "90%",
        maxHeight: "80%",
        backgroundColor: "#222",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    scrollContainer: {
        width: "100%",
    },
    scrollContent: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
        textAlign: "center",
    },
    subTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#ddd",
        marginTop: 10,
        marginBottom: 15,
        textAlign: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "#444",
        marginVertical: 15,
        width: "100%",
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    settingLabel: {
        fontSize: 16,
        color: "white",
    },
    counterControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    counterButton: {
        backgroundColor: "#444",
        padding: 5,
        borderRadius: 5,
    },
    musicControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    musicButton: {
        backgroundColor: "#444",
        padding: 10,
        borderRadius: 25,
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: "#ff4444",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
    },
    closeButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
